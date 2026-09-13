import { NextRequest, NextResponse } from "next/server";
import { getLink, bumpClicks } from "@/lib/kv";

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const { code } = params;
  const record = await getLink(code);

  if (!record) {
    return NextResponse.redirect(new URL(`/?missing=${code}`, req.url));
  }

  // Vercel's edge network sets this header on every request, in both
  // Node.js and Edge runtimes, so we don't need the Edge-only `geo` API.
  const country = req.headers.get("x-vercel-ip-country");

  // Fire-and-forget so the redirect isn't delayed by the write.
  bumpClicks(code, country).catch(() => {});

  return NextResponse.redirect(record.url, { status: 307 });
}
