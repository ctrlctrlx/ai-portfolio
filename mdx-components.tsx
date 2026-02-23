/**
 * mdx-components.tsx
 * Required for @next/mdx App Router integration.
 * Also used by next-mdx-remote to override default HTML element rendering.
 */
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Override <pre> to allow horizontal scroll on mobile for code blocks
    pre: ({ children, ...props }) => (
      <pre className="overflow-x-auto rounded-lg p-4 bg-gray-900 text-sm" {...props}>
        {children}
      </pre>
    ),
    // Override <code> for inline code
    code: ({ children, ...props }) => (
      <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    ),
    // Math display wrapper: horizontal scroll + touch pinch-zoom on mobile
    // Targets the .katex-display class injected by rehype-katex
    ...components,
  };
}
