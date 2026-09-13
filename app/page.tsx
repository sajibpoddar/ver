"use client";

import { useState, FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function MissingNotice() {
  const params = useSearchParams();
  const missing = params.get("missing");
  if (!missing) return null;
  return (
    <div className="mb-8 border border-sign-amber/60 text-sign-amber font-body text-sm rounded-sm px-4 py-3 max-w-md w-full">
      No sign points from &ldquo;{missing}&rdquo; — that link doesn&apos;t
      exist yet.
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ code: string; url: string } | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, name: name || undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setResult(data);
        setUrl("");
        setName("");
      }
    } catch {
      setError("Couldn't reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(`${origin}/${result.code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="min-h-screen bg-sign-green flex flex-col items-center px-6 py-16">
      <Suspense fallback={null}>
        <MissingNotice />
      </Suspense>

      <div className="w-full max-w-md">
        {/* Hero: exit-sign motif */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-3">
            <span className="font-display font-bold text-6xl text-sign-white leading-none">
              EXIT
            </span>
            <ArrowRight />
          </div>
          <a
            href="/dashboard"
            className="font-body text-sm text-sign-sage hover:text-sign-white transition-colors"
          >
            All links →
          </a>
        </div>
        <p className="font-body text-sign-sage mt-3 max-w-sm">
          Paste a long URL. Get a short one that points to it — and count
          every time someone takes it.
        </p>

        {/* Sign panel form */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 border-[3px] border-sign-white rounded-sm p-6 relative bg-sign-greendark/40"
        >
          <Corner className="top-2 left-2" />
          <Corner className="top-2 right-2" />
          <Corner className="bottom-2 left-2" />
          <Corner className="bottom-2 right-2" />

          <label
            htmlFor="url"
            className="font-body text-xs text-sign-sage block mb-2"
          >
            Destination
          </label>
          <input
            id="url"
            type="text"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/a-very-long-path"
            className="w-full bg-transparent border border-sign-sage/60 rounded-sm px-4 py-3 font-body text-sign-white placeholder:text-sign-sage/60 focus:outline-none focus:ring-2 focus:ring-sign-amber"
          />

          <label
            htmlFor="name"
            className="font-body text-xs text-sign-sage block mb-2 mt-4"
          >
            Name (optional, for tracking)
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Facebook campaign, client email"
            className="w-full bg-transparent border border-sign-sage/60 rounded-sm px-4 py-3 font-body text-sign-white placeholder:text-sign-sage/60 focus:outline-none focus:ring-2 focus:ring-sign-amber"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-sign-amber text-sign-asphalt font-display font-bold text-lg tracking-wide rounded-sm py-3 hover:bg-sign-white transition-colors disabled:opacity-60"
          >
            {loading ? "Pointing the way…" : "Shorten it"}
          </button>

          {error && (
            <p className="font-body text-sm text-sign-amber mt-3">{error}</p>
          )}
        </form>

        {/* Result */}
        {result && (
          <div className="mt-6 border border-sign-sage/50 rounded-sm p-5">
            <p className="font-body text-xs text-sign-sage">Your short link</p>
            <div className="flex items-center justify-between gap-3 mt-1">
              <p className="font-display font-bold text-xl text-sign-white break-all">
                {origin}/{result.code}
              </p>
              <button
                onClick={handleCopy}
                className="shrink-0 font-body text-sm text-sign-amber hover:text-sign-white transition-colors"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <a
              href={`/stats/${result.code}`}
              className="inline-block mt-4 font-body text-sm text-sign-sage hover:text-sign-white transition-colors"
            >
              View click count →
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <span
      className={`absolute w-2 h-2 rounded-full bg-sign-amber ${className}`}
    />
  );
}

function ArrowRight() {
  return (
    <svg
      width="48"
      height="24"
      viewBox="0 0 48 24"
      fill="none"
      className="text-sign-amber"
    >
      <line
        x1="0"
        y1="12"
        x2="40"
        y2="12"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        d="M30 2L44 12L30 22"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
