import { NextRequest, NextResponse } from "next/server";
import { saveLink, codeExists } from "@/lib/kv";
import { generateCode, isValidUrl, isReservedCode } from "@/lib/shorten";

export async function POST(req: NextRequest) {
  let body: { url?: string; name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const url = body.url?.trim();
  const name = body.name?.trim() || null;

  if (!url || !isValidUrl(url)) {
    return NextResponse.json(
      { error: "Enter a valid URL starting with http:// or https://." },
      { status: 400 }
    );
  }

  // Generate a code, retrying on the rare collision.
  let code = generateCode();
  let attempts = 0;
  while ((isReservedCode(code) || (await codeExists(code))) && attempts < 5) {
    code = generateCode();
    attempts += 1;
  }

  await saveLink(code, url, name);

  return NextResponse.json({ code, url, name });
}
