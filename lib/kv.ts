import { Redis } from "@upstash/redis";

// The Upstash Marketplace integration on Vercel injects KV_REST_API_URL
// and KV_REST_API_TOKEN, so we read those directly rather than using
// Redis.fromEnv() (which looks for UPSTASH_REDIS_REST_URL/TOKEN instead).
const kv = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export type LinkRecord = {
  url: string;
  clicks: number;
  createdAt: number;
};

const keyFor = (code: string) => `link:${code}`;

export async function saveLink(code: string, url: string): Promise<void> {
  const record: LinkRecord = { url, clicks: 0, createdAt: Date.now() };
  await kv.set(keyFor(code), record);
}

export async function getLink(code: string): Promise<LinkRecord | null> {
  const record = await kv.get<LinkRecord>(keyFor(code));
  return record ?? null;
}

export async function codeExists(code: string): Promise<boolean> {
  const record = await kv.get(keyFor(code));
  return record !== null;
}

export async function bumpClicks(code: string): Promise<void> {
  const record = await getLink(code);
  if (!record) return;
  record.clicks += 1;
  await kv.set(keyFor(code), record);
}
