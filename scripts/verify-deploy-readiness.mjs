import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  APPROVED_EMAIL,
  EMAIL_APPROVED_FILES,
  extractPdfText,
  findEmails,
  hasUnapprovedPhoneNumber,
  scanPdfRawText,
} from "./lib-approved-contacts.mjs";
import { isDeclaredPendingAsset } from "./lib-pending-assets.mjs";

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
  const relativePath = repositoryPath(filePath);
  // 已授权公开的手机号只允许出现在身份数据层
  if (
    hasUnapprovedPhoneNumber(content) ||
    (/\b1[3-9]\d{9}\b/.test(content) &&
      relativePath !== "src/data/profile/identity.ts")
  ) {
    fail("public-phone-number-present", relativePath);
  }
  for (const email of findEmails(content)) {
    if (
      email !== APPROVED_EMAIL ||
      !EMAIL_APPROVED_FILES.has(relativePath)
    ) {
      fail("unapproved-public-email-address-present", relativePath);
    }
  }
}

// 正式版简历 PDF（全站唯一官方文件）必须存在且文字可审计
const resumePdfAsset = join(repositoryRoot, "public", "杨冲个人简历.pdf");
if (!existsSync(resumePdfAsset)) {
  fail("missing-public-resume-pdf");
} else {
  const extracted = extractPdfText(resumePdfAsset);
  let pdfText = extracted.text;
  if (!extracted.ok) {
    notices.push(`resume-pdf-text-not-audited:${extracted.reason}`);
    pdfText = scanPdfRawText(resumePdfAsset);
  }
  if (hasUnapprovedPhoneNumber(pdfText)) {
    fail("public-resume-pdf-unapproved-phone-number");
  }
  for (const email of findEmails(pdfText)) {
    if (email !== APPROVED_EMAIL) {
      fail("public-resume-pdf-unapproved-email-address");
    }
  }
}

const localAssetPattern =
  /["'`](\/(?!\/)[^"'`\s?#]+\.(?:gif|ico|jpe?g|pdf|png|svg|webp))(?:[?#][^"'`]*)?["'`]/gi;
const checkedAssets = new Set();
const pendingAssets = new Set();
for (const filePath of publicTextFiles) {
  const content = readFileSync(filePath, "utf8");
  for (const match of content.matchAll(localAssetPattern)) {
    const publicPath = match[1];
    if (checkedAssets.has(publicPath)) continue;
    checkedAssets.add(publicPath);
    /**
     * 资源路径允许百分号编码（例如中文文件名 `/杨冲个人简历.pdf` 写成
     * `/%E6%9D%A8...pdf`，以便英文页面 HTML 不出现中文字符），检查前先解码。
     */
    let decodedAssetPath = publicPath;
    try {
      decodedAssetPath = decodeURIComponent(publicPath);
    } catch {
      decodedAssetPath = publicPath;
    }
    const relativeAssetPath = decodedAssetPath.slice(1).replaceAll("/", sep);
    const candidates = [
      join(repositoryRoot, "public", relativeAssetPath),
      join(repositoryRoot, "app", relativeAssetPath),
    ];
    if (candidates.some((candidate) => existsSync(candidate) && statSync(candidate).isFile())) {
      continue;
    }
    // 已登记「待放置」的项目展示图片 / 文档：跳过并提示，不阻塞发布校验
    if (isDeclaredPendingAsset(decodedAssetPath)) {
      pendingAssets.add(publicPath);
      continue;
    }
    fail("missing-static-asset", publicPath);
  }
}
if (pendingAssets.size > 0) {
  notices.push(
    `${pendingAssets.size} reserved project asset(s) still pending upload to public/`
  );
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

/**
 * sitemap 契约：必须与当前真实公开路由清单一致。
 *
 * 当前有效公开路由：`/[lang]`、`/[lang]/about`、`/[lang]/contact`、
 * `/[lang]/honors`、`/[lang]/projects`、`/[lang]/projects/[slug]`、`/[lang]/resume`，
 * 以及（仅在存在已发布文章时）`/[lang]/blog` 与 `/[lang]/blog/[slug]`。
 * `/[lang]/research` 已永久重定向到 `/[lang]/projects`，不得再出现在 sitemap 中。
 */
const sitemapSource = readFileSync(
  join(repositoryRoot, "app", "sitemap.ts"),
  "utf8"
);
const sitemapRequiredFragments = [
  "`/${locale}`",
  "`/${locale}/projects`",
  "`/${locale}/about`",
  "`/${locale}/contact`",
  "`/${locale}/honors`",
  "`/${locale}/resume`",
  "publicProjects",
  "getAllPostMetas",
];
if (
  sitemapRequiredFragments.some(
    (fragment) => !sitemapSource.includes(fragment)
  )
) {
  fail("sitemap-public-route-contract-missing");
}
if (sitemapSource.includes("${locale}/research")) {
  fail("sitemap-lists-retired-route", "/research");
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
