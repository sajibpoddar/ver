import Link from "next/link";
import { listLinks, getCountryBreakdown } from "@/lib/kv";
import { countryFlag, countryName, topCountry } from "@/lib/geo";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const links = await listLinks(100);

  const rows = await Promise.all(
    links.map(async (link) => {
      const breakdown = await getCountryBreakdown(link.code);
      return { ...link, top: topCountry(breakdown) };
    })
  );

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <span className="text-2xl font-extrabold text-brand-ink">
            Short<span className="text-brand-blue">ly</span>
          </span>
          <Link
            href="/"
            className="text-sm font-medium text-brand-blue hover:text-brand-bluedark transition-colors"
          >
            + New link
          </Link>
        </div>

        <h1 className="text-3xl font-extrabold text-brand-ink mb-1">
          Your links
        </h1>
        <p className="text-brand-muted mb-8">
          Every short link you&apos;ve created, most recent first.
        </p>

        {rows.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card border border-brand-border p-10 text-center">
            <p className="text-brand-muted">
              No links yet.{" "}
              <Link href="/" className="text-brand-blue hover:underline">
                Create your first one
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-card border border-brand-border overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-brand-border bg-brand-bg/60">
                  <Th>Link</Th>
                  <Th>Destination</Th>
                  <Th align="right">Clicks</Th>
                  <Th>Top country</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.code}
                    className="border-b border-brand-border last:border-0 hover:bg-brand-bg/40 transition-colors"
                  >
                    <td className="px-4 py-3 align-top">
                      <Link
                        href={`/stats/${row.code}`}
                        className="font-semibold text-brand-blue hover:text-brand-bluedark transition-colors"
                      >
                        /{row.code}
                      </Link>
                      {row.name && (
                        <p className="text-xs text-brand-muted mt-0.5">
                          {row.name}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-sm text-brand-ink max-w-[220px] truncate">
                      {row.url}
                    </td>
                    <td className="px-4 py-3 align-top font-semibold text-brand-ink text-right">
                      {row.clicks}
                    </td>
                    <td className="px-4 py-3 align-top text-sm text-brand-ink">
                      {row.top ? (
                        <span>
                          {countryFlag(row.top.code)}{" "}
                          {countryName(row.top.code)}{" "}
                          <span className="text-brand-muted">
                            ({row.top.count})
                          </span>
                        </span>
                      ) : (
                        <span className="text-brand-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-3 text-xs font-medium text-brand-muted ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}
