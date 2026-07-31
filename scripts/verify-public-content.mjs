import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicRoots = ["app", "src", "content", "public"];
const readableExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".mdx",
  ".mjs",
  ".ts",
  ".tsx",
]);
const errors = [];

function toRepositoryPath(filePath) {
  return relative(repositoryRoot, filePath).split(sep).join("/");
}

function report(filePath, rule) {
  errors.push(`${toRepositoryPath(filePath)}: ${rule}`);
}

function walk(directory) {
  if (!existsSync(directory)) return [];

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) return walk(absolutePath);
    return entry.isFile() ? [absolutePath] : [];
  });
}

function readPublicTextFiles() {
  return publicRoots
    .flatMap((directory) => walk(join(repositoryRoot, directory)))
    .filter((filePath) => readableExtensions.has(extname(filePath).toLowerCase()))
    .map((filePath) => ({
      filePath,
      content: readFileSync(filePath, "utf8"),
    }));
}

function isDraftMdx(filePath, content) {
  if (extname(filePath).toLowerCase() !== ".mdx") return false;
  const frontmatter = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  return frontmatter ? /^draft:\s*true\s*$/im.test(frontmatter[1]) : false;
}

const publicTextFiles = readPublicTextFiles();
const implementationFiles = publicTextFiles.filter(
  ({ filePath, content }) => !isDraftMdx(filePath, content)
);

const forbiddenRules = [
  { rule: "forbidden-legacy-name", pattern: /\bMingyuan(?:\s+Yang)?\b/i },
  {
    rule: "forbidden-phone-number-email",
    pattern: /\b1[3-9]\d{9}@[a-z0-9.-]+\.[a-z]{2,}\b/i,
  },
  { rule: "forbidden-phone-number", pattern: /\b1[3-9]\d{9}\b/ },
  { rule: "forbidden-fixed-visitor-count", pattern: /\b1024\b/ },
  {
    rule: "unsupported-ai-claim",
    pattern:
      /YOLOv11n|TensorRT 8|23 FPS|3\.7×|mAP@50|ID Switch|87\.6%|IEEE Internet of Things Journal|ORB-SLAM3|ATE RMSE|0\.043m|ROS2 Humble|Allan 方差|Jetson Nano 4GB/i,
  },
];

for (const { filePath, content } of implementationFiles) {
  for (const { rule, pattern } of forbiddenRules) {
    if (pattern.test(content)) report(filePath, rule);
  }
}

const localAssetPattern =
  /["'`](\/(?!\/)[^"'`\s?#]+\.(?:gif|ico|jpe?g|pdf|png|svg|webp))(?:[?#][^"'`]*)?["'`]/gi;
const checkedAssets = new Set();

for (const { filePath, content } of implementationFiles) {
  for (const match of content.matchAll(localAssetPattern)) {
    const publicPath = match[1];
    if (checkedAssets.has(publicPath)) continue;
    checkedAssets.add(publicPath);

    const relativeAssetPath = publicPath.slice(1).replaceAll("/", sep);
    const candidates = [
      join(repositoryRoot, "public", relativeAssetPath),
      join(repositoryRoot, "app", relativeAssetPath),
    ];

    if (!candidates.some((candidate) => existsSync(candidate) && statSync(candidate).isFile())) {
      report(filePath, "missing-local-static-asset");
    }
  }
}

const identityPath = join(repositoryRoot, "src", "data", "profile", "identity.ts");
const homePagePath = join(repositoryRoot, "app", "[lang]", "page.tsx");
const identitySource = readFileSync(identityPath, "utf8");
const homePageSource = readFileSync(homePagePath, "utf8");
const approvedEmail = "yangc202706@163.com";
const publicEmailMatches = implementationFiles.flatMap(({ filePath, content }) =>
  [...content.matchAll(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi)].map(
    (match) => ({ filePath, value: match[0] })
  )
);
for (const match of publicEmailMatches) {
  if (match.value !== approvedEmail || match.filePath !== identityPath) {
    report(match.filePath, "unapproved-or-hardcoded-public-email");
  }
}
if (
  publicEmailMatches.filter(
    (match) => match.filePath === identityPath && match.value === approvedEmail
  ).length !== 1
) {
  report(identityPath, "approved-public-email-not-unique");
}

if (
  /download\s*=|Download Resume|下载简历|\.pdf\b/i.test(homePageSource)
) {
  report(homePagePath, "stale-pdf-download-entry");
}

const publicAssetNames = walk(join(repositoryRoot, "public")).map((filePath) =>
  toRepositoryPath(filePath)
);
for (const assetName of publicAssetNames) {
  if (/patent|certificate|证书|专利/i.test(assetName)) {
    report(join(repositoryRoot, assetName), "sensitive-certificate-asset-present");
  }
}

const postsLibraryPath = join(repositoryRoot, "src", "lib", "posts.ts");
const postsLibrarySource = readFileSync(postsLibraryPath, "utf8");
if (!/if\s*\(data\.draft\s*===\s*true\)\s*return\s*\[\]/.test(postsLibrarySource)) {
  report(postsLibraryPath, "draft-present-in-public-list");
}
if (!/if\s*\(data\.draft\s*===\s*true\)\s*return\s+null/.test(postsLibrarySource)) {
  report(postsLibraryPath, "draft-present-in-public-slug-set");
}

const draftSlugs = publicTextFiles
  .filter(({ filePath, content }) => isDraftMdx(filePath, content))
  .map(({ filePath }) => relative(join(repositoryRoot, "content", "posts"), filePath))
  .map((fileName) => fileName.replace(/\.mdx$/i, ""));
const publicRouteSources = implementationFiles.filter(({ filePath }) =>
  ["app", "src"].includes(relative(repositoryRoot, filePath).split(sep)[0])
);

for (const draftSlug of draftSlugs) {
  for (const { filePath, content } of publicRouteSources) {
    if (content.includes(draftSlug)) {
      report(filePath, "draft-slug-hardcoded-in-public-route");
    }
  }
}

const publicProfilePath = join(repositoryRoot, "src", "data", "publicProfile.ts");
const publicProfileSource = readFileSync(publicProfilePath, "utf8");
if (!/zh:\s*["']杨冲["']/.test(identitySource)) {
  report(identityPath, "incorrect-public-profile-name-zh");
}
if (!/en:\s*["']Yang Chong["']/.test(identitySource)) {
  report(identityPath, "incorrect-public-profile-name-en");
}
if (!publicProfileSource.includes("publicIdentity")) {
  report(publicProfilePath, "public-profile-bypasses-identity-source");
}

const legacyConsumerPatterns = [
  {
    name: "resumeData",
    pattern: /from\s+["']@\/src\/data\/resumeData["']/,
  },
  {
    name: "publicProfile",
    pattern: /from\s+["']@\/src\/data\/publicProfile["']/,
  },
];

for (const { filePath, content } of publicRouteSources) {
  for (const { name, pattern } of legacyConsumerPatterns) {
    if (pattern.test(content)) {
      report(filePath, `legacy-${name}-consumer`);
    }
  }
}

if (errors.length > 0) {
  for (const error of [...new Set(errors)].sort()) {
    console.error(`Public content verification failed: ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Public content verification passed (${implementationFiles.length} public text files, ${checkedAssets.size} local assets).`
  );
}
