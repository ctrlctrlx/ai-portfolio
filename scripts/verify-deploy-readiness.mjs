import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const notices = [];
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

function fail(rule, detail = "") {
  errors.push(detail ? `${rule}: ${detail}` : rule);
}

function repositoryPath(filePath) {
  return relative(repositoryRoot, filePath).split(sep).join("/");
}

function walk(directory, excludedNames = new Set()) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (excludedNames.has(entry.name)) return [];
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) return walk(absolutePath, excludedNames);
    return entry.isFile() ? [absolutePath] : [];
  });
}

function parseVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
  return match ? match.slice(1).map(Number) : null;
}

function versionAtLeast(actual, required) {
  const actualParts = parseVersion(actual);
  const requiredParts = parseVersion(required);
  if (!actualParts || !requiredParts) return false;
  for (let index = 0; index < 3; index += 1) {
    if (actualParts[index] > requiredParts[index]) return true;
    if (actualParts[index] < requiredParts[index]) return false;
  }
  return true;
}

const packageJsonPath = join(repositoryRoot, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const requiredNodeVersion =
  typeof packageJson.engines?.node === "string"
    ? packageJson.engines.node.replace(/^[^\d]*/, "")
    : null;
if (!requiredNodeVersion || !versionAtLeast(process.versions.node, requiredNodeVersion)) {
  fail("unsupported-node-version");
}

const npmUserAgent = process.env.npm_config_user_agent;
const actualNpmVersion = npmUserAgent?.match(/\bnpm\/([^\s]+)/)?.[1];
if (!actualNpmVersion) {
  fail("npm-version-unavailable");
} else {
  const expectedNpmVersion =
    typeof packageJson.packageManager === "string"
      ? packageJson.packageManager.match(/^npm@(.+)$/)?.[1]
      : null;
  if (!expectedNpmVersion || actualNpmVersion !== expectedNpmVersion) {
    fail("npm-version-mismatch");
  }
}

const requiredScripts = [
  "dev",
  "build",
  "lint",
  "typecheck",
  "verify:content",
  "verify:profile",
  "verify:chat",
  "verify:resume",
  "verify",
  "verify:deploy",
  "verify:all",
];
for (const scriptName of requiredScripts) {
  if (typeof packageJson.scripts?.[scriptName] !== "string") {
    fail("missing-package-script", scriptName);
  }
}

for (const [scriptName, command] of Object.entries(packageJson.scripts ?? {})) {
  if (/\bgit\s+push\b|\b(?:npx\s+)?vercel(?:\s|$)|\bnext\s+deploy\b/i.test(command)) {
    fail("push-or-deploy-script-present", scriptName);
  }
}

const environmentFiles = readdirSync(repositoryRoot).filter((name) =>
  /^\.env(?:\.|$)/i.test(name)
);
for (const fileName of environmentFiles) {
  if (fileName !== ".env.example") {
    fail("local-environment-file-present", fileName);
  }
}

const repositoryFiles = walk(
  repositoryRoot,
  new Set([".git", ".next", "node_modules", "out", "coverage"])
);
for (const filePath of repositoryFiles) {
  if (/^tmpclaude-/i.test(filePath.split(sep).at(-1) ?? "")) {
    fail("temporary-agent-file-present", repositoryPath(filePath));
  }
}

const publicTextFiles = [
  join(repositoryRoot, "app"),
  join(repositoryRoot, "src", "components"),
  join(repositoryRoot, "src", "data", "profile"),
  join(repositoryRoot, "content"),
  join(repositoryRoot, "public"),
]
  .flatMap((directory) => walk(directory))
  .filter((filePath) => readableExtensions.has(extname(filePath).toLowerCase()));
for (const filePath of publicTextFiles) {
  const content = readFileSync(filePath, "utf8");
  if (/\b1[3-9]\d{9}\b/.test(content)) {
    fail("public-phone-number-present", repositoryPath(filePath));
  }
  const emailMatches =
    content.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi) ?? [];
  for (const email of emailMatches) {
    if (
      email !== "yangc202706@163.com" ||
      repositoryPath(filePath) !== "src/data/profile/identity.ts"
    ) {
      fail("unapproved-public-email-address-present", repositoryPath(filePath));
    }
  }
}

const localAssetPattern =
  /["'`](\/(?!\/)[^"'`\s?#]+\.(?:gif|ico|jpe?g|pdf|png|svg|webp))(?:[?#][^"'`]*)?["'`]/gi;
const checkedAssets = new Set();
for (const filePath of publicTextFiles) {
  const content = readFileSync(filePath, "utf8");
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
      fail("missing-static-asset", publicPath);
    }
  }
}

const buildIdPath = join(repositoryRoot, ".next", "BUILD_ID");
if (!existsSync(buildIdPath)) {
  fail("production-build-artifact-missing");
} else {
  const sourcePaths = [
    ...["app", "src", "content", "public"].flatMap((directory) =>
      walk(join(repositoryRoot, directory))
    ),
    packageJsonPath,
    join(repositoryRoot, "next.config.ts"),
    join(repositoryRoot, "tsconfig.json"),
  ].filter(existsSync);
  const latestSourceTime = Math.max(
    ...sourcePaths.map((filePath) => statSync(filePath).mtimeMs)
  );
  if (statSync(buildIdPath).mtimeMs < latestSourceTime) {
    fail("production-build-artifact-stale");
  }
}

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
if (configuredSiteUrl) {
  try {
    const siteUrl = new URL(configuredSiteUrl);
    if (
      siteUrl.protocol !== "https:" ||
      siteUrl.username ||
      siteUrl.password ||
      ["localhost", "127.0.0.1"].includes(siteUrl.hostname) ||
      siteUrl.pathname !== "/" ||
      siteUrl.search ||
      siteUrl.hash
    ) {
      fail("invalid-site-url");
    }
  } catch {
    fail("invalid-site-url");
  }
}

const siteUrlSource = readFileSync(
  join(repositoryRoot, "src", "lib", "siteUrl.ts"),
  "utf8"
);
if (
  !/DEFAULT_SITE_URL\s*=\s*["']https:\/\/ctrlctrlx\.top["']/.test(siteUrlSource)
) {
  fail("confirmed-default-site-url-missing");
}
if (/if\s*\(!configuredUrl\)\s*return\s+null/.test(siteUrlSource)) {
  fail("default-site-url-remains-disabled");
}

const envExampleSource = readFileSync(
  join(repositoryRoot, ".env.example"),
  "utf8"
);
if (
  !/^NEXT_PUBLIC_SITE_URL=https:\/\/ctrlctrlx\.top$/m.test(envExampleSource)
) {
  fail("env-example-site-url-mismatch");
}

const sitemapSource = readFileSync(
  join(repositoryRoot, "app", "sitemap.ts"),
  "utf8"
);
if (
  !sitemapSource.includes("publicProjects") ||
  !sitemapSource.includes("publicResearchAreas") ||
  !sitemapSource.includes("publicPatents") ||
  !sitemapSource.includes('basePaths.push(`/${locale}/resume`)')
) {
  fail("sitemap-public-route-contract-missing");
}

for (const notice of notices) {
  console.log(`Deploy readiness notice: ${notice}`);
}

if (errors.length > 0) {
  for (const error of [...new Set(errors)].sort()) {
    console.error(`Deploy readiness verification failed: ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Deploy readiness verification passed (${checkedAssets.size} local assets checked; deployment was not performed).`
  );
}
