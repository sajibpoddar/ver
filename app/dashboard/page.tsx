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
    <main className="min-h-screen bg-sign-green px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-display font-bold text-4xl text-sign-white">
            Route log
          </h1>
          <Link
            href="/"
            className="font-body text-sm text-sign-sage hover:text-sign-white transition-colors"
          >
            + New link
          </Link>
        </div>
        <p className="font-body text-sign-sage mt-2">
          Every short link you&apos;ve created, most recent first.
        </p>

        {rows.length === 0 ? (
          <div className="mt-10 border border-sign-sage/40 rounded-sm p-8 text-center">
            <p className="font-body text-sign-sage">
              No links yet.{" "}
              <Link href="/" className="text-sign-amber hover:underline">
                Create your first one
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="mt-8 border-[3px] border-sign-white rounded-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-sign-sage/40">
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
                    className="border-b border-sign-sage/20 last:border-0"
                  >
                    <td className="px-4 py-3 align-top">
                      <Link
                        href={`/stats/${row.code}`}
                        className="font-display font-bold text-sign-amber hover:text-sign-white transition-colors"
                      >
                        /{row.code}
                      </Link>
                      {row.name && (
                        <p className="font-body text-xs text-sign-sage mt-0.5">
                          {row.name}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top font-body text-sm text-sign-white/80 max-w-[220px] truncate">
                      {row.url}
                    </td>
                    <td className="px-4 py-3 align-top font-display font-bold text-sign-white text-right">
                      {row.clicks}
                    </td>
                    <td className="px-4 py-3 align-top font-body text-sm text-sign-white/80">
                      {row.top ? (
                        <span>
                          {countryFlag(row.top.code)}{" "}
                          {countryName(row.top.code)}{" "}
                          <span className="text-sign-sage">
                            ({row.top.count})
                          </span>
                        </span>
                      ) : (
                        <span className="text-sign-sage">—</span>
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
      className={`px-4 py-3 font-body text-xs text-sign-sage ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}
