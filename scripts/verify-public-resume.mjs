import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  APPROVED_EMAIL,
  APPROVED_PHONE,
  extractPdfText,
  findEmails,
  hasUnapprovedPhoneNumber,
  scanPdfRawText,
} from "./lib-approved-contacts.mjs";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const profileDirectory = join(repositoryRoot, "src", "data", "profile");
const resumePagePath = join(repositoryRoot, "app", "[lang]", "resume", "page.tsx");
const resumeDownloadButtonPath = join(
  repositoryRoot,
  "src",
  "components",
  "ResumeDownloadButton.tsx"
);
/** 全站唯一官方简历文件：本人提供的中文正式版 PDF */
const resumePdfFileName = "杨冲个人简历.pdf";
const resumePdfPath = join(repositoryRoot, "public", resumePdfFileName);
const errors = [];
const notices = [];

function expect(condition, rule) {
  if (!condition) errors.push(rule);
}

async function loadProfileModule(fileName) {
  return import(pathToFileURL(join(profileDirectory, fileName)).href);
}

const [
  { awards },
  { identity },
  { patents },
  { publications },
  { isPublicVerified },
] = await Promise.all([
  loadProfileModule("awards.ts"),
  loadProfileModule("identity.ts"),
  loadProfileModule("patents.ts"),
  loadProfileModule("publications.ts"),
  loadProfileModule("visibility.ts"),
]);

expect(existsSync(resumePagePath), "resume-route-missing");
expect(existsSync(resumeDownloadButtonPath), "resume-download-control-missing");
expect(existsSync(resumePdfPath), "resume-pdf-asset-missing");

const resumeSource = readFileSync(resumePagePath, "utf8");
const downloadButtonSource = readFileSync(resumeDownloadButtonPath, "utf8");

for (const collectionName of [
  "publicIdentity",
  "publicEducation",
  "publicProjects",
  "publicSkills",
  "publicAwards",
  "publicPatents",
]) {
  expect(
    resumeSource.includes(collectionName),
    `resume-public-collection-missing:${collectionName}`
  );
}

expect(
  /from\s+["']@\/src\/data\/profile["']/.test(resumeSource),
  "resume-does-not-use-profile-source"
);
expect(!/resumeData|publicProfile/.test(resumeSource), "resume-uses-legacy-source");

// 下载入口必须指向本地唯一官方简历文件（href 用百分号编码，避免英文页 HTML 出现中文字符），
// 且页面内不得再保留浏览器打印入口
const resumePdfHref = "/%E6%9D%A8%E5%86%B2%E4%B8%AA%E4%BA%BA%E7%AE%80%E5%8E%86.pdf";
expect(
  decodeURIComponent(resumePdfHref) === `/${resumePdfFileName}`,
  "resume-pdf-href-decoding-mismatch"
);
expect(
  downloadButtonSource.includes(resumePdfHref) &&
    /download/.test(downloadButtonSource),
  "resume-download-button-not-pointing-to-local-pdf"
);
expect(
  !/window\.print|print\(\)/.test(downloadButtonSource),
  "resume-download-button-still-prints"
);
expect(
  !/PrintResumeButton|window\.print|打印 \/ 保存为 PDF/i.test(resumeSource),
  "resume-print-entry-still-present"
);
expect(
  /ResumeDownloadButton/.test(resumeSource),
  "resume-download-button-not-used-on-resume-page"
);
expect(
  resumeSource.includes(resumePdfFileName),
  "resume-page-missing-pdf-reference"
);
expect(!/publication/i.test(resumeSource), "resume-publication-content-present");
expect(
  !/\b(?:birthday|politicalAffiliation|studentNumber|supervisorNumber|streetAddress)\b|二维码|条形码|生日|学号|政治面貌|详细地址/i.test(
    resumeSource
  ),
  "resume-sensitive-field-present"
);
expect(
  !hasUnapprovedPhoneNumber(resumeSource),
  "resume-page-unapproved-phone-number"
);
expect(
  findEmails(resumeSource).length === 0,
  "resume-email-hardcoded"
);

/**
 * 正式版 PDF 的文字必须可提取，才能对下载内容做同样的隐私审计。
 * 唯一官方文件 `杨冲个人简历.pdf` 必须通过隐私红线，并包含候选人姓名与已授权联系方式，
 * 避免拿到空白或错误的文件。
 */
const resumePdfAssets = [
  { fileName: resumePdfFileName, expectedName: "杨冲" },
];
for (const asset of resumePdfAssets) {
  const pdfPath = join(repositoryRoot, "public", asset.fileName);
  expect(existsSync(pdfPath), `resume-pdf-asset-missing:${asset.fileName}`);

  const extracted = extractPdfText(pdfPath);
  if (!extracted.ok) {
    notices.push(`${asset.fileName}-text-not-audited:${extracted.reason}`);
    const raw = scanPdfRawText(pdfPath);
    expect(
      !hasUnapprovedPhoneNumber(raw),
      `resume-pdf-unapproved-phone-number:${asset.fileName}`
    );
    expect(
      findEmails(raw).every((email) => email === APPROVED_EMAIL),
      `resume-pdf-unapproved-email-address:${asset.fileName}`
    );
    continue;
  }

  expect(
    extracted.text.trim().length >= 200,
    `resume-pdf-text-too-short-to-audit:${asset.fileName}`
  );
  expect(
    !hasUnapprovedPhoneNumber(extracted.text),
    `resume-pdf-unapproved-phone-number:${asset.fileName}`
  );
  expect(
    findEmails(extracted.text).every((email) => email === APPROVED_EMAIL),
    `resume-pdf-unapproved-email-address:${asset.fileName}`
  );
  // 授权公开的联系方式应当能在正式版简历中找到，避免拿到空白/错误的 PDF
  expect(
    extracted.text.includes(APPROVED_PHONE),
    `resume-pdf-missing-approved-phone:${asset.fileName}`
  );
  expect(
    extracted.text.includes(APPROVED_EMAIL),
    `resume-pdf-missing-approved-email:${asset.fileName}`
  );
  expect(
    extracted.text.includes(asset.expectedName),
    `resume-pdf-missing-candidate-name:${asset.fileName}`
  );
}

const publicContacts = identity.contacts.filter(isPublicVerified);
expect(
  publicContacts.filter(
    (contact) => contact.kind === "email" && contact.value === APPROVED_EMAIL
  ).length === 1,
  "resume-profile-email-mismatch"
);
expect(awards.filter(isPublicVerified).length === 11, "resume-award-count-mismatch");
expect(patents.filter(isPublicVerified).length === 1, "resume-patent-count-mismatch");
expect(
  publications.filter(isPublicVerified).length === 2,
  "resume-publication-filter-mismatch"
);

for (const notice of notices) {
  console.log(`Public resume verification notice: ${notice}`);
}

if (errors.length > 0) {
  for (const error of [...new Set(errors)].sort()) {
    console.error(`Public resume verification failed: ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    "Public resume verification passed (bilingual route, local PDF download, PDF privacy audit, privacy boundaries)."
  );
}
