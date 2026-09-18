import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readLastCommitTime } from "./read-last-commit.mjs";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = join(
  repositoryRoot,
  "src",
  "data",
  "site",
  "lastUpdated.ts"
);

mkdirSync(dirname(targetPath), { recursive: true });

const result = readLastCommitTime(repositoryRoot);

if (!result) {
  console.warn(
    "generate-last-updated: 无法读取 git 提交时间，已写入 null（页脚将隐藏「最后更新」一行）。"
  );
}

const contents = `// 本文件由 scripts/generate-last-updated.mjs 自动生成，请勿手工编辑。
// 数据来源：最近一次 git 提交时间（构建期读取，运行时零依赖）。
// 重新生成：npm run generate:last-updated（prebuild 会自动执行）
export interface LastUpdated {
  /** ISO 8601 时间字符串；无法读取时为 null */
  iso: string | null;
  /** 取值来源，便于排查：git-log / git-object / git-reflog / file-mtime */
  source: string | null;
}

export const lastUpdated: LastUpdated = {
  iso: ${result ? JSON.stringify(result.iso) : "null"},
  source: ${result ? JSON.stringify(result.source) : "null"},
};
`;

writeFileSync(targetPath, contents, "utf8");
console.log(
  `generate-last-updated: ${result ? `${result.iso} (${result.source})` : "null"} -> src/data/site/lastUpdated.ts`
);
