# AGENTS.md

## Project Goal

Build a truthful, evidence-based bilingual portfolio website for Yang Chong,
a 2027 master's graduate seeking computer vision algorithm roles.

The website should emphasize:

1. Fish individual re-identification.
2. Quality-aware temporal learning.
3. Open-set recognition.
4. RFID-triggered multi-camera data acquisition.
5. Lightweight model training and edge deployment.

## Source of Truth

- Personal facts must come only from verified files under `src/data/`.
- Pages, resume content, metadata, and AI responses must share the same data source.
- Never invent or infer publications, awards, project roles, metrics, links, or project status.
- When two sources conflict, stop and report the conflict.
- Do not silently choose one version.
- Do not change numerical metrics without explicit user approval.

## Academic Claims

- Clearly distinguish: draft, submitted, under review, accepted, camera-ready,
  published, indexed, and awarded.
- Do not write "published", "EI indexed", "SOTA", or "state of the art"
  without verified evidence.
- Do not claim that one method fully outperforms another when the reported
  metrics show mixed results.
- Project limitations and incomplete work must be described honestly.

## Privacy Rules

Never expose or commit:

- Birthday.
- Student number.
- Supervisor number.
- Home or institutional street address.
- Certificate QR codes, barcodes, or unredacted private documents.
- Supplier contact information or private purchase links.
- Animal surgical instructions or drug dosage details.
- Raw private research datasets.
- API keys, tokens, passwords, or environment secrets.

### Explicitly authorised exceptions

Three fields are published **only** because the subject gave explicit
authorisation. All are declared in one place — `scripts/lib-approved-contacts.mjs`
— and are enforced there:

- **Phone number** (`18716985140`). Allowed only in
  `src/data/profile/identity.ts` and `public/杨冲个人简历.pdf`. Any other 11-digit
  number anywhere in `app/`, `src/`, `content/`, or `public/` still fails
  verification.
- **Political affiliation** (`政治面貌`). Allowed only in
  `src/data/profile/about.ts`, and never on the resume route.
- **Native place** (`籍贯`, Chongqing / 重庆). This field was previously removed
  site-wide at the subject's request and enforced by a blanket ban in
  `verify-profile-data.mjs`; the subject has since re-authorised publication.
  It is allowed only as `about.nativePlace`, and must equal the authorised value.

Removing a constant from that file re-enables the original blanket ban for that
field. Do not treat these as precedent for any other field in the list above, and
do not weaken the checks by editing them ad hoc — change the single authorisation
file so the exception stays auditable.

`public/杨冲个人简历.pdf` is the single downloadable resume asset. Its text is
extracted and audited by `verify:content`, `verify:resume`, and `verify:deploy` so
the PDF cannot smuggle in an unapproved email address or a different phone number.
If no PDF text extractor is installed, those scripts emit a notice and fall back to
a raw byte scan; run `npm run verify:all` on a machine with `pdftotext` before release.

## Development Rules

- Inspect relevant files before editing.
- Make only the changes required by the current task.
- Do not modify unrelated files.
- Do not add production dependencies without explicit approval.
- Reuse existing components before creating duplicate components.
- Preserve Chinese and English support.
- Preserve dark and light theme support.
- Use strict TypeScript types.
- Avoid `any` unless there is a documented technical reason.
- Do not place personal facts directly inside UI components.
- Do not modify or delete raw research materials.
- Do not run deployment commands unless explicitly requested.

## Repository Rules

Never commit:

- `node_modules`
- `.next`
- `out`
- `coverage`
- `.env`
- Temporary AI-agent files
- Raw private certificates or student records
- Unredacted research documents

Before making changes, inspect:

1. `git status`
2. Relevant source files
3. Existing tests and package scripts

## Validation

After TypeScript, React, configuration, or content-data changes, run:

1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build`

If a command fails:

- Fix failures caused by the current task.
- Do not claim success when validation did not pass.
- Report the exact command, error, and blocker.
- Do not hide warnings that affect correctness, privacy, or deployment.

## UI Requirements

- Check desktop layout.
- Check a mobile viewport around 390 px wide.
- Avoid horizontal overflow.
- Keep important information readable without excessive animation.
- All meaningful images require descriptive alt text.
- External links require clear accessible labels.
- Empty data sections must not render empty headings.
- Broken resume, publication, GitHub, and project links are release blockers.

## AI Assistant Rules

The career assistant is a **two-layer** design:

1. **Rule engine (primary).** `src/lib/career-agent.mjs` answers high-frequency
   questions deterministically from the verified Profile data. It runs first and
   costs nothing. `matchCareerReply()` returns `null` only when no rule matches.
2. **External model (fallback only).** When configured, `src/lib/deepseekAgent.ts`
   answers unmatched open-ended questions with the public Profile injected as RAG
   context. Without `DEEPSEEK_API_KEY` the assistant degrades silently to
   rule-engine-only mode.

- AI answers (either layer) may use only approved public facts.
- Do not allow user-provided system or developer roles; prompt-injection requests
  are refused by the rule engine and are **never** forwarded to the external model.
- Do not fabricate an answer when information is unavailable.
- Use this fallback when evidence is insufficient:

  "当前公开资料中没有足够信息支持这一结论。"

- When the rule engine misses and the external model is unavailable, reply with the
  friendly fallback (`getFriendlyFallback`) instead of the fallback above.
- Rule answers must use the same verified data source as the pages. The external
  model must receive that same data as context and must be constrained by the
  system prompt in `src/lib/deepseekAgent.ts`.
- The external model must never be given data outside the public + verified
  Profile collections.
- Never expose secrets in browser-side code: `DEEPSEEK_API_KEY` is server-only,
  must never carry a `NEXT_PUBLIC_` prefix, must never be hardcoded, and
  `verify:chat` asserts that neither the key name nor its value reaches the client
  bundle or any `"use client"` module.

## Git Rules

- Do not create commits, tags, branches, or pushes unless explicitly requested.
- After each task, report:
  - Files changed.
  - Main changes.
  - Validation commands and results.
  - Remaining risks or blockers.
  - Current `git status`.
- Stop when the stated acceptance criteria are met.

## Definition of Done

A task is complete only when:

1. The requested scope is implemented.
2. No unsupported personal claim was introduced.
3. No private information was exposed.
4. Relevant validation commands pass, or the exact blocker is reported.
5. Unrelated files remain unchanged.
6. The final response clearly summarizes the result.
