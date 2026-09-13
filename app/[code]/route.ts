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

  // Fire-and-forget so the redirect isn't delayed by the write.
  bumpClicks(code).catch(() => {});

  return NextResponse.redirect(record.url, { status: 307 });
}
