import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const profileDirectory = join(repositoryRoot, "src", "data", "profile");
const errors = [];
const approvedEmail = "yangc202706@163.com";
const approvedWebsite = "https://ctrlctrlx.top";

function fail(rule, detail = "") {
  errors.push(detail ? `${rule}: ${detail}` : rule);
}

function isBilingual(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.zh === "string" &&
    value.zh.trim().length > 0 &&
    typeof value.en === "string" &&
    value.en.trim().length > 0
  );
}

function validateEvidence(entry, label) {
  if (!["public", "private", "hidden"].includes(entry.visibility)) {
    fail("invalid-visibility", label);
  }
  if (!["verified", "pending", "unavailable"].includes(entry.verificationStatus)) {
    fail("invalid-verification-status", label);
  }
  if (
    typeof entry.sourceId === "string" &&
    (entry.sourceId.includes("/") || entry.sourceId.includes("\\"))
  ) {
    fail("source-id-exposes-path", label);
  }
}

async function loadProfileModule(fileName) {
  const moduleUrl = pathToFileURL(join(profileDirectory, fileName)).href;
  return import(moduleUrl);
}

const [
  { awards },
  { education },
  { identity },
  { patents },
  { projects },
  { publications },
  { research },
  { skills },
  { isPublicVerified },
] = await Promise.all([
  loadProfileModule("awards.ts"),
  loadProfileModule("education.ts"),
  loadProfileModule("identity.ts"),
  loadProfileModule("patents.ts"),
  loadProfileModule("projects.ts"),
  loadProfileModule("publications.ts"),
  loadProfileModule("research.ts"),
  loadProfileModule("skills.ts"),
  loadProfileModule("visibility.ts"),
]);

if (identity.name.zh !== "杨冲") fail("incorrect-identity-name-zh");
if (identity.name.en !== "Yang Chong") fail("incorrect-identity-name-en");
validateEvidence(identity, "identity");

const publicContacts = identity.contacts.filter(isPublicVerified);
const emailContacts = publicContacts.filter((contact) => contact.kind === "email");
const websiteContacts = publicContacts.filter((contact) => contact.kind === "website");
const githubContacts = publicContacts.filter((contact) => contact.kind === "github");
if (emailContacts.length !== 1 || emailContacts[0]?.value !== approvedEmail) {
  fail("incorrect-public-email");
}
if (websiteContacts.length !== 1 || websiteContacts[0]?.value !== approvedWebsite) {
  fail("incorrect-public-website");
}
if (
  githubContacts.length !== 1 ||
  githubContacts[0]?.value !== "https://github.com/ctrlctrlx"
) {
  fail("incorrect-public-github");
}
for (const contact of identity.contacts) {
  validateEvidence(contact, `contact:${contact.id}`);
  if (!isBilingual(contact.label)) fail("missing-bilingual-field", `contact:${contact.id}:label`);
}

const profileFiles = readdirSync(profileDirectory)
  .filter((fileName) => fileName.endsWith(".ts"))
  .map((fileName) => join(profileDirectory, fileName));
const profileSource = profileFiles
  .map((filePath) => readFileSync(filePath, "utf8"))
  .join("\n");

for (const [name, expectedCount] of [["杨冲", 1], ["Yang Chong", 1]]) {
  const count = profileSource.split(name).length - 1;
  if (count !== expectedCount) fail("identity-name-not-unique", `${name}=${count}`);
}

const collections = [
  ["education", education],
  ["projects", projects],
  ["publications", publications],
  ["patents", patents],
  ["awards", awards],
  ["research", research.areas],
  ["skills", skills],
];

for (const [collectionName, entries] of collections) {
  if (!Array.isArray(entries)) fail("collection-not-array", collectionName);
  for (const entry of entries) {
    validateEvidence(entry, `${collectionName}:${entry.id ?? "unknown"}`);
  }
}

for (const entry of education) {
  for (const field of ["institution", "degree", "major"]) {
    if (!isBilingual(entry[field])) fail("missing-bilingual-field", `education:${entry.id}:${field}`);
  }
}

for (const project of projects) {
  for (const field of ["title", "subtitle", "situation", "task", "action", "result"]) {
    if (!isBilingual(project[field])) fail("missing-bilingual-field", `project:${project.id}:${field}`);
  }
}

for (const area of research.areas) {
  if (!isBilingual(area.title)) fail("missing-bilingual-field", `research:${area.id}:title`);
}

for (const category of skills) {
  if (!isBilingual(category.label)) fail("missing-bilingual-field", `skills:${category.id}:label`);
  for (const item of category.items) {
    validateEvidence(item, `skills:${category.id}:${item.id}`);
    if (!isBilingual(item.name)) fail("missing-bilingual-field", `skills:${category.id}:${item.id}:name`);
  }
}

for (const award of awards) {
  if (!isBilingual(award.title) || !isBilingual(award.issuer)) {
    fail("missing-bilingual-field", `award:${award.id}`);
  }
}

for (const publication of publications) {
  if (!isBilingual(publication.title) || !isBilingual(publication.abstract)) {
    fail("missing-bilingual-field", `publication:${publication.id}`);
  }
}

for (const patent of patents) {
  if (
    !isBilingual(patent.title) ||
    !isBilingual(patent.role) ||
    !isBilingual(patent.stageLabel)
  ) {
    fail("missing-bilingual-field", `patent:${patent.id}`);
  }
}

const publicPatents = patents.filter(isPublicVerified);
if (publicPatents.length !== 1) fail("incorrect-public-patent-count");
const [publicPatent] = publicPatents;
if (publicPatent) {
  if (publicPatent.type !== "utility-model") fail("incorrect-patent-type");
  if (publicPatent.inventorOrder !== 2) fail("incorrect-inventor-order");
  if (publicPatent.patentNumber !== "ZL 2022 2 0475134.9") {
    fail("incorrect-patent-number");
  }
  if (publicPatent.publicationNumber !== "CN 216957023 U") {
    fail("incorrect-patent-publication-number");
  }
  if (publicPatent.applicationDate !== "2022-03-04") {
    fail("incorrect-patent-application-date");
  }
  if (publicPatent.grantDate !== "2022-07-12") {
    fail("incorrect-patent-grant-date");
  }
}

if (awards.filter(isPublicVerified).length !== 4) {
  fail("incorrect-public-award-count");
}
if (publications.filter(isPublicVerified).length !== 0) {
  fail("incorrect-public-publication-count");
}
const pendingPublicationCase = {
  visibility: "public",
  verificationStatus: "pending",
};
if (isPublicVerified(pendingPublicationCase)) {
  fail("pending-publication-entered-public-collection");
}

const slugEntries = [
  ...projects.map((entry) => ["project", entry.id, entry.slug]),
  ...research.areas.map((entry) => ["research", entry.id, entry.slug]),
  ...publications.map((entry) => ["publication", entry.id, entry.slug]),
];
const seenSlugs = new Set();
for (const [kind, id, slug] of slugEntries) {
  if (typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    fail("unstable-slug", `${kind}:${id}`);
  }
  if (seenSlugs.has(slug)) fail("duplicate-slug", slug);
  seenSlugs.add(slug);
}

for (const project of projects) {
  if (project.slug !== project.id) fail("project-slug-changed-from-stable-id", project.id);
}

const syntheticVisibilityCases = [
  { visibility: "public", verificationStatus: "verified", expected: true },
  { visibility: "public", verificationStatus: "pending", expected: false },
  { visibility: "private", verificationStatus: "verified", expected: false },
  { visibility: "hidden", verificationStatus: "verified", expected: false },
];
for (const entry of syntheticVisibilityCases) {
  if (isPublicVerified(entry) !== entry.expected) {
    fail("public-filter-contract-failed", `${entry.visibility}:${entry.verificationStatus}`);
  }
}

const serializedProfile = JSON.stringify({
  awards,
  education,
  identity,
  projects,
  publications,
  patents,
  research,
  skills,
});
const forbiddenPatterns = [
  ["legacy-name", /\bMingyuan(?:\s+Yang)?\b/i],
  ["phone-number", /\b1[3-9]\d{9}\b/],
  ["fixed-visitor-count", /\b1024\b/],
  [
    "unsupported-professional-identity",
    /\bSenior\b|\bExpert\b|Published Researcher|AI Algorithm Engineer|SLAM Engineer|AI 算法工程师|资深|专家/i,
  ],
];
for (const [rule, pattern] of forbiddenPatterns) {
  if (pattern.test(serializedProfile)) fail(rule);
}

const serializedWithoutApprovedEmail = serializedProfile.replaceAll(approvedEmail, "");
if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(serializedWithoutApprovedEmail)) {
  fail("unapproved-email-address");
}

if (!existsSync(join(repositoryRoot, "public", identity.avatar.slice(1)))) {
  fail("missing-identity-avatar");
}

if (errors.length > 0) {
  for (const error of [...new Set(errors)].sort()) {
    console.error(`Profile verification failed: ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Profile verification passed (${projects.length} projects, ${research.areas.length} research areas, ${publications.length} publications, ${patents.length} patents, ${awards.length} awards).`
  );
}
