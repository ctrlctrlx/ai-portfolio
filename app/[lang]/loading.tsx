export default function LocalizedLoading() {
  return (
    <div
      className="max-w-5xl mx-auto px-4 sm:px-6 py-16"
      role="status"
      aria-live="polite"
    >
      <div
        className="h-5 w-36 rounded"
        style={{ background: "var(--card)" }}
      />
      <div
        className="mt-5 h-28 rounded-xl border"
        style={{
          background: "var(--card)",
          borderColor: "var(--card-border)",
        }}
      />
      <span className="sr-only">Loading</span>
    </div>
  );
}
