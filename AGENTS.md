# CLAUDE.md — orchestrator

> **Project:** project-insights · iNSIGHTS Track hackathon
> **Last Updated:** 2026-08-01

An AI research & innovation copilot for students. Enter one sentence — *"build an AI solution to reduce food waste in college hostels"* — and get back what's already been built, whether the idea is actually novel, and a plan sized to the team and weeks you really have. **Every repo, dataset and paper is verified live, not recalled from a model's memory.**

3 people · **2-hour build** · plain JavaScript · parallel lanes.

---

## Read these first — binding, not optional

| Doc | What it governs |
|---|---|
| [DEVELOPMENT-CHECKLIST.md](DEVELOPMENT-CHECKLIST.md) | **The single source of status.** Lanes, waves, the contract, who owns which files. Read before touching anything. |
| [docs/REQUIREMENTS-COVERAGE.md](docs/REQUIREMENTS-COVERAGE.md) | What the hackathon brief demands vs what we're building. **The pass/fail surface.** |
| [docs/UI-SPEC.md](docs/UI-SPEC.md) | Every screen, the palette, the anti-slop rules. |
| [BRAINDUMP.md](BRAINDUMP.md) | Strategy, research, the wedge. Context — *not* a build list. |
| [iNSIGHTS Track.txt](iNSIGHTS%20Track.txt) | The mandate. **If anything contradicts it, it wins.** |

---

## The one rule

> **If it isn't in `iNSIGHTS Track.txt`, it doesn't get built until everything that is has shipped.**

The brief's only pass/fail rule: *"must utilize at least **four**"* Layer 2 components. We target **7** so a struck claim can't sink us. **Requirements first, moat second, polish third.**

---

## Priority order

1. **Requirement coverage** — F1–F6 in the checklist. Non-negotiable.
2. **Differentiation** — live verification, saturation index, Reality Check. How we win rather than merely qualify.
3. **Polish** — graph beauty, motion, ledger detail.
4. **Stretch** — F7 workspace history, F8 Problem Radar.

### What we're building (and why each survived)

| Feature | Why |
|---|---|
| **Live resource verification** | The kill shot. GitHub API + liveness checks. Nobody else will have it. |
| **Novelty & saturation index** | The moat. A *quantified* crowdedness score plus the white space — and we show our scoring math. |
| **Reality Check** | Plan sized to team/weeks/budget. Over-scoping is the documented #1 killer of student projects. |
| **Evidence Ledger** | Confidence, corroboration, and an explicit *"what I could NOT verify"* panel. "Verifiable" is in the judging criteria. |
| **Knowledge graph canvas** | The hero screenshot. Also the anti-hallucination backbone. |
| **Comparison · Architecture · Export brief · Telegram · Multilingual** | Required outputs and capabilities. Not optional. |

**Cut:** GitHub repo scaffolding, adaptive re-planning, multi-agent council, team lanes, auth, persistence. Say these out loud in the pitch as roadmap — scope discipline is literally our product's thesis.

---

## Parallel development

**Folder ownership is the lock.** With 3 people and no time, it beats git branching ceremony.

| Lane | Owns exclusively |
|---|---|
| **A — Pipeline** | `lib/services/**`, `app/api/analyze/**` |
| **B — Hero UI** | `app/page.jsx`, `app/analyze/**`, `components/graph/**`, `components/intake/**`, `lib/history.js` |
| **C — Outputs** | `components/report/**`, `components/vault/**`, `components/plan/**`, `app/api/reality/**` |

- **Never edit a file outside your lane.** Shared `components/ui/**` is add-only.
- **Lanes B and C never wait on Lane A** — they build against `lib/fixtures.js` from minute one.
- Commit every ~15 min. Pull before push. `<type>: <item-id> <summary>`.
- Mark your checklist item `[x]` with the commit hash when done. Completion is a hash, not an opinion.
- **Standup at T+50.** Anyone more than one item behind gets work reassigned then, not at T+85.

---

## The contract

`lib/types.js` (JSDoc typedefs) + `lib/fixtures.js` (a fully-populated demo `Analysis`). **Frozen at T+15.**

**We're on plain JS — nothing is enforced at build time.** So:
- `lib/fixtures.js` *is* the contract. If your component renders correctly from the fixture, it's correct. **Read the fixture, not your memory of the shape.**
- Annotate consumers: `/** @type {import('@/lib/types').Analysis} */` gives full autocomplete.
- **Defend every optional field.** `novelty`, `reality`, `architecture` are absent until their stage completes. `a.novelty?.saturationScore ?? 0` — a bare dot white-screens the demo and nothing warns you.

API surface Lane A must honour exactly:
- `POST /api/analyze` → `{ id }`
- `GET /api/analyze/[id]` → `Analysis` (poll every 800ms until `status === 'done'`)
- `POST /api/reality` → `RealityCheck`

---

## Commands

```bash
pnpm dev              # http://localhost:3000
pnpm build            # must pass before you push
NEXT_PUBLIC_USE_FIXTURES=1 pnpm dev   # full app, zero network — the demo safety net
```

Keys in `.env.local` (see `.env.example`): `ANTHROPIC_API_KEY`, `TAVILY_API_KEY`, optional `GITHUB_TOKEN`, `TELEGRAM_BOT_TOKEN`.
**Lanes B and C need none of these.**

---

## Tech constraints — do not "fix" these

- **Plain JavaScript. No TypeScript, ever.** No `.ts`/`.tsx`, no `tsconfig.json`. Types are JSDoc typedefs.
- **No database.** In-memory `Map` + `localStorage`. Auth and persistence are the 2-hour sink judges never see.
- **Polling, not SSE.** Streaming is nicer and costs 25 minutes of debugging.
- **Tailwind v4** — tokens live in `app/globals.css` under `@theme`. No `tailwind.config.js`.
- **`react-force-graph-2d` is browser-only** — import via `next/dynamic` with `{ ssr: false }`.
- Design tokens are CSS variables. **Never hardcode a hex in a component.**

---

## Design red lines

Full spec in [docs/UI-SPEC.md](docs/UI-SPEC.md). The essentials:

- **Instrument, not marketing site.** Near-black canvas, 1px hairlines, no shadows.
- **The identity rule:** machine-produced data (scores, counts, URLs, timestamps, stars) renders in **mono**; human prose in **sans**.
- **Status is the brand.** verified `#7BE04A` · stale `#E0A93A` · dead `#E5484D`. There is deliberately **no other accent colour** — anything else competes with the only hues carrying meaning.
- **Status is never colour-only** — always the word and glyph too.
- **Banned:** purple→blue gradient hero · ✨ sparkle chatbox · three generic feature cards · glassmorphism · fake dashboard density · robot mascots · **any bare loading spinner**.
- **Never hide the "what I could NOT verify" panel.** It's the whole trust pitch, and it must never be empty on a real query.

---

## Agent etiquette

1. Read the governing docs before modifying anything they cover.
2. Never leave code and its doc contradicting each other — update the doc in the same commit.
3. New surface (page, API route, module) gets its checklist item marked and its doc line updated.
4. Never edit another lane's files. Never hand-edit `pnpm-lock.yaml`.
5. **When the spec and the code disagree and you can't tell which is right — stop and ask.** That conflict is exactly what the human needs to see.
6. Under time pressure, cut scope openly and record it. Never silently ship less than the checklist claims.
