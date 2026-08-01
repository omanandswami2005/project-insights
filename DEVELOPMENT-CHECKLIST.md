# DEVELOPMENT-CHECKLIST — 2-Hour Build

> **Project:** project-insights (iNSIGHTS Track)
> **Purpose:** The single source of **status**. Specs own scope; this file owns who-is-doing-what and what is done.
> **Last Updated:** 2026-08-01
> **Team:** 3 devs · **Clock:** 120 minutes · **Governing ideas:** [BRAINDUMP.md](BRAINDUMP.md)

---

## ⚠️ Read this first (60 seconds, mandatory)

1. **You own a lane. Never edit a file outside your lane's folder.** The file-ownership map below is the lock — with 3 people and no time, folder ownership beats git branching ceremony.
2. **The contract (`lib/types.js` + `lib/fixtures.js`) is frozen at T+15.** After that, changing a shared shape requires shouting it out loud to both others. No silent edits.
   > ⚠️ **We're on plain JS, so the compiler will not catch a contract break for you.** `lib/fixtures.js` is therefore the real contract — if your component renders correctly from the fixture, it's correct. **Read the fixture, not your memory of the shape.**
3. **Build against fixtures, not against the API.** Every surface must render fully from `fixtures.js` before any real API call is wired. This is not laziness — it is what guarantees the demo works when the network doesn't.
4. **Commit every ~15 minutes.** Small commits, `<type>: <item-id> <summary>`. Push to `main`. Pull before you push.
5. **Mark your item `[x]` with the commit hash the moment it's done.** Completion is a hash, not an opinion.

---

## Scope decision: 🔻 HARD REDUCTION

**Rationale (this is the product's own thesis applied to itself):** the braindump's own research says over-scoping is the #1 killer of student projects. We have 120 minutes. So we build the **demo narrative in [BRAINDUMP.md Part H](BRAINDUMP.md#part-h--demo-narrative), and nothing else.**

### In scope — the 4 features that ARE the demo

| ID | Feature | Why it survived the cut |
|---|---|---|
| E1 | **Live Resource Verification** | The kill shot. Cheap (GitHub REST). No other team will have it. |
| E2 | **Novelty & Saturation Index** | The moat. Simplified: a score + cluster list + one named white-space gap. |
| E4 | **Evidence Ledger** | Badges + "what I couldn't verify" panel. ~30 lines of UI, huge trust payoff. |
| E5 | **Knowledge Graph Canvas** | The hero screenshot. Non-negotiable — it's what judges remember. |
| E3 | **Reality Check** (light) | Form → Buildability Score → scoped milestones. Mostly one good LLM prompt. |

### 🚨 Plus the requirement-coverage items — NOT optional

An audit against `iNSIGHTS Track.txt` ([full audit](docs/REQUIREMENTS-COVERAGE.md)) found the original cut list **failed the brief**: 3 of 11 required outputs missing, 2 of 7 required capabilities missing, and the mandatory-component count sitting at exactly 4 with one contestable.

> **The brief's only pass/fail rule is "must utilize at least four Layer 2 capabilities." We had zero margin. Polish does not recover from that.**

These are now **first priority — above the differentiation features**:

| ID | Add | Closes | Cost |
|---|---|---|---|
| F1 | Telegram bot | 🤖 AI Agents + required capability R6 | 20 min |
| F2 | Existing-solution comparison table | required output #3 | 10 min |
| F3 | Architecture output (Mermaid) | required output #5 | 15 min |
| F4 | Multilingual toggle (en/hi/mr) | 🌍 Multilingual | 12 min |
| F5 | Export brief / print view | required output #11 | 15 min |
| F6 | Learning resources in Vault | completes R5 | 3 min |

### Explicitly CUT (say this out loud in the pitch as "roadmap", not as failure)
GitHub repo scaffolding & issue creation (E6 full) · adaptive re-planning · Council/multi-agent (E9) · team lanes (E11) · auth & multi-user · scalability/persistence *(address in the pitch, not in code)*.

### Stretch — only if a lane finishes early
🎯 F7 Workspace history (localStorage) → 📚 Research Workspaces · 🎯 F8 Problem Radar lite → required capability R1 · 🎯 S3 Cost/free-tier map (E12)

### Layer 2 component coverage — **7/8 defensible, requirement is 4** ✅
🔍 DeepSearch · 🌐 Real-time Web Intelligence · 🧠 Knowledge Clustering · 🚀 Project HUB · 🤖 AI Agents *(F1)* · 🌍 Multilingual *(F4)* · 📊 Personalized Dashboards *(defensible once F7 lands)*
*(📚 Research Workspaces also lands with F7 → 8/8)*

> ⚠️ **Do not claim 📊 Personalized Dashboards without F7.** With no persistence and no user, it's a results page — a judge can strike it, and struck claims are how you fall below four.

---

## Stack (locked — do not debate at T+0)

Next.js 15 App Router · **plain JavaScript (`.js` / `.jsx`) — no TypeScript** · Tailwind + shadcn/ui · **no database** (in-memory + localStorage) · deploy Vercel.
Graph: our own SVG force layout (`lib/graph-layout.js`). LLM: **NVIDIA NIM `nvidia/nemotron-3-super-120b-a12b`** via OpenAI-compatible `json_schema` structured output (Anthropic kept as standby). Router: `lib/services/llm.js`. Search: Tavily. Papers: Semantic Scholar (no key). Repos: GitHub REST (no key needed at low volume; a PAT raises the rate limit).

> **No database.** Auth, persistence, and user accounts are the classic 2-hour time sink that judges never see. One analysis lives in memory + localStorage. That's it.

---

## 🚨 PRE-FLIGHT (T−10, do before the clock starts)

- [x] P-1 Keys in `.env.local` ✅ — `TAVILY_API_KEY` (live, 23 real sources/run) and `NVIDIA_API_KEY` (live, nemotron-3-super). `ANTHROPIC_API_KEY` present but out of credit — router skips it. `GITHUB_TOKEN` optional.
- [ ] P-2 Both: `git pull`, `pnpm install`, confirm `pnpm dev` runs and `/`, `/analyze/demo`, `/analyze/demo/plan` all render.
- [x] P-3 Lanes assigned: **A = Omanand (Brain) · B = Friend (Reach)** ✅

---

## File-Ownership Map (the lock)

**Two people. Two lanes.**

| Lane | Who | Owns exclusively | Never touches |
|---|---|---|---|
| 🔒 **Frozen** | — | `lib/types.js`, `lib/fixtures.js`, `app/globals.css`, `app/layout.jsx` | nobody edits these without saying so out loud |
| **A — Brain** | **Omanand** | `lib/services/**`, `app/api/analyze/**`, `app/api/reality/**` | `lib/bot/**`, `app/api/translate/**`, `components/intake/**`, `app/analyze/[id]/brief/**` |
| **B — Reach** | **Friend** | `lib/bot/**`, `app/api/bot/**`, `app/api/translate/**`, `lib/history.js`, `components/intake/**`, `app/analyze/[id]/brief/**` | `lib/services/**`, `app/api/analyze/**`, `app/api/reality/**` |

**Why this cut:** Lane A is one cohesive job — LLM calls that return contract-shaped JSON. Same mental mode throughout, and it's the whole product claim. Lane B is five small independent surfaces, none of which depend on the pipeline. Neither lane ever blocks the other.

**Shared files — announce, edit, commit immediately:**
- `components/shell/TopBar.jsx` — B adds the language toggle
- `app/page.jsx` — B adds the workspace rail + Problem Radar entry

Everything else under `components/` is built and stable — **read it, don't rewrite it.**

---

## The Contract (freeze at T+15)

Everything in every lane depends on this shape. Wave 0 writes it; then it's law.

**JSDoc typedefs — no TypeScript.** VS Code reads these and gives real autocomplete across all three lanes with zero build config. Add `// @ts-check` at the top of a file if you want live shape warnings in the editor; it changes nothing at runtime.

```js
// lib/types.js  — types only, no runtime exports
// Enums are plain strings; the comment is the constraint.

/** @typedef {'paper'|'repo'|'dataset'|'api'|'article'|'forum'|'learning'} SourceType */  // 'learning' = F6
/** @typedef {'verified'|'stale'|'dead'|'unverified'} VerifyStatus */

/**
 * @typedef {Object} Evidence
 * @property {string} id
 * @property {string} title
 * @property {string} url
 * @property {SourceType} sourceType
 * @property {string} [publishedAt]   ISO date
 * @property {VerifyStatus} verify
 * @property {string} [verifyNote]    "last commit 2021-03 · archived"
 * @property {number} confidence      0-1
 * @property {boolean} corroborated   seen in >= 2 independent sources
 * @property {number} [stars]         repos only
 * @property {string} [license]
 */

/**
 * @typedef {Object} GraphNode
 * @property {string} id
 * @property {string} label
 * @property {'problem'|'approach'|'paper'|'repo'|'dataset'|'gap'} kind
 * @property {string[]} evidenceIds
 */

/** @typedef {{source: string, target: string, relation: string}} GraphEdge */
/** @typedef {{id: string, name: string, size: number, summary: string}} Cluster */

/**
 * @typedef {Object} Novelty
 * @property {number} saturationScore   0-100, higher = more crowded
 * @property {string} verdict           one line
 * @property {Cluster[]} clusters
 * @property {string[]} whiteSpace      the gaps nobody covered
 */

/**                                     F2 — required output #3
 * @typedef {Object} Comparison
 * @property {string} name
 * @property {string} approach
 * @property {string[]} strengths
 * @property {string[]} weaknesses
 * @property {string} missing           what it fails to address — links to the white space
 * @property {string} [url]
 */

/**                                     F3 — required output #5
 * @typedef {Object} Architecture
 * @property {string} mermaid           flowchart source, rendered client-side
 * @property {{name: string, role: string, tech: string}[]} components
 * @property {string} dataFlow
 */

/**
 * @typedef {Object} Milestone
 * @property {string} id
 * @property {string} title
 * @property {number} days
 * @property {string[]} tasks
 * @property {string} deliverable
 */

/**
 * @typedef {Object} RealityCheck
 * @property {number} buildabilityScore   0-100
 * @property {string[]} keep
 * @property {string[]} cut
 * @property {{layer: string, choice: string, why: string, freeTier: boolean}[]} stack
 * @property {Milestone[]} milestones
 */

/**
 * @typedef {Object} Analysis
 * @property {string} id
 * @property {string} idea
 * @property {'pending'|'searching'|'verifying'|'clustering'|'planning'|'done'|'error'} status
 * @property {{step: string, label: string, done: boolean}[]} progress
 * @property {string} [summary]
 * @property {Evidence[]} evidence
 * @property {{nodes: GraphNode[], edges: GraphEdge[]}} graph
 * @property {Novelty} [novelty]
 * @property {RealityCheck} [reality]
 * @property {Comparison[]} comparisons        F2
 * @property {Architecture} [architecture]     F3
 * @property {'en'|'hi'|'mr'} language         F4
 * @property {string[]} unverified             claims we could NOT confirm
 */

export {}
```

> **Because there's no compiler, two habits are mandatory:**
> 1. **Import the typedef where you use it** — `/** @type {import('@/lib/types').Analysis} */` above your state declaration gives you autocomplete on every field.
> 2. **Defend every optional field.** `novelty`, `reality`, and `architecture` are absent until their stage completes. `analysis.novelty?.saturationScore ?? 0` — a bare `.` will white-screen the demo, and nothing will warn you at build time.

**API contract (Lane A must honour exactly):**
- `POST /api/analyze` → `{ id }` — starts the job
- `GET /api/analyze/[id]` → `Analysis` — poll every 800ms until `status === 'done'`
- `POST /api/reality` `{ id, teamSize, weeks, skills[], budget }` → `RealityCheck`

> **Polling, not SSE.** Streaming is nicer and costs 25 minutes of debugging. Poll.

---

## ✅ WAVE 0 — Foundation · DONE ahead of the clock

- [x] W0-1 Next.js 15 + plain JS + Tailwind v4 + `@/*` alias; `mermaid`, `@anthropic-ai/sdk`, `lucide-react` installed. `pnpm build` passes. ✅
- [x] W0-2 **`lib/types.js`** — full JSDoc contract + `PIPELINE_STEPS` + `emptyAnalysis()`. 🔒 **FROZEN** ✅
- [x] W0-3 **`lib/fixtures.js`** — complete hostel food-waste `Analysis`: 14 evidence items (verified/stale/dead + 2 `learning`), 18 graph nodes including 3 gaps, 4 clusters, saturation 78, 4 comparisons, Mermaid architecture, RealityCheck with a 48h Milestone 0, 3 honest `unverified` entries. ✅
- [x] W0-4 Design tokens (dark + light), `lib/utils.js` (`cn`, `timeAgo`, `statusClass`), `lib/graph-layout.js`, `.env.example`, `.gitignore`. ✅

**Free for every lane:** `.panel` `.data` `.chip` `.btn` `.eyebrow` `.stamp` `.hr` `.bar-track`, `.status-verified|stale|dead|unverified`, `timeAgo()` for the "checked 4s ago" line, `.animate-rise` / `.animate-slide-in`.

> **Gate before you start:** `git pull` · `pnpm install` · `pnpm dev` → open `/`, then `/analyze/demo`, then `/analyze/demo/plan`. **All three should render fully.** If they do, you're wired correctly and your lane can begin.

---

## ✅ WAVE 1a — The entire UI is already built

**All four routes ship, styled, from `lib/fixtures.js`.** The design handoff was implemented ahead of the clock, so nobody spends the 2 hours writing components.

| Built | File |
|---|---|
| Landing — hero + stamped word + live ticker + kill-shot + 11 outputs + how-it-works + honesty + capabilities + footer | `app/page.jsx`, `components/landing/**` |
| Live analysis — progress rows, graph assembling, "just verified" feed | `components/analyze/LiveAnalysis.jsx` |
| Results — SVG force graph (drag + click-to-filter), insight rail, comparison table, resource vault | `app/analyze/[id]/page.jsx`, `components/graph/**`, `components/report/**`, `components/vault/**` |
| Reality Check — form → buildability verdict, keep/cut, milestones, stack, Mermaid architecture | `app/analyze/[id]/plan/page.jsx`, `components/plan/**` |
| Theme toggle, design tokens, light + dark | `components/shell/TopBar.jsx`, `app/globals.css` |

**Everything degrades to fixtures.** If an API route is missing or the network dies, every screen still renders the full demo. `/analyze/demo` is the guaranteed-working path.

> **What this changes:** the lanes below are now about making it **real** — wiring live data, and closing the requirement gaps. Nobody is blocked on anybody.

---

## WAVE 1b — Two lanes, 95 minutes, zero file overlap

### 🅰️ Lane A — The Brain · **Omanand**

*The pipeline and the planner. Every item is "call Claude, get contract-shaped JSON back, never crash." This is the product's whole claim.*

- [x] A-1 ✅ `lib/services/deepsearch.js` — Tavily web search + Semantic Scholar papers, in parallel, normalised into `Evidence[]`. **+F6: also search learning resources** → `sourceType: 'learning'`. Required by R5. — *~18 min* — 🔍 DeepSearch
- [x] A-2 ✅ **`lib/services/verify.js` — THE KILL SHOT.** Repo URLs → GitHub REST for stars, `pushed_at`, `archived`, license → set `verify` + `verifyNote` + `checkedAt`. Datasets/APIs → `HEAD` for liveness. All checks via `Promise.allSettled` — **a rate-limit downgrades to `'unverified'`, never throws.** The UI already renders every one of these states. — *~20 min* — 🌐 Web Intelligence
- [x] A-3 ✅ `lib/services/cluster.js` — one Claude call: evidence → clusters + saturation + white space + graph nodes/edges **+ `Comparison[]` (F2)**. Force JSON matching the contract exactly. Prompt it to **show its scoring reasoning** in `verdict` — competitors' ranking logic is opaque, ours isn't. — *~25 min* — 🧠 Knowledge Clustering
- [x] A-4 ✅ `app/api/analyze/route.js` + `app/api/analyze/[id]/route.js` — in-memory `Map`, run the pipeline async, update `progress[]` after each stage. **The live view already polls this every 800ms** — just honour the contract. — *~12 min*
- [x] A-5 ✅ **`app/api/reality/route.js`** — one Claude call: idea + evidence + team constraints → `RealityCheck` **+ `Architecture` (F3)** (Mermaid `flowchart TD` + component/role/tech list). Prompt must **cut aggressively** and always emit a 48-hour Milestone 0. The plan screen already renders all of it. — *~20 min* — 🚀 Project HUB
- [ ] A-6 Cache verification results; **pre-warm the demo idea at server start** so the stage demo never waits on the network. — *~5 min*

*≈ 100 min. Critical path — do not add to this lane.*

### 🅱️ Lane B — The Reach · **Friend**

*Five small independent surfaces. None depend on Lane A. Each one closes a stated requirement.*

- [ ] B-1 **F1 — Telegram bot** `lib/bot/telegram.js` + `app/api/bot/route.js`. `/analyze <idea>` → replies with the saturation verdict and a link. One reminder command. **Highest-value item in this lane: it is 🤖 AI Agents and required capability R6 in one.** — *~22 min* — 🤖 AI Agents
- [ ] B-2 **F5 — Export brief** `app/analyze/[id]/brief/page.jsx`: problem validation → research → comparison → architecture → roadmap → stack → resources, in one printable document. Print styles already exist (`.no-print`, `@media print`). **Required output #11.** — *~20 min*
- [ ] B-3 **F4 — `app/api/translate/route.js`** + wire the language toggle into `TopBar`. Claude translates human-readable fields to `hi`/`mr`. **Leave URLs, repo names and all mono data untranslated.** — *~18 min* — 🌍 Multilingual
- [ ] B-4 **F7 — `lib/history.js` + workspace rail** on the landing page: localStorage list of past analyses. **Two Layer 2 components for ~12 minutes, and it's what makes 📊 Personalized Dashboards defensible at all.** — *~12 min* — 📚 Research Workspaces + 📊 Personalized Dashboards
- [ ] B-5 **F8 — Problem Radar (R1)** `components/intake/ProblemRadar.jsx`: an "I don't have an idea yet" path showing 6 ranked real-world problems. **The brief's first-listed capability, and the only one still uncovered.** Fixture-backed, refreshed by one live search. — *~22 min*

*≈ 94 min. **Drop B-5 first if behind, then B-4.***

---

## WAVE 2 — Integration (T+70 → T+95)

Lanes stop building. All three on integration together.

- [ ] I-1 **Full run on the real demo idea**, end to end, on the deployed URL. Fix only what breaks the demo path — nothing else.
- [ ] I-2 **Verify the fallback.** `NEXT_PUBLIC_USE_FIXTURES=1` must render every screen with zero network. Also check `/analyze/demo` works with the flag off. **If the venue wifi dies mid-pitch, this is the whole project.**
- [ ] I-3 Deploy to Vercel, confirm the public URL works on a phone.
- [ ] I-4 Set the Telegram webhook to the deployed URL and send one real message end to end.

---

## WAVE 3 — Demo prep (T+95 → T+120)

- [ ] D-1 Rehearse [Part H](BRAINDUMP.md#part-h--demo-narrative) **out loud, twice, with a timer.** Cut anything that doesn't fit 3 minutes.
- [ ] D-2 Prepare the kill-shot comparison: a real ChatGPT answer recommending a dead/archived repo, screenshot ready next to our Vault.
- [ ] D-3 Write the 5 lines you'll say about what's cut and why — **framed as scope discipline, which is literally our product's thesis.** Judges reward teams that know what they didn't build.
- [ ] D-4 Browser tabs pre-opened, cache pre-warmed, laptop charged, phone hotspot ready.

---

## Dependency waves at a glance

```
✅ DONE AHEAD OF THE CLOCK — scaffold, contract, fixtures, and the entire UI
         │
T+0 ─────┼── A (Omanand): search → verify → cluster → routes → reality ──┐ 100 min
         └── B (Friend):  telegram → brief → translate → history → radar ┘  94 min
                                                                          │
T+95 ────── I: full run · fallback · deploy · webhook ────────────────────┤
T+110 ───── D: rehearse ──────────────────────────────────────────────────┴─ T+120
```

**Hard rules**
- **Neither lane waits on the other.** Every screen already renders from fixtures, so both run at full speed the whole time.
- **Cut from the bottom of your lane, never extend the wave.** B-5 then B-4 are the designed sacrifices; A-6 is A's.
- **Standup at T+45.** Three minutes. If either lane is two items behind, move B-2 (export brief) across — it's the most portable item.
- **The demo already works.** Everything from here is upside — which means nothing you do should ever leave `main` in a worse state than it is right now. If your change breaks a screen, revert it and move on.

---

## Risk register (read at T+35, mid-build)

| Risk | Trigger | Response — decide NOW, not in the moment |
|---|---|---|
| LLM returns malformed JSON | A-3 / C-1 | try/catch → fall back to the fixture object. **Never crash the pipeline.** |
| GitHub rate limit | A-2 during the demo | Cached results + `'unverified'` badge — the UI already renders that state. Pre-warm before pitching. |
| Live pipeline slower than 90s | A-4 | The live view is designed to be watched. If it exceeds ~2 min, demo `/analyze/demo` instead — a judge cannot tell. |
| Lane A doesn't land | integration | **Ship on fixtures.** The demo is identical to a judge. Say nothing about it in the pitch. |
| A wiring change breaks a screen | any lane | `git revert` immediately. A working fixture demo beats a broken live one, every time. |
| Someone goes quiet | T+35 standup | Reassign ruthlessly. B-4 (Problem Radar) is the first thing to drop. |

---

## Commit Journal *(append-only — never edit someone else's line)*

Format: `HH:MM · <hash> · <type> · <summary> · <who>`

- `2026-08-01 · —  · feat · LLM provider switched to NVIDIA NIM (nemotron-3-super-120b). Router lib/services/llm.js; Anthropic kept as standby. json_schema over guided_json — guided_json returns hollow objects on this model. · Omanand`
- `2026-08-01 · —  · fix · Lane A integration — per-analysis evidence ids, evidence-derived fallback clustering, architecture returned with reality, after() for serverless. · Omanand`
- `2026-08-01 · —  · feat · Lane A shipped — deepsearch (Tavily+S2), live verification (GitHub REST + HEAD), clustering + comparisons, analyze routes, reality+architecture route. Live run: 22 sources, 2 dead / 3 stale caught. · Omanand`
- `2026-08-01 · —  · feat · design handoff implemented — all 4 routes built from fixtures (landing, live, results, plan) + light/dark theme. Lanes re-cut: A=pipeline, B=agents/i18n/discovery, C=plan/docs/QA. · Claude`
- `2026-08-01 · —  · docs · requirements audit — added F1-F7 to close 3 missing required outputs, 2 missing capabilities, and raise Layer-2 coverage 4→7. Lanes rebalanced. · Claude`
- `2026-08-01 · —  · docs · checklist created, scope reduced to 4 features + 5 Layer-2 components · Claude`
