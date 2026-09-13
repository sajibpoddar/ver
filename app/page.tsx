"use client";

import { useState, FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function MissingNotice() {
  const params = useSearchParams();
  const missing = params.get("missing");
  if (!missing) return null;
  return (
    <div className="mb-6 border border-amber-300 bg-amber-50 text-amber-800 text-sm rounded-lg px-4 py-3 max-w-lg w-full">
      That link ({missing}) doesn&apos;t exist — it may have been mistyped.
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
    <main className="min-h-screen flex flex-col items-center px-6 py-20">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-10">
          <span className="text-2xl font-extrabold text-brand-ink">
            Short<span className="text-brand-blue">ly</span>
          </span>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-brand-muted hover:text-brand-ink transition-colors"
          >
            All links
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-brand-ink">
            Paste the URL to be shortened
          </h1>
        </div>

        <Suspense fallback={null}>
          <div className="flex justify-center">
            <MissingNotice />
          </div>
        </Suspense>

        <div className="bg-white rounded-2xl shadow-card border border-brand-border p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter the link here"
                className="flex-1 rounded-lg border border-brand-border px-4 py-3 text-brand-ink placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
              />
              <button
                type="submit"
                disabled={loading}
                className="shrink-0 bg-brand-blue hover:bg-brand-bluedark text-white font-semibold rounded-lg px-6 py-3 transition-colors disabled:opacity-60"
              >
                {loading ? "Shortening…" : "Shorten URL"}
              </button>
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name this link (optional, for tracking)"
              className="w-full rounded-lg border border-brand-border px-4 py-2.5 text-sm text-brand-ink placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>

          {result && (
            <div className="mt-6 pt-6 border-t border-brand-border">
              <p className="text-xs text-brand-muted mb-1">Your short link</p>
              <div className="flex items-center justify-between gap-3 bg-brand-bluelight rounded-lg px-4 py-3">
                <p className="font-semibold text-brand-blue break-all">
                  {origin}/{result.code}
                </p>
                <button
                  onClick={handleCopy}
                  className="shrink-0 text-sm font-medium text-brand-blue hover:text-brand-bluedark transition-colors"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <Link
                href={`/stats/${result.code}`}
                className="inline-block mt-3 text-sm text-brand-muted hover:text-brand-ink transition-colors"
              >
                View click stats →
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-brand-muted mt-6">
          Free URL shortener with click tracking by country.
        </p>
      </div>
    </main>
  );
}
