# Discord Post

**Channel targets:** `#show-and-tell` · `#side-projects` · `#showcase` · `#built-this`
**Relevant servers:** Indie Hackers · Build in Public · Personal Finance communities · Next.js/React dev servers
**Tone:** Casual, direct, no marketing fluff. Discord users smell it instantly.

---

## Post Copy

**hey everyone — built a budgeting app, would love feedback**

got tired of the end-of-month "wait, where did my money go?" moment. most apps track expenses after the fact — you only find out you overspent once it's already done.

built Xpnsio around a different idea: budget-first. set limits per category (daily/weekly/monthly), track against them, always see what's **left** — not just what you spent.

new in v0.2.0: color-coded progress bars — green (safe), yellow (warning at 90%+), red (over budget). glanceability matters.

**stack:** Next.js 15 · React 19 · Supabase · Drizzle ORM · Clean Architecture
**AI:** built with Claude Code — used a `CLAUDE.md` to enforce architecture boundaries so the AI doesn't just generate spaghetti. happy to talk about that workflow if anyone's curious.

currently free, no ads. just want to find people who think about budgeting the same way.

👉 https://xpnsio.vercel.app?utm_source=discord&utm_medium=post

honest feedback welcome — what's missing, what's confusing, what would make you actually use it

---

## Alt Version (for dev-focused servers — lead with the tech)

**shipped a finance app with Next.js 15 + Clean Architecture — here's the setup**

built Xpnsio — budget-first personal finance. the interesting parts for devs:

- Clean Architecture in Next.js: explicit `domain/` `data/` `presentation/` `di/` layers
- two DI containers: `container.server.ts` (never imports React) and `container.client.ts` (never imports server-only)
- Drizzle ORM + Supabase with transaction-mode pooler for runtime, direct connection for migrations
- built with Claude Code — `CLAUDE.md` defines layer rules so the AI respects architecture boundaries. AI-assisted, not AI-generated.

app itself: budget per category per period (daily/weekly/monthly). always shows remaining budget, not just spent.

free to try: https://xpnsio.vercel.app?utm_source=discord&utm_medium=post

curious if anyone else has tried enforcing Clean Architecture in a Next.js app — what worked, what didn't?

---

## Notes

- **Read the server rules before posting** — some servers require you to have X messages before posting in showcase channels
- Be active in the server for a few days first if you're new
- The question at the end is intentional — it invites replies and keeps the thread alive
- If someone asks about the AI workflow, that's a bonus conversation — engage it genuinely
- Add UTM per server if you want granular tracking: `?utm_source=discord&utm_medium=post&utm_campaign=indiehackers`
