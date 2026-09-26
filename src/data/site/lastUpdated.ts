// 本文件由 scripts/generate-last-updated.mjs 自动生成，请勿手工编辑。
// 数据来源：最近一次 git 提交时间（构建期读取，运行时零依赖）。
// 重新生成：npm run generate:last-updated（prebuild 会自动执行）
export interface LastUpdated {
  /** ISO 8601 时间字符串；无法读取时为 null */
  iso: string | null;
  /** 取值来源，便于排查：git-log / git-object / git-reflog / file-mtime */
  source: string | null;
}

export const lastUpdated: LastUpdated = {
  iso: "2026-09-24T06:18:35.000Z",
  source: "git-log",
};
