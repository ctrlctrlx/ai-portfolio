"use client";

import { useEffect } from "react";

/**
 * 根布局出错时的兜底页面。
 * 此时 ThemeProvider 与 globals.css 可能尚未生效，因此样式全部内联。
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="zh">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          color: "#171717",
          fontFamily: '"Segoe UI", "Microsoft YaHei", Arial, system-ui, sans-serif',
        }}
      >
        <main style={{ maxWidth: "32rem", padding: "1.5rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
            网站暂时无法显示
            <span style={{ display: "block", fontSize: "1.125rem", marginTop: "0.5rem" }}>
              The site is temporarily unavailable
            </span>
          </h1>
          <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#5b6b7f" }}>
            请稍后重试。 / Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#ffffff",
              background: "#2563eb",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            重试 / Try again
          </button>
        </main>
      </body>
    </html>
  );
}
