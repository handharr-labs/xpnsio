---
name: iOS PWA cookie behavior
description: iOS Safari PWA silently drops Set-Cookie headers on redirect responses — never use NextResponse.redirect() in middleware for routes that need to carry refreshed session cookies
type: feedback
---

iOS Safari in PWA standalone mode silently drops `Set-Cookie` headers on redirect responses. This is a WebKit behavior, not configurable.

**Why:** When middleware calls `NextResponse.redirect()`, any refreshed Supabase session tokens written into `supabaseResponse` are discarded by iOS. Supabase rotates refresh tokens on use, so the next request sees an already-invalidated token → redirected to login.

**How to apply:** Never handle auth redirects for `/` (or any route where the session may need refreshing) via `NextResponse.redirect()` in middleware. Instead:
- Middleware returns `NextResponse.next()` (supabaseResponse) — Next.js merges its `Set-Cookie` headers automatically
- Let `app/page.tsx` (Server Component) call `redirect()` from `next/navigation` — iOS does not drop cookies on this path

This was the root cause of issue #68 — introduced by commit `d17b043` which moved the `/` redirect from `page.tsx` into middleware. Fixed in PR #72.
