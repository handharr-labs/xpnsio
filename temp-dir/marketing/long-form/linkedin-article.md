# I Built a Personal Finance App in My Spare Time — Here's Why and What I Learned

*A build-in-public retrospective on Xpnsio — budget-first spending awareness.*

---

## The Frustration

It happens at the end of every month. You open your banking app, scroll through transactions, and feel a quiet dread. You spent *how much* on food? On coffee? On subscriptions you forgot you had?

You don't even know exactly — you'd have to manually add it up. And even then, you wouldn't know if it was too much, because you never set a number beforehand.

That's the loop most of us are stuck in: spend freely, discover the damage later, feel bad, repeat.

I was stuck in the same loop. And the irony is that I tried several budgeting apps to fix it — but they all had the same design flaw.

---

## The Insight: Budget-First vs. Expense-First

Most budgeting apps are **expense trackers** with a budget layer bolted on. The core flow is: *record what you spent*. The budget comparison is secondary — usually a summary screen you check at month-end.

That's backward.

If you only find out you overspent *after* you overspent, the information is useless. You can't un-buy the coffee.

What actually changes behavior is knowing **before you spend** — or at minimum, instantly after — how much budget you have left. Not how much you've spent. How much is **left**.

The psychological difference is significant. "I've spent $180 on food" is a fact. "I have $20 left for food this week" is an *actionable constraint*.

That realization became the core design principle behind **Xpnsio**: budget-first, not expense-first.

---

## What Xpnsio Does

Xpnsio is a personal finance app built around one core question: **"How much budget do I have left?"**

Here's how it works:

**1. Set budgets per category, per period**

You don't just set a monthly budget. You set a budget *per category* with its own *period*:
- $8/day for coffee
- $120/week for groceries
- $50/month for subscriptions
- $200/month for dining out

Each category has its own cadence that matches how you actually spend. Groceries are weekly. Coffee is daily. Subscriptions are monthly.

**2. Track against those limits**

As you add transactions, the dashboard shows your remaining budget per category — updated instantly. You always know where you stand, not where you stood last week.

**3. Visual progress indicators**

Each category shows a color-coded progress bar:
- Green: safely under 90% of budget
- Yellow: approaching limit (90-99%)
- Red: over budget

This works across daily, weekly, and monthly periods — so you can see at a glance whether you're safe, in the caution zone, or need to adjust.

**4. Multi-currency**

Support for IDR, USD, SGD, MYR, EUR, and more — because money is global and personal finance tools shouldn't be region-locked.

The result: a clean dashboard where the most important number is always visible — **remaining budget** — not a running total of what you've lost.

---

## The Tech Stack (for the engineers reading this)

I'm a software engineer by day, and I built Xpnsio as a weekend/spare-time project. The stack reflects choices I'd make in a production system, not shortcuts I'd take on a quick prototype.

**A note on AI-assisted development**

I used Claude (Anthropic's AI) throughout this project — not as a code generator, but as a development partner. The distinction matters. Dumping a vague prompt into an AI and pasting the output is not what I mean.

What I set up instead: a structured `CLAUDE.md` in the project root that defines the architecture rules, layer boundaries, import constraints, and naming conventions. Claude Code (the CLI tool) reads this on every session. The result is an AI assistant that understands *this project's* architecture — not generic Next.js patterns. It won't suggest putting business logic in a component because the rules explicitly forbid it.

This setup let me move faster without sacrificing architecture quality. The AI accelerates execution; the architecture constraints ensure the output stays coherent. I think this is the right model for AI-assisted software development: you define the principles, the AI operates within them.

I'd consider this a proof-of-concept for how to use AI tools properly in a real codebase — something I'm happy to talk about in more depth.

**Frontend: Next.js 15 App Router + React 19**

Next.js 15 with the App Router is genuinely excellent for full-stack apps. Server Components reduce client bundle size meaningfully — the dashboard loads fast because most data-fetching happens server-side. React 19 is stable and the improvements to form handling (via Server Actions) are underrated.

**Database: PostgreSQL via Supabase**

Supabase gives you a managed Postgres instance with a good dashboard, built-in auth, and row-level security. I use Drizzle ORM for type-safe queries — it's lightweight, fast, and generates SQL that actually looks like SQL.

**Auth: Supabase Auth + Google OAuth**

One-click Google sign-in. No passwords to manage. Row-level security ensures users only ever see their own data.

**Architecture: Clean Architecture layers**

This is probably the most opinionated decision. For a "side project," Clean Architecture might seem overkill. But having explicit `domain/`, `data/`, and `presentation/` layers means I can add features without the codebase turning into spaghetti. The domain layer has zero framework dependencies — it's just TypeScript interfaces and pure functions. That's testable, replaceable, and maintainable.

**UI: Tailwind + shadcn/ui**

Fast to build with, looks good out of the box, fully customizable. I've tried most React UI libraries and this combination consistently produces the cleanest output with the least frustration.

---

## What I'd Do Differently

**Ship earlier.** I spent too long on architecture decisions before having a single working screen. The domain model doesn't need to be perfect before you render your first dashboard.

**Simpler data model first.** The per-category, per-period budget system is powerful — but I designed it to be flexible from day one, which added complexity before I'd validated whether users actually wanted it. A v0.1 with just monthly category budgets would have been shippable in half the time.

**Write tests earlier.** I added Vitest later in the project. The domain layer was easy to test retroactively because of Clean Architecture — but the data layer had some gnarly integration paths that would have been easier to nail down if I'd written tests while building.

**Invest in screenshots sooner.** Good screenshots are worth more than a long README. I didn't think about visual presentation until it was time to share — and capturing "clean state" screenshots after the app is full of your own test data is annoying.

---

## Why I'm Sharing This

Xpnsio is live and free to use. I'm sharing it for two reasons:

**For non-engineers:** I genuinely think the budget-first model is more useful than what most apps offer. If you've ever felt the end-of-month dread of not knowing where your money went — this was built for you. Currently free, no ads. Just use it and tell me what's broken or missing.

**For engineers:** This is a portfolio piece. It demonstrates Clean Architecture applied to a Next.js full-stack app, principled AI-assisted development with Claude, and the discipline to not let a side project become a mess just because "it's just a side project." If you're curious about any of the architectural decisions or the AI workflow — ask in the comments.

If you're the kind of person who wants to stop wondering "wait, how much did I spend this month?" — give it a try.

**[Try Xpnsio free → xpnsio.vercel.app](https://xpnsio.vercel.app?utm_source=linkedin&utm_medium=article)**

No ads. Currently free. One person built it. Feedback welcome in the comments.

---

*What's the biggest frustration you have with budgeting or expense tracking? I'd love to hear it — it might shape the next feature.*
