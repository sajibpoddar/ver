import { getLink } from "@/lib/kv";
import Link from "next/link";

export default async function StatsPage({
  params,
}: {
  params: { code: string };
}) {
  const record = await getLink(params.code);

  return (
    <main className="min-h-screen bg-sign-green flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="font-body text-sm text-sign-sage hover:text-sign-white transition-colors"
        >
          ← Back
        </Link>

        <div className="mt-6 border-[3px] border-sign-white rounded-sm p-8 relative">
          <Corner className="top-2 left-2" />
          <Corner className="top-2 right-2" />
          <Corner className="bottom-2 left-2" />
          <Corner className="bottom-2 right-2" />

          {record ? (
            <>
              <p className="font-body text-xs tracking-wide text-sign-sage">
                Mile marker
              </p>
              <h1 className="font-display font-bold text-7xl text-sign-white leading-none mt-1">
                {record.clicks}
              </h1>
              <p className="font-body text-sm text-sign-sage mt-1">
                {record.clicks === 1 ? "click" : "clicks"} so far
              </p>

              <div className="mt-6 pt-6 border-t border-sign-sage/40">
                <p className="font-body text-xs text-sign-sage">Points to</p>
                <p className="font-body text-sign-white break-all mt-1">
                  {record.url}
                </p>
              </div>

              <div className="mt-4">
                <p className="font-body text-xs text-sign-sage">Short code</p>
                <p className="font-display font-bold text-2xl text-sign-amber mt-1">
                  /{params.code}
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-display font-bold text-3xl text-sign-white">
                No such sign
              </h1>
              <p className="font-body text-sign-sage mt-2">
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

function Corner({ className }: { className: string }) {
  return (
    <span
      className={`absolute w-2 h-2 rounded-full bg-sign-amber ${className}`}
    />
  );
}
