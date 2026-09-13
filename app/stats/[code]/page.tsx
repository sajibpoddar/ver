import { getLink, getCountryBreakdown } from "@/lib/kv";
import { countryFlag, countryName } from "@/lib/geo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StatsPage({
  params,
}: {
  params: { code: string };
}) {
  const record = await getLink(params.code);
  const breakdown = record ? await getCountryBreakdown(params.code) : {};
  const countries = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-20">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-8">
          <span className="text-2xl font-extrabold text-brand-ink">
            Short<span className="text-brand-blue">ly</span>
          </span>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-brand-muted hover:text-brand-ink transition-colors"
          >
            ← All links
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-brand-border p-8">
          {record ? (
            <>
              {record.name && (
                <p className="text-sm font-medium text-brand-muted mb-1">
                  {record.name}
                </p>
              )}
              <p className="text-xs uppercase tracking-wide text-brand-muted">
                Total clicks
              </p>
              <p className="text-6xl font-extrabold text-brand-blue leading-none mt-1">
                {record.clicks}
              </p>

              <div className="mt-6 pt-6 border-t border-brand-border">
                <p className="text-xs text-brand-muted">Destination</p>
                <p className="text-brand-ink break-all mt-1">{record.url}</p>
              </div>

              <div className="mt-4">
                <p className="text-xs text-brand-muted">Short link</p>
                <p className="font-semibold text-brand-blue mt-1">
                  /{params.code}
                </p>
              </div>

              {countries.length > 0 && (
                <div className="mt-6 pt-6 border-t border-brand-border">
                  <p className="text-xs text-brand-muted mb-3">
                    Clicks by country
                  </p>
                  <ul className="space-y-2">
                    {countries.map(([code, count]) => (
                      <li
                        key={code}
                        className="flex items-center justify-between text-sm text-brand-ink"
                      >
                        <span>
                          {countryFlag(code)} {countryName(code)}
                        </span>
                        <span className="text-brand-muted font-medium">
                          {count}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-brand-ink">
                Link not found
              </h1>
              <p className="text-brand-muted mt-2">
                There&apos;s no short link with the code &ldquo;{params.code}
                &rdquo;.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
