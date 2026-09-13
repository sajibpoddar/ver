# Exit — a short-link redirector

A small bit.ly-style URL shortener: paste a long URL, get a short one, and
see how many times it's been clicked. Built with Next.js and deployed on
Vercel, using Vercel's KV (Redis) store to save links.

## How it works

- `/` — form to submit a long URL and get back a short code
- `/[code]` — visiting a short link looks up the destination and redirects
  to it, counting the click
- `/stats/[code]` — shows the click count and destination for a code

## 1. Push this to GitHub

Create a new repo and push this folder to it (or use Vercel's "Import" flow
directly from a local folder via the Vercel CLI — see step 3).

## 2. Create the project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
2. Keep the default settings (Vercel auto-detects Next.js) and click Deploy.
   The first deploy will succeed even without a database — the shorten
   form just won't work until you finish step 3.

## 3. Add a Redis store (Upstash)

Vercel's native "KV" product was retired, so key-value storage now comes
through the Marketplace instead:

1. In your Vercel project, go to the **Storage** tab → **Create Database**.
2. Under **Marketplace Database Providers**, choose **Upstash**.
3. Follow the prompts to create a Redis database and connect it to this
   project. Vercel automatically adds the `KV_REST_API_URL` /
   `KV_REST_API_TOKEN` environment variables — no manual copy-pasting
   needed.
4. Redeploy the project (Deployments tab → ⋯ → Redeploy) so the new env
   vars take effect.

## 4. Try it

Visit your deployed URL, paste a long link, and you'll get back something
like `https://your-app.vercel.app/aB3x9K`. Visiting that link redirects to
the original URL and counts the click; `/stats/aB3x9K` shows the count.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in values from the Storage tab's "Quickstart" / ".env.local" section
npm run dev
```

Then open http://localhost:3000.

## Notes & things you might want to change

- **Short codes** are 6 random characters from an alphabet that skips
  easily-confused characters (no `0/O`, `1/l/I`). Collisions are checked
  and retried, though at this length they're very unlikely.
- **No expiry**: links live forever by default. If you want links to
  expire, you can pass an `ex` (seconds) option when calling `kv.set` in
  `lib/kv.ts`.
- **No auth**: anyone who can reach the site can create links. If this is
  public-facing, consider adding a simple password gate or rate limiting
  before you get real traffic.
- **Custom domain**: once deployed, you can attach a short custom domain
  (e.g. `sho.rt`) under the project's Settings → Domains for even shorter
  links.
