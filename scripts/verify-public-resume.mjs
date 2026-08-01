import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const profileDirectory = join(repositoryRoot, "src", "data", "profile");
const resumePagePath = join(repositoryRoot, "app", "[lang]", "resume", "page.tsx");
const printButtonPath = join(
  repositoryRoot,
  "src",
  "components",
  "PrintResumeButton.tsx"
);
const errors = [];

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
expect(existsSync(printButtonPath), "resume-print-control-missing");

const resumeSource = readFileSync(resumePagePath, "utf8");
const printButtonSource = readFileSync(printButtonPath, "utf8");

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
expect(!/\.pdf\b|download\s*=|Download PDF|下载 PDF/i.test(resumeSource), "resume-pdf-download-present");
expect(!/publication/i.test(resumeSource), "resume-publication-content-present");
expect(
  !/\b(?:phone|birthday|politicalAffiliation|studentNumber|supervisorNumber|streetAddress)\b|二维码|条形码|手机号|生日|政治面貌|学号|详细地址/i.test(
    resumeSource
  ),
  "resume-sensitive-field-present"
);
expect(!/\b1[3-9]\d{9}\b/.test(resumeSource), "resume-phone-number-present");
expect(
  !/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(resumeSource),
  "resume-email-hardcoded"
);
expect(
  printButtonSource.includes("window.print()"),
  "resume-print-action-missing"
);
expect(
  /Print \/ Save as PDF/.test(printButtonSource) &&
    /打印 \/ 保存为 PDF/.test(printButtonSource),
  "resume-print-label-missing"
);

const publicContacts = identity.contacts.filter(isPublicVerified);
expect(
  publicContacts.filter(
    (contact) =>
      contact.kind === "email" && contact.value === "yangc202706@163.com"
  ).length === 1,
  "resume-profile-email-mismatch"
);
expect(awards.filter(isPublicVerified).length === 4, "resume-award-count-mismatch");
expect(patents.filter(isPublicVerified).length === 1, "resume-patent-count-mismatch");
expect(
  publications.filter(isPublicVerified).length === 0,
  "resume-publication-filter-mismatch"
);

if (errors.length > 0) {
  for (const error of [...new Set(errors)].sort()) {
    console.error(`Public resume verification failed: ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    "Public resume verification passed (bilingual route, Profile sources, print control, privacy boundaries)."
  );
}
