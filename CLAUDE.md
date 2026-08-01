# CLAUDE.md — orchestrator

> **Project:** project-insights · iNSIGHTS Track hackathon
> **Last Updated:** 2026-08-01

An AI research & innovation copilot for students. Enter one sentence — *"build an AI solution to reduce food waste in college hostels"* — and get back what's already been built, whether the idea is actually novel, and a plan sized to the team and weeks you really have. **Every repo, dataset and paper is verified live, not recalled from a model's memory.**

3 people · **2-hour build** · plain JavaScript · parallel lanes.

---

## Status: the UI is done. The lanes make it real.

**All four routes are built and styled, running off `lib/fixtures.js`.** Landing, live analysis, results (graph + insight rail + comparison + vault), and Reality Check. Light and dark. `pnpm build` passes.

That means **the demo already works today**. Everything the lanes do from here is upside — wiring live data and closing requirement gaps. Nothing you do should leave `main` worse than it is now; if a change breaks a screen, revert it.

---

## Read these first — binding, not optional

| Doc | What it governs |
|---|---|
| [DEVELOPMENT-CHECKLIST.md](DEVELOPMENT-CHECKLIST.md) | **The single source of status.** Lanes, waves, the contract, file ownership. Read before touching anything. |
| [docs/REQUIREMENTS-COVERAGE.md](docs/REQUIREMENTS-COVERAGE.md) | What the brief demands vs what we're building. **The pass/fail surface.** |
| [docs/UI-SPEC.md](docs/UI-SPEC.md) | Every screen, the palette, the anti-slop rules. |
| [BRAINDUMP.md](BRAINDUMP.md) | Strategy, research, the wedge. Context — *not* a build list. |
| [iNSIGHTS Track.txt](iNSIGHTS%20Track.txt) | The mandate. **If anything contradicts it, it wins.** |

---

## The one rule

> **If it isn't in `iNSIGHTS Track.txt`, it doesn't get built until everything that is has shipped.**

The brief's only pass/fail rule: *"must utilize at least **four**"* Layer 2 components. We target **7** so a struck claim can't sink us. **Requirements first, moat second, polish third.**

---

## Priority order

1. **Requirement coverage** — the F-items in the checklist (Telegram, translate, architecture, export brief, learning resources, Problem Radar). Non-negotiable.
2. **Differentiation** — live verification, saturation index, Reality Check. How we win rather than merely qualify.
3. **Polish** — responsive sweep, motion, ledger detail.

### What we're building (and why each survived)

| Feature | Why | State |
|---|---|---|
| **Live resource verification** | The kill shot. GitHub API + liveness checks. Nobody else will have it. | UI ✅ · pipeline = A-2 |
| **Novelty & saturation index** | The moat. A *quantified* crowdedness score plus the white space — and we show our scoring math. | UI ✅ · pipeline = A-3 |
| **Reality Check** | Plan sized to team/weeks/budget. Over-scoping is the documented #1 killer of student projects. | UI ✅ · route = C-1 |
| **Evidence Ledger + honesty panel** | Confidence, corroboration, and an explicit *"what I could NOT verify"*. "Verifiable" is in the judging criteria. | ✅ |
| **Knowledge graph canvas** | The hero screenshot. Also the anti-hallucination backbone. | ✅ |
| **Comparison · Architecture · Export brief · Telegram · Multilingual · Problem Radar** | Required outputs and capabilities. Not optional. | mixed — see checklist |

**Cut:** GitHub repo scaffolding, adaptive re-planning, multi-agent council, team lanes, auth, persistence. Say these out loud in the pitch as roadmap — scope discipline is literally our product's thesis.

---

## Parallel development

**Folder ownership is the lock.** With 3 people and no time, it beats git branching ceremony.

**Two people, two lanes.**

| Lane | Who | Owns exclusively |
|---|---|---|
| **A — Brain** | Omanand | `lib/services/**`, `app/api/analyze/**`, `app/api/reality/**` |
| **B — Reach** | Friend | `lib/bot/**`, `app/api/bot/**`, `app/api/translate/**`, `lib/history.js`, `components/intake/**`, `app/analyze/[id]/brief/**` |

- 🔒 **Frozen — announce before editing:** `lib/types.js`, `lib/fixtures.js`, `app/globals.css`, `app/layout.jsx`.
- **Shared, touch with care:** `components/shell/TopBar.jsx` (B adds the language toggle), `app/page.jsx` (B adds the workspace rail + Problem Radar entry). Commit immediately after.
- Everything else under `components/` is built and stable — **read it, don't rewrite it.**
- Commit every ~15 min. Pull before push. `<type>: <item-id> <summary>`.
- Mark your checklist item `[x]` with the commit hash. Completion is a hash, not an opinion.
- **Standup at T+45.**

---

## The contract

`lib/types.js` (JSDoc typedefs) + `lib/fixtures.js` (a fully-populated demo `Analysis`). **Frozen.**

**We're on plain JS — nothing is enforced at build time.** So:
- `lib/fixtures.js` *is* the contract. If a component renders correctly from the fixture, it's correct. **Read the fixture, not your memory of the shape.**
- Annotate consumers: `/** @type {import('@/lib/types').Analysis} */` gives full autocomplete.
- **Defend every optional field.** `novelty`, `reality`, `architecture` are absent until their stage completes. `a.novelty?.saturationScore ?? 0` — a bare dot white-screens the demo and nothing warns you.

API surface the lanes must honour exactly:
- `POST /api/analyze` → `{ id }`
- `GET /api/analyze/[id]` → `Analysis` (the live view polls this every 800ms)
- `POST /api/reality` → `RealityCheck` (+ `Architecture`)

**Every screen already falls back to fixtures when a route 404s or the network dies.** Don't remove those fallbacks — they are the demo's insurance.

---

## Commands

```bash
pnpm dev              # http://localhost:3000
pnpm build            # must pass before you push
NEXT_PUBLIC_USE_FIXTURES=1 pnpm dev   # full app, zero network — the demo safety net
```

Routes: `/` · `/analyze/[id]` · `/analyze/[id]/plan`. **`/analyze/demo` always works**, with or without APIs.

Keys in `.env.local` (see `.env.example`): `ANTHROPIC_API_KEY`, `TAVILY_API_KEY`, optional `GITHUB_TOKEN`, `TELEGRAM_BOT_TOKEN`.

---

## Tech constraints — do not "fix" these

- **Plain JavaScript. No TypeScript, ever.** No `.ts`/`.tsx`, no `tsconfig.json`. Types are JSDoc typedefs.
- **No database.** In-memory `Map` + `localStorage`. Auth and persistence are the 2-hour sink judges never see.
- **Polling, not SSE.** Streaming is nicer and costs 25 minutes of debugging.
- **Tailwind v4** — tokens live in `app/globals.css` under `@theme`. No `tailwind.config.js`.
- **The graph is our own SVG force layout** (`lib/graph-layout.js`), not a library. Don't swap in react-force-graph — it's 200kB for 18 nodes.
- **Mermaid is imported dynamically** in `ArchitectureDiagram` — keep it that way, it's ~500kB.
- Design tokens are CSS variables. **Never hardcode a hex in a component.**

---

## Design red lines

Full spec in [docs/UI-SPEC.md](docs/UI-SPEC.md). The essentials:

- **Instrument, not marketing site.** Warm near-black canvas, bone ink, 1px hairlines, no shadows. "Letterpress on black."
- **The identity rule:** machine-produced data (scores, counts, URLs, timestamps, stars) renders in **mono**; human prose in **sans**.
- **Status is the brand.** verified · stale · dead. There is deliberately **no other accent colour**, and **lime is never decorative** — no glows, no gradients, no button fills. It appears only where something has been checked.
- **Status is never colour-only** — always the word and glyph too.
- **The signature:** the hero's highlighted word is *stamped*, not coloured — treated exactly like a verified resource. It is the one bold moment on the page; everything else stays quiet.
- **Banned:** purple→blue gradient hero · ✨ sparkle chatbox · three generic feature cards · glassmorphism · fake dashboard density · robot mascots · **any bare loading spinner**.
- **Never hide the "what I could NOT verify" panel.** It's the whole trust pitch, and it must never be empty on a real query.
- **Every number on screen is real** — from `lib/fixtures.js` or the API. No invented "10,000+ students" stats.

---

## Agent etiquette

1. Read the governing docs before modifying anything they cover.
2. Never leave code and its doc contradicting each other — update the doc in the same commit.
3. New surface (page, API route, module) gets its checklist item marked and its doc line updated.
4. Never edit another lane's files. Never hand-edit `pnpm-lock.yaml`.
5. **When the spec and the code disagree and you can't tell which is right — stop and ask.** That conflict is exactly what the human needs to see.
6. Under time pressure, cut scope openly and record it. Never silently ship less than the checklist claims.
