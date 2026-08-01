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
Graph: `react-force-graph-2d` or `reactflow`. LLM: Claude API (`claude-sonnet-5`). Search: Tavily. Papers: Semantic Scholar (no key). Repos: GitHub REST (no key needed at low volume; a PAT raises the rate limit).

> **No database.** Auth, persistence, and user accounts are the classic 2-hour time sink that judges never see. One analysis lives in memory + localStorage. That's it.

---

## 🚨 PRE-FLIGHT (T−10, do before the clock starts)

- [ ] P-1 Get API keys into `.env.local`: `ANTHROPIC_API_KEY`, `TAVILY_API_KEY`, `GITHUB_TOKEN` (optional). **If keys aren't ready, the whole build is fixture-only — decide now, not at T+60.**
- [ ] P-2 All three: `git clone`, `pnpm install`, confirm `pnpm dev` runs.
- [ ] P-3 Agree who is A, B, C. Write it here: **A = ____ · B = ____ · C = ____**

---

## File-Ownership Map (the lock)

| Lane | Owns exclusively | Never touches |
|---|---|---|
| **Wave 0** | `lib/types.js`, `lib/fixtures.js`, `app/layout.jsx`, `app/globals.css` | — (frozen after T+15) |
| **A — Pipeline** | `lib/services/**`, `app/api/analyze/**` | `components/**`, `app/page.jsx`, other api routes |
| **B — Hero UI** | `app/page.jsx`, `app/analyze/**`, `components/graph/**`, `components/intake/**`, `lib/history.js` | `app/api/**`, `components/report/**` |
| **C — Outputs** | `components/report/**`, `components/vault/**`, `components/plan/**`, **`app/api/reality/**`** | `lib/services/**`, `app/api/analyze/**`, `components/graph/**` |

> **Note:** Lane C owns the `reality` API route as well as its UI. It's an isolated file, and the person building the Reality Check UI knows its shape best. This is a deliberate exception to the layer split — feature verticals beat layer purity when you have 70 minutes.

Shared `components/ui/**` (shadcn primitives) — **add only, never edit** an existing one.

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

## WAVE 0 — Foundation (T+0 → T+15) · all three together

Do these in one room, one screen if needed. Nothing else starts until W0-2 lands.

✅ **WAVE 0 IS ALREADY DONE — it was built ahead of the clock. You start at T+15.**

- [x] W0-1 Next.js 15 + plain JS + Tailwind v4 + `@/*` alias, deps installed (`react-force-graph-2d`, `mermaid`, `@anthropic-ai/sdk`, `lucide-react`). `pnpm build` passes. ✅
- [x] W0-2 **`lib/types.js`** — full JSDoc contract + `PIPELINE_STEPS` + `emptyAnalysis()`. 🔒 **FROZEN** ✅
- [x] W0-3 **`lib/fixtures.js`** — complete hostel food-waste `Analysis`: 14 evidence items (verified/stale/dead + 2 `learning`), 18 graph nodes with 3 gap nodes, 4 clusters, saturation 78, 4 comparisons, Mermaid architecture, full RealityCheck with a 48h Milestone 0, 3 honest `unverified` entries. ✅
- [x] W0-4 App shell — `app/layout.jsx`, `app/globals.css` with all design tokens under `@theme`, `lib/utils.js` (`cn`, `timeAgo`, `statusClass`, `NODE_COLOR`), `.env.example`, `.gitignore`. ✅

**What you get for free:** `panel`, `data`, `status-verified|stale|dead|unverified` utility classes; `timeAgo()` for the "checked 4s ago" line; `NODE_COLOR` for the graph.

> **Gate before you start:** `git pull` · `pnpm install` · `pnpm dev` → the homepage should print `saturation 78 · evidence 14 · nodes 18 · comparisons 4 · buildability 64 · unverified 3` and three coloured status badges. **If those numbers render, your contract is wired correctly.**
>
> `app/page.jsx` is a placeholder — Lane B replaces it entirely in B-1.

---

## WAVE 1 — Parallel lanes (T+15 → T+85) · 70 minutes, zero file overlap

### 🅰️ Lane A — Pipeline & Verification `app/api/**`, `lib/services/**`

- [ ] A-1 `lib/services/deepsearch.js` — Tavily web search + Semantic Scholar paper search (parallel), normalize both into `Evidence[]`. **+F6: also search learning resources** (tutorials, courses, docs) → `sourceType: 'learning'`. Required by R5. — *~18 min* — 🔍 DeepSearch
- [ ] A-2 **`lib/services/verify.js` — THE KILL SHOT.** For each repo URL: GitHub REST → stars, `pushed_at`, `archived`, license, open-issue ratio → set `verify` + `verifyNote`. For datasets/APIs: `HEAD` request for liveness. Run all checks with `Promise.allSettled` — **a rate-limit must downgrade to `'unverified'`, never throw.** — *~20 min* — 🌐 Web Intelligence
- [ ] A-3 `lib/services/cluster.js` — one Claude call: evidence → clusters + saturation score + white-space gaps + graph nodes/edges. **Force JSON output matching `Novelty` + graph exactly.** Prompt it to *show its scoring reasoning* in `verdict` (competitors' ranking logic is opaque — ours isn't). **+F2: same call also emits `Comparison[]`** — 3–5 existing solutions with approach/strengths/weaknesses/what-it-misses. Required output #3, near-free here. — *~25 min* — 🧠 Knowledge Clustering
- [ ] A-4 `app/api/analyze/route.js` + `[id]/route.js` — in-memory `Map<string, Analysis>`, run the pipeline async, update `progress[]` after each stage so the UI has something live to show. — *~10 min*
- [ ] A-5 Cache every verification result in-memory; **pre-warm the demo idea at server start** so the stage demo never waits on the network. — *~5 min*

*Lane A total ≈ 73 min. This is the critical path — if A slips, B and C are unaffected (they run on fixtures), so **A must not be given extra work.***

### 🅱️ Lane B — Intake & Graph Canvas `app/page.jsx`, `app/analyze/**`, `components/graph/**`

*Follow [docs/UI-SPEC.md](docs/UI-SPEC.md) — it has the layouts, palette, and the anti-slop rules.*

- [ ] B-1 Landing + idea intake per [UI-SPEC §4](docs/UI-SPEC.md). One input, 3 example chips, submit → `POST /api/analyze` → route to `/analyze/[id]`. **Resist building a marketing page.** — *~10 min*
- [ ] B-2 Live analysis view per [UI-SPEC §5](docs/UI-SPEC.md): poll every 800ms, render `progress[]` as agents checking in, plus the "just verified" feed. **Never a bare spinner.** — *~15 min*
- [ ] B-3 **`components/graph/Canvas.jsx` — the hero** ([UI-SPEC §6.1](docs/UI-SPEC.md)). ⏱️ **HARD STOP at 25 min** — if it's fighting you, ship the static clustered layout and move on. — *~25 min*
- [ ] B-4 **F4 UI — language toggle** (EN / हिंदी / मराठी) in the header, calls `/api/translate`, swaps the rendered strings. — *~5 min* — 🌍 Multilingual
- [ ] B-5 **F7 — `lib/history.js` + workspace rail**: localStorage list of past analyses, shown on the intake page. **This is what makes 📊 Personalized Dashboards and 📚 Research Workspaces defensible claims — 8 minutes for two components.** — *~8 min* — 📚 Research Workspaces + 📊 Personalized Dashboards
- [ ] B-6 Styling pass. **Banned: gradient hero, sparkle chatbox, three feature cards, glassmorphism.** — *~5 min*

*Lane B total ≈ 68 min.*

### 🅲 Lane C — Report, Vault & Plan `components/report/**`, `components/vault/**`, `components/plan/**`

*Build every one of these against `fixtures.js` from minute one. Do not wait for Lane A.*

- [ ] C-1 **`app/api/reality/route.js`** — one Claude call: idea + evidence + team constraints → `RealityCheck`. Prompt must **cut features aggressively** and always emit a 48-hour Milestone 0. **+F3: the same call also emits `Architecture`** (Mermaid `flowchart TD` + component/role/tech list). Required output #5. — *~18 min* — 🚀 Project HUB
- [ ] C-2 **`components/report/Saturation.jsx`** ([UI-SPEC §6.2 A–C](docs/UI-SPEC.md)) — saturation score, verdict, cluster bars, white-space gaps as the payoff. — *~12 min*
- [ ] C-3 **`components/vault/ResourceVault.jsx`** ([UI-SPEC §6.3](docs/UI-SPEC.md)) — the kill shot. ✅/⚠️/❌ badges, `verifyNote`, `checked Ns ago`, **`learning` filter chip (F6)**. Dead entries stay visible at 55% opacity — we show what we rejected. — *~18 min*
- [ ] C-4 **`components/plan/PlanView.jsx`** — Reality Check form → Buildability Score, keep vs **cut** lists, milestone timeline, free-tier stack table, **+ Mermaid architecture render (F3)**. — *~15 min*
- [ ] C-5 **F2 — `components/report/Comparison.jsx`** — existing-solution comparison table: solution · approach · strengths · weaknesses · what it misses. **Required output #3.** — *~8 min*
- [ ] C-6 **`components/report/EvidenceLedger.jsx`** — source chips, recency, confidence bars, corroboration, and the **"What I could NOT verify"** panel. Functional over beautiful. — *~8 min*

*Lane C total ≈ 79 min — the fullest lane. If behind at T+70, drop C-6's polish and ship a plain list.*

---

## WAVE 2 — Requirement close-out + integration (T+85 → T+110)

Lanes stop building features. **The three remaining requirement items are split one per person** — they're isolated files, so this still runs fully parallel.

- [ ] I-1 **F1 — Telegram bot** `lib/bot/telegram.js` + `app/api/bot/route.js`. `/analyze <idea>` → runs the pipeline → replies with the saturation verdict + a link. One reminder command. **This single item is 🤖 AI Agents and required capability R6 — it is the highest-value 20 minutes remaining.** — *A* — *~20 min*
- [ ] I-2 **F4 — `app/api/translate/route.js`** — `{ analysisId, lang }` → Claude translates human-readable fields to `hi`/`mr`. Leave URLs, repo names, and mono data alone. — *B* — *~12 min* — 🌍 Multilingual
- [ ] I-3 **F5 — Export brief** `app/analyze/[id]/brief/page.jsx` + print stylesheet: problem validation → research → comparison → architecture → roadmap → stack → resources, in one printable document. **Required output #11 ("presentation-ready documentation").** — *C* — *~15 min*
- [ ] I-4 Wire Lane C's components into Lane B's `/analyze/[id]` page with **real** API data. — *all, as each finishes above*
- [ ] I-5 **Full run on the real demo idea**, end to end, on the deployed URL. Fix only what breaks the demo path.
- [ ] I-6 **Fallback switch:** one env flag (`NEXT_PUBLIC_USE_FIXTURES=1`) rendering everything from `fixtures.js`. **Verify it works.** If the venue wifi dies mid-pitch, this saves the project.
- [ ] I-7 Deploy to Vercel, confirm the public URL works on a phone.

---

## WAVE 3 — Demo prep (T+110 → T+120)

- [ ] D-1 Rehearse [Part H](BRAINDUMP.md#part-h--demo-narrative) **out loud, twice, with a timer.** Cut anything that doesn't fit 3 minutes.
- [ ] D-2 Prepare the kill-shot comparison: a real ChatGPT answer recommending a dead/archived repo, screenshot ready next to our Vault.
- [ ] D-3 Write the 5 lines you'll say about what's cut and why — **framed as scope discipline, which is literally our product's thesis.** Judges reward teams that know what they didn't build.
- [ ] D-4 Browser tabs pre-opened, cache pre-warmed, laptop charged, phone hotspot ready.

---

## Dependency waves at a glance

```
T+0 ─── W0 (all 3, together) ──────────── T+15  🔒 CONTRACT FREEZE
         │
T+15 ────┼── A: search → verify → cluster → routes ────┐  73 min
         ├── B: intake → live view → graph → i18n → hx ┤  68 min   (zero file overlap)
         └── C: reality+arch → report → vault → plan ──┘  79 min
                                                          │
T+85 ────── I: telegram(A) ∥ translate(B) ∥ brief(C) ─────┤
            then integrate · fallback · deploy            │
T+110 ───── D: rehearse ──────────────────────────────────┴─ T+120
```

**Hard rules**
- Lane B and C **never** wait on Lane A. Fixtures exist precisely so all three run at full speed for the full 70 minutes.
- **This plan is at 100% capacity with zero slack.** Every lane is 68–79 minutes of work in a 70-minute window. If anything goes wrong, cut from the bottom of the lane — do not extend the wave.
- **Standup at T+50.** Three minutes, standing. Anyone more than one item behind gets work reassigned immediately, not at T+85.

---

## Risk register (read at T+45, mid-build)

| Risk | Trigger | Response — decide NOW, not in the moment |
|---|---|---|
| LLM JSON parse failures | A-3 / A-5 return malformed JSON | Wrap in try/catch → fall back to the fixture object. **Never let it crash the pipeline.** |
| GitHub rate limit | A-2 during demo | Cached results + `'unverified'` badge. Pre-warm before pitching. |
| Graph library fights you | B-3 past 30 min | **Abandon force-graph, ship a clean static SVG/CSS cluster layout.** A pretty static graph beats a broken interactive one. |
| Lane A not done by T+85 | integration | Ship on fixtures. The demo is identical to a judge. Say nothing. |
| Someone goes quiet in their lane | T+50 check-in | 3-minute standup at T+50. Reassign ruthlessly. |

---

## Commit Journal *(append-only — never edit someone else's line)*

Format: `HH:MM · <hash> · <type> · <summary> · <who>`

- `2026-08-01 · —  · docs · requirements audit — added F1-F7 to close 3 missing required outputs, 2 missing capabilities, and raise Layer-2 coverage 4→7. Lanes rebalanced. · Claude`
- `2026-08-01 · —  · docs · checklist created, scope reduced to 4 features + 5 Layer-2 components · Claude`
