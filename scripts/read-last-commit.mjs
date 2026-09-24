import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { inflateSync } from "node:zlib";

/**
 * 读取最近一次 git 提交时间（构建期执行，产出静态数据，无运行时依赖）。
 *
 * 为什么需要多层兜底：CI / 容器化构建环境可能没有 git 可执行文件，
 * 或禁止子进程（受限沙箱）。依次尝试：
 *   1. git log（最准确，取提交者时间 %cI）
 *   2. 直接解析 .git 松散对象（zlib 解压 commit 对象，取 committer 行）
 *   3. 解析 .git/logs/HEAD（reflog 末行时间戳）
 *   4. 源码文件最近修改时间
 * 四层全部失败时返回 null，页面自动隐藏「最后更新」一行。
 *
 * @param {string} repositoryRoot 仓库根目录
 * @returns {{ iso: string, source: string } | null}
 */
export function readLastCommitTime(repositoryRoot) {
  return (
    readViaGitCommand(repositoryRoot) ??
    readViaLooseObject(repositoryRoot) ??
    readViaReflog(repositoryRoot) ??
    readViaFileTimes(repositoryRoot)
  );
}

function readViaGitCommand(repositoryRoot) {
  try {
    const output = execFileSync("git", ["log", "-1", "--format=%cI"], {
      cwd: repositoryRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (!output) return null;
    const parsed = new Date(output);
    if (Number.isNaN(parsed.getTime())) return null;
    return { iso: parsed.toISOString(), source: "git-log" };
  } catch {
    return null;
  }
}

function readViaLooseObject(repositoryRoot) {
  try {
    const head = readFileSync(join(repositoryRoot, ".git", "HEAD"), "utf8").trim();
    let sha = head;

    // HEAD 通常是 "ref: refs/heads/<branch>"，需要再解析引用
    if (head.startsWith("ref:")) {
      const refName = head.slice(4).trim();
      const refPath = join(repositoryRoot, ".git", refName);
      if (existsSync(refPath)) {
        sha = readFileSync(refPath, "utf8").trim();
      } else {
        // 引用可能被压缩进 packed-refs
        const packedRefs = join(repositoryRoot, ".git", "packed-refs");
        if (!existsSync(packedRefs)) return null;
        const line = readFileSync(packedRefs, "utf8")
          .split("\n")
          .find((entry) => entry.endsWith(` ${refName}`));
        if (!line) return null;
        sha = line.split(" ")[0];
      }
    }

    if (!/^[0-9a-f]{40}$/.test(sha)) return null;

    const objectPath = join(
      repositoryRoot,
      ".git",
      "objects",
      sha.slice(0, 2),
      sha.slice(2)
    );
    if (!existsSync(objectPath)) return null;

    // commit 对象格式：committer <name> <email> <epoch> <tz>
    const raw = inflateSync(readFileSync(objectPath)).toString("utf8");
    const match = raw.match(/^committer .*? (\d+) ([+-]\d{4})$/m);
    if (!match) return null;

    const epochSeconds = Number(match[1]);
    if (!Number.isFinite(epochSeconds)) return null;
    return { iso: new Date(epochSeconds * 1000).toISOString(), source: "git-object" };
  } catch {
    return null;
  }
}

function readViaReflog(repositoryRoot) {
  try {
    const reflogPath = join(repositoryRoot, ".git", "logs", "HEAD");
    if (!existsSync(reflogPath)) return null;

    const lines = readFileSync(reflogPath, "utf8").trim().split("\n");
    // reflog 行尾格式：<epoch> <tz>\t<message>
    const match = lines[lines.length - 1].match(/(\d{10,}) ([+-]\d{4})\t/);
    if (!match) return null;

    const epochSeconds = Number(match[1]);
    if (!Number.isFinite(epochSeconds)) return null;
    return { iso: new Date(epochSeconds * 1000).toISOString(), source: "git-reflog" };
  } catch {
    return null;
  }
}

function readViaFileTimes(repositoryRoot) {
  try {
    const candidates = [
      join("src", "components", "Footer.tsx"),
      join("src", "data", "profile", "identity.ts"),
      join("package.json"),
    ];
    let newest = 0;
    for (const relativePath of candidates) {
      const absolutePath = join(repositoryRoot, relativePath);
      if (!existsSync(absolutePath)) continue;
      const time = statSync(absolutePath).mtimeMs;
      if (time > newest) newest = time;
    }
    if (newest === 0) return null;
    return { iso: new Date(newest).toISOString(), source: "file-mtime" };
  } catch {
    return null;
  }
}
