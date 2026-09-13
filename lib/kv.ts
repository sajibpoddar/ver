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
  name: string | null;
  clicks: number;
  createdAt: number;
};

export type LinkSummary = LinkRecord & { code: string };

const keyFor = (code: string) => `link:${code}`;
const countriesKeyFor = (code: string) => `link:${code}:countries`;
const INDEX_KEY = "links:index";

export async function saveLink(
  code: string,
  url: string,
  name?: string | null
): Promise<void> {
  const record: LinkRecord = {
    url,
    name: name?.trim() ? name.trim() : null,
    clicks: 0,
    createdAt: Date.now(),
  };
  await kv.set(keyFor(code), record);
  await kv.zadd(INDEX_KEY, { score: record.createdAt, member: code });
}

export async function getLink(code: string): Promise<LinkRecord | null> {
  const record = await kv.get<LinkRecord>(keyFor(code));
  return record ?? null;
}

export async function codeExists(code: string): Promise<boolean> {
  const record = await kv.get(keyFor(code));
  return record !== null;
}

export async function bumpClicks(
  code: string,
  country?: string | null
): Promise<void> {
  const record = await getLink(code);
  if (!record) return;
  record.clicks += 1;
  await kv.set(keyFor(code), record);
  if (country) {
    await kv.hincrby(countriesKeyFor(code), country, 1);
  }
}

export async function getCountryBreakdown(
  code: string
): Promise<Record<string, number>> {
  const data = await kv.hgetall<Record<string, string | number>>(
    countriesKeyFor(code)
  );
  if (!data) return {};
  const result: Record<string, number> = {};
  for (const [key, value] of Object.entries(data)) {
    result[key] = Number(value);
  }
  return result;
}

export async function listLinks(limit = 100): Promise<LinkSummary[]> {
  const codes = await kv.zrange<string[]>(INDEX_KEY, 0, limit - 1, {
    rev: true,
  });
  if (!codes || codes.length === 0) return [];

  const records = await Promise.all(codes.map((code) => getLink(code)));

  return codes
    .map((code, i) => {
      const record = records[i];
      return record ? { code, ...record } : null;
    })
    .filter((entry): entry is LinkSummary => entry !== null);
}
