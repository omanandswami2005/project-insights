# BRAINDUMP — iNSIGHTS Track: AI Research & Innovation Copilot

> **Project:** Logic Loop Hackathon — iNSIGHTS Track
> **Purpose:** The single scratchpad. Everything we know, everything we've researched, everything we might build — before it hardens into specs.
> **Last Updated:** 2026-07-29
> **Status:** 🟣 Ideation — nothing here is ratified yet.

**Rule for this file:** it is append-friendly and messy on purpose. Once an idea graduates, it moves into `docs/specs/` and this file links to it instead of restating it.

---

## Table of Contents

1. [Part A — The Mandate (what they asked for)](#part-a--the-mandate)
2. [Part B — Open Questions / Unknowns](#part-b--open-questions--unknowns)
3. [Part C — Landscape Research (what already exists)](#part-c--landscape-research)
4. [Part D — The Differentiation Problem](#part-d--the-differentiation-problem)
5. [Part E — Brainstorm: Feature Candidates](#part-e--brainstorm-feature-candidates)
6. [Part F — Lens Passes (Kautilya / Vishwakarma / Bharata)](#part-f--lens-passes)
7. [Part G — Proposed Product Shape](#part-g--proposed-product-shape)
8. [Part H — Demo Narrative](#part-h--demo-narrative)
9. [Part I — Next Steps](#part-i--next-steps)

---

## Part A — The Mandate

*Source of truth: `iNSIGHTS Track.txt`. This section restates it structurally — if the two ever disagree, the .txt wins.*

### Theme
**Search Less. Solve More. — with iNSIGHTS Layer 2**

### Problem being solved
Students burn hours across Google / YouTube / GitHub / papers / docs / forums. Info is scattered, outdated, duplicated, unreliable. They cannot cheaply answer: *is this idea worth doing, has it been done, and how do I actually build it?*

### Required user capabilities (verbatim intent)

| # | Capability | Notes |
|---|---|---|
| R1 | Discover real-world problems worth solving | ← **upstream of "I have an idea"; most teams will skip this** |
| R2 | DeepSearch across trusted sources → citation-backed research summaries | citations are non-negotiable |
| R3 | Analyze existing solutions, identify research gaps, recommend innovative approaches | the "novelty" engine |
| R4 | Auto-generate a complete project plan via **Project HUB** — milestones, architecture, tech stack, APIs, timelines, documentation | the big deliverable |
| R5 | Recommend datasets, GitHub repos, research papers, learning resources | must be *live*, not remembered |
| R6 | Collaborate via AI Agents (WhatsApp / Telegram) — reminders, progress tracking, assistance | the "it follows you" surface |
| R7 | Present everything through an intuitive dashboard with actionable recommendations | the hero UI |

### Mandatory Layer 2 components — must use **at least 4**

- [ ] 🔍 DeepSearch
- [ ] 🚀 Project HUB
- [ ] 🤖 AI Agents
- [ ] 🌐 Real-time Web Intelligence
- [ ] 📊 Personalized Dashboards
- [ ] 🧠 Knowledge Clustering
- [ ] 📚 Research Workspaces
- [ ] 🌍 Multilingual Support

> **Our stance:** target **6–8**, not 4. Every one we hit is a scoring surface, and several are nearly free once the core exists (Knowledge Clustering falls out of the graph; Research Workspaces falls out of persistence; Multilingual falls out of one i18n layer + one translate call).

### Required output — from one sentence like *"Build an AI solution to reduce food waste in college hostels"*, within minutes

Problem validation · market + literature research · existing-solution comparison · innovation opportunities · project architecture · development roadmap · recommended tech stack · GitHub repos · APIs & datasets · implementation timeline · **presentation-ready documentation**

### Success criteria (their words)
Significantly reduce idea → implementation-ready time, while recommendations stay **accurate, verifiable, scalable, actionable**.

> 🎯 **Read that again: "verifiable" is in the judging criteria.** That is a direct invitation to build a trust/citation/liveness layer — and it is the single easiest place to beat every other team, because everyone else will ship an LLM that confidently hallucinates dead GitHub repos.

---

## Part B — Open Questions / Unknowns

| # | Question | Why it matters | Status |
|---|---|---|---|
| Q1 | **What exactly is "iNSIGHTS Layer 2"?** | Determines whether we're an orchestration client or build everything. | ✅ **RESOLVED (2026-08-01)** — **There is no API from the organizers. We build all of it ourselves.** "Layer 2" is a capability vocabulary, not a platform. The 8 components are *names we must satisfy and demonstrate*, implemented on our own stack. |
| Q2 | ~~Are Layer 2 credentials/quota provided?~~ | — | ✅ Moot — see Q1. Our own API budget is the constraint instead (LLM tokens, search API quota, GitHub rate limits). |
| Q3 | Team size + time budget for the hackathon? | Determines how many of Part E we can actually build. | ❓ |
| Q4 | Judging format — live demo, video, deployed URL, code review? | Determines how much goes into polish vs breadth. | ❓ |
| Q5 | WhatsApp: real Business API (approval takes days) or Telegram-only for demo? | Telegram bot is ~30 min; WhatsApp Cloud API sandbox is a day of pain. | ❓ — **recommend Telegram primary, WhatsApp as stretch** |

> ### 🔑 Consequence of Q1 — this reshapes the whole project
>
> We own the full stack. Every "Layer 2 component" is something we implement and must be able to *point at* during judging. Two direct implications:
>
> 1. **Name the seams after the components.** Our modules should literally be called `deepsearch`, `project-hub`, `agents`, `web-intel`, `dashboards`, `clustering`, `workspaces`, `i18n` — so the judge's checklist maps 1:1 onto our architecture diagram. Free scoring clarity.
> 2. **Every capability needs a real third-party spine.** Rough plan: DeepSearch → Tavily/Brave/Exa + Semantic Scholar/arXiv/Crossref APIs · Web Intelligence + verification → GitHub REST, HuggingFace Datasets, HTTP liveness checks · Clustering → embeddings + graph store · Agents → Telegram Bot API (WhatsApp Cloud API as stretch) · Multilingual → LLM translation + Whisper for voice. **All of these have free tiers** — matters, since we're also pitching a ₹0 free-tier map (E12).
>
> The adapter idea survives in weaker form: keep each capability behind its own service module so a provider swap (Tavily → Exa) is a one-file change. No grand `LayerTwoProvider` abstraction needed — that was insurance against an API that doesn't exist.

---

## Part C — Landscape Research

*What already exists, so we know what "innovative" actually means here.*

### The academic-research tool cluster

| Tool | What it does well | Where it stops |
|---|---|---|
| **Elicit** | Only tool with a true systematic-review screening pipeline; 138M+ papers, threshold filtering | Helps you research; won't draft, won't plan, won't build |
| **SciSpace** | Breadth — 280M+ papers, multi-source, AI writer + reference library | Multi-paper synthesis less structured; still just papers |
| **Consensus** | Fast evidence answers, Q1–Q4 journal quality filter, consensus meter | Answers questions; doesn't scope projects |
| **Undermind** | Deep literature search, **novelty checks** | Research-only; no execution layer |
| **ResearchRabbit / Connected Papers** | Citation-graph exploration, visual discovery | Discovery only |
| **ResearchChecker** | "Has this been done?" novelty check — but **medical only** (PubMed, Cochrane, PROSPERO) | Domain-locked, no engineering equivalent exists |
| **Perplexity Deep Research / NotebookLM** | Great general synthesis with citations | Generic; no project lifecycle, no repo/dataset verification |

**Documented gap in the literature itself:** *"AI-based novelty indicators are yet to be robustly validated"* and ranking/quality-weighting logic in existing tools is **opaque**. Nobody shows their work.

### The gap nobody fills
> There is **no tool that takes a student from "vague idea" → "verified-novel, correctly-scoped, buildable project with live resources and an execution loop."** The research tools stop at the literature. The planning tools (Notion AI, Linear, ChatGPT) start after you already know what to build. **The seam between them is our entire product.**

### Why student projects actually fail (research-backed)
Poor planning, unrealistic timelines, **unmanageably large scope**, poor estimates, scope creep. Hackathon-specific: *"it's easy to get over-ambitious and end up with a tangled mess of incomplete code."* A feasibility study is *"not a pass/fail test, but a refinement process — taking your idea and making it stronger, more focused, more achievable."*

> 🎯 **That last line is a product spec.** Nobody builds a *scope-calibration* engine for students. Everyone builds an idea *generator*. Generators make the failure worse.

### 2026 agentic-AI trends worth riding
- **GraphRAG / knowledge graphs as the anti-hallucination backbone** — *"the difference between a useful agent and a hallucinating one depends on the quality of its knowledge graph"*; graphs make every conclusion **traceable to source**.
- **Verifier agents** — *"autonomy without verification is liability."* Multi-agent setups where a second agent adversarially checks the first.
- **Live web grounding over recalled knowledge**, open protocols (MCP, A2A), vertical task-specific agents, agent memory benchmarks.

---

## Part D — The Differentiation Problem

**The user's instinct is correct: everyone will build the same thing.**

### What ~80% of teams will submit
A chat box → "deep search" → a long generated report → a dashboard with cards → a PDF export. An LLM wrapper with a nice gradient. It will demo fine and be indistinguishable from every other submission by the third pitch.

### The three failure modes of that submission
1. **Unverifiable** — judges cannot tell the citations aren't hallucinated. Recommended repos are dead or invented.
2. **Un-actionable** — a 12-month roadmap for a 4-person student team with 6 weeks. Generic. Ignorable.
3. **Un-memorable** — no moment in the demo where a judge goes *"wait, do that again."*

### Our wedge — one sentence
> **Not another research chatbot. A reality-checked copilot: it tells you what has already been done, what you can actually finish in the time you have, and it verifies every single link before it shows it to you.**

### The three pillars

```
   DISCOVER              VALIDATE                 EXECUTE
  Problem Radar   →   Novelty + Feasibility   →   Adaptive Project HUB
  (upstream, R1)      (the moat, R2/R3)           (the loop, R4/R5/R6)
                            ↑
                    Trust Layer runs through all three
                    (citations · liveness · confidence)
```

### Positioning table — for the pitch slide

| Dimension | Typical submission | Ours |
|---|---|---|
| Citations | Generated, unchecked | Verified live, confidence-scored, retraction/recency flagged |
| GitHub/dataset recs | Model-recalled, often dead | **API-verified** — stars, last commit, license, issue health, link alive |
| Novelty | "Here are similar projects" | **Saturation Index** + white-space map |
| Plan | Generic 12-month roadmap | **Scoped to your team, skills, weeks, and budget** |
| After the plan | Nothing | Adaptive re-planning + Telegram/WhatsApp nudges |
| When it doesn't know | Confidently makes it up | Says so — explicit "unverified" ledger |

---

## Part E — Brainstorm: Feature Candidates

Scored: **Impact** = differentiation + judge-visibility. **Cost** = build effort at hackathon pace.

### 🥇 Tier 1 — Build these. They *are* the product.

**E1. Live Resource Verification ("Nothing we show you is dead")** — *Impact: 10 · Cost: 3*
Every recommended repo/dataset/API is checked in real time before display: GitHub API (stars, last commit date, open-issue ratio, license, archived flag), HTTP liveness on dataset URLs, API status + free-tier check. Show a badge: ✅ verified · ⚠️ stale (last commit 3y) · ❌ dead. **Demo moment:** side-by-side vs a raw ChatGPT answer with a dead repo in it. Cheap to build, devastating in a pitch. Maps to → Real-time Web Intelligence.

**E2. Novelty & Saturation Index** — *Impact: 10 · Cost: 5*
Not "here are similar projects" — a **quantified crowdedness score** per idea, with a visual white-space map. Clusters existing work (papers + repos + products) by approach, shows density, and points at the thin regions. Includes an **Idea Graveyard**: attempts that died and *why* (abandoned repos, negative results, deprecated APIs). Directly serves R3, and the "opaque ranking" gap in existing tools — **we show our scoring math.** Maps to → Knowledge Clustering + DeepSearch.

**E3. Reality Check Engine (Buildability Score)** — *Impact: 10 · Cost: 4*
Input: team size, skills, hours/week, deadline, budget (₹0 is a valid answer). Output: a **Buildability Score**, the parts of the idea that must be cut, and a plan sized to that reality. Auto-generates a **48-hour vertical slice** as milestone zero. This is the research-backed insight (over-scoping is the #1 killer) turned into a feature, and **no competitor has it.** Maps to → Project HUB.

**E4. Evidence Ledger (the trust layer)** — *Impact: 9 · Cost: 3*
Every claim in every generated artifact carries: source link · source type (peer-reviewed / preprint / blog / forum) · publication recency · confidence · and whether it was **corroborated by ≥2 independent sources**. A dedicated "What I could NOT verify" section on every report. Honesty as a headline feature — and "verifiable" is literally in the judging criteria. Maps to → DeepSearch + Real-time Web Intelligence.

**E5. Knowledge Graph Canvas** — *Impact: 9 · Cost: 5*
The interactive hero visual: `Problem → Approaches → Papers → Repos → Datasets → Gaps`, force-directed, clickable, filterable. Doubles as the anti-hallucination backbone (GraphRAG — every generated sentence traces to a node). This is the screenshot that ends up on the winner's slide. Maps to → Knowledge Clustering.

**E6. Adaptive Project HUB** — *Impact: 8 · Cost: 6*
Milestones → **real GitHub issues + a scaffolded repo + README/architecture docs**, not a static table. Then it *watches*: reads commit activity, notices slippage, and **re-plans**. "You're 4 days behind on Milestone 2 — here's the reduced scope that still ships." A plan that responds is a different product from a plan that prints. Maps to → Project HUB + AI Agents.

### 🥈 Tier 2 — High value, build if time allows

**E7. Problem Radar (upstream discovery)** — *Impact: 9 · Cost: 6*
R1 is in the mandate and **most teams will skip it** because it's harder than "type your idea." Mine live pain signals: Reddit/HN complaint threads, GitHub issues tagged `help-wanted`/`good-first-issue` on trending repos, government open-data portals, news, arXiv publication-rate deltas (topics accelerating), past hackathon winners. Rank by *pain × feasibility × freshness*. **This is a whole under-served half of the problem statement.** Maps to → Real-time Web Intelligence + DeepSearch.

**E8. True Multilingual (vernacular-first)** — *Impact: 8 · Cost: 4*
Not a translate toggle. **Research happens in English** (where the papers live); **delivery happens in the student's language** — Hindi, Marathi, Tamil, Telugu, Bengali. Plus **voice notes on Telegram/WhatsApp**: a student sends a voice note in Marathi describing an idea → gets back a full research brief in Marathi. For an Indian hackathon this is both a scoring component and a genuinely moving demo. Maps to → Multilingual Support + AI Agents.

**E9. The Council (multi-agent adversarial review)** — *Impact: 8 · Cost: 5*
Instead of one LLM verdict, a **panel**: Product / Architect / Security / Feasibility / QA lenses each score the idea independently, and **disagreements are surfaced rather than averaged away**. Rides the 2026 "verifier agent" trend. Shows the judges an actual multi-agent system, not a single prompt. *(We already have a persona pack for this — `rishi-sabha`.)* Maps to → AI Agents.

**E10. Pitch Pack generator** — *Impact: 8 · Cost: 3*
"Presentation-ready documentation" is in the mandate. Ship: slide deck + 3-minute demo script + **predicted judge questions with prepared answers** + a one-page architecture diagram. Cheap, extremely student-shaped, and it's the feature that makes users evangelists. *(Meta-bonus: we use it on ourselves.)* Maps to → Project HUB.

**E11. Team Lane Splitter** — *Impact: 7 · Cost: 3*
Takes team members' skills, splits the roadmap into **parallel non-conflicting lanes** with dependency waves and a claim protocol. *(This is exactly the anubandh orchestrator pattern — we already know it works.)* Maps to → Project HUB.

**E12. Cost & Free-Tier Reality Map** — *Impact: 7 · Cost: 2*
Estimated monthly cost of the recommended stack, and the free-tier path for a student with ₹0. "This design costs $180/mo; here's the version that costs nothing." Nobody does this. Very cheap to build. Maps to → Project HUB.

### 🥉 Tier 3 — Nice, park them

- **E13. Research Workspace with time-travel** — versioned idea evolution; see how your idea mutated and why. → *Research Workspaces*
- **E14. Personalized Dashboard that learns** — surfaces new papers/repos in *your* domain as they appear; a weekly digest via the agent. → *Personalized Dashboards*
- **E15. Learning-path generator** — the skills gap between "what you know" and "what this project needs," with ordered resources.
- **E16. Compare-two-ideas mode** — head-to-head scoring when a team is torn between ideas.
- **E17. Cite-back guarantee** — hover any sentence in any generated doc → the exact source passage highlights.
- **E18. Public idea board** — anonymized saturation data across all users: "37 teams are researching food-waste apps this month." Network effect; probably out of scope for a hackathon.

### ❌ Explicitly out of scope (say this out loud in the pitch)
Full paper writing · plagiarism detection · being a general chatbot · replacing the student's judgment · IDE/code generation (Claude Code already exists) · anything requiring institutional database licenses.

---

## Part F — Lens Passes

### Kautilya (Product) — the forcing questions

- **Who is this for?** A 2nd/3rd-year engineering student in India, 6 weeks from a project deadline or 36 hours into a hackathon, with an idea they cannot tell is good. *Not* a PhD researcher — that's Elicit's user, and we lose that fight.
- **What breaks if it doesn't exist?** They build the 400th food-waste app, discover on demo day that it exists, and learn nothing about scoping.
- **What is the 10-star version?** You send a voice note in your own language on Telegram. Ninety seconds later you get: *"Three teams have built this; here's the one gap nobody covered; you have 5 weeks and 2 people, so build these 4 features and not those 9; here are 6 live repos and 2 datasets I verified 30 seconds ago; your first milestone ships Friday; I've opened the GitHub issues."*
- **Scope mode: 🔻 REDUCTION.** Hackathon pace. Tier 1 (E1–E6) is the product. Tier 2 gets built only after Tier 1 demos end-to-end. Breadth of Layer-2 components is a *scoring* concern, not a *quality* concern — hit them via cheap features (E8, E12, E13), not by diluting the core.
- **Kill signal:** if the Novelty Index can't beat "I googled it for 10 minutes," the moat is gone and we're just another wrapper.
- **Success metric:** idea → implementation-ready plan in **< 5 minutes**, with **zero dead links** in the output.

### Vishwakarma (Architecture) — first structural calls

- **We build all 8 capabilities ourselves** (Q1 resolved). Module names mirror the Layer 2 component names so the architecture diagram doubles as the judging checklist. Each capability is one service module with a swappable provider inside it.
- **Everything is a job, nothing is a request.** "Analyze my idea" is a multi-minute fan-out (search → verify → cluster → score → plan). Needs an async job model with **streamed progress**, because a 3-minute spinner loses the demo. Progress *is* UI: show each agent reporting in.
- **Cache aggressively and pre-warm the demo idea.** Live APIs fail on stage. Cache every verification result with a TTL; seed the cache before demoing.
- **The graph is the substrate, not a view.** Entities (problem, approach, paper, repo, dataset, gap) + typed edges. The dashboard, the canvas, the report, and the RAG grounding are all *projections* of the same graph. Build the graph once; get four features.
- **Verification runs in parallel and degrades gracefully** — a GitHub rate-limit must downgrade a badge to "unverified," never break the page.
- **Build order:** graph schema + job runner → DeepSearch + Evidence Ledger → verification workers → clustering/novelty → planner → dashboard → agent surface.

### Bharata (Design/UX) — experience calls

- **The magical moment must land inside 60 seconds.** Never a blank spinner: stream the graph building itself, node by node, as sources are found and verified. The *process* is the spectacle.
- **Slop to avoid:** purple-blue gradient hero, three generic feature cards, a chat box with a sparkle icon, fake dashboard density that means nothing. Every other submission will have all four.
- **Trust must be visible, not claimed.** Badges, source-type chips, confidence bars, a "what I couldn't verify" panel that is *never* empty on real queries. Design the honesty.
- **One hero surface, not five.** The Knowledge Graph Canvas with a collapsible insight rail beats a 12-widget dashboard. Judges remember one strong image.
- **The killer interaction:** hover any generated sentence → its source nodes light up in the graph. That's the "do that again" moment.
- **DX matters too** — the Pitch Pack and the generated repo are our product's "hello world." If the scaffolded repo doesn't run, the whole promise collapses.

---

## Part G — Proposed Product Shape

**Working name candidates:** *Anveshak* (अन्वेषक — the seeker/researcher) · *Prayog* (प्रयोग — experiment) · *Setu* (सेतु — the bridge, idea→execution) · *LoopLab*
> Leaning **Anveshak** — meaningful, Indian, memorable, and nobody else will have it.

### Surfaces (drives the page docs)

| # | Surface | Purpose |
|---|---|---|
| P1 | Landing / Idea Intake | One input. Voice, text, or "I don't have an idea → Problem Radar" |
| P2 | Problem Radar | Ranked live real-world problems (E7) |
| P3 | Analysis Live View | Streaming multi-agent progress — the spectacle (E9) |
| P4 | Knowledge Graph Canvas | The hero surface (E5) |
| P5 | Validation Report | Novelty + saturation + gaps + Evidence Ledger (E2, E4) |
| P6 | Reality Check | Team/time inputs → Buildability Score → scoped plan (E3) |
| P7 | Project HUB | Milestones, architecture, stack, timeline, cost map, GitHub sync (E6, E11, E12) |
| P8 | Resource Vault | Verified repos / datasets / APIs / papers with liveness badges (E1) |
| P9 | Workspace / History | Saved research workspaces, versions (E13) |
| P10 | Agent Console | Telegram/WhatsApp link, nudge settings, digest (E6, E8) |
| P11 | Pitch Pack | Deck + demo script + judge Q&A (E10) |

### Layer 2 coverage (target 7/8)
DeepSearch ✅ · Project HUB ✅ · AI Agents ✅ · Real-time Web Intelligence ✅ · Personalized Dashboards ✅ · Knowledge Clustering ✅ · Research Workspaces ✅ · Multilingual ✅ *(stretch)*

---

## Part H — Demo Narrative

*Write the demo before the code. If a feature isn't in this script, it's Tier 2.*

1. **(0:00)** A student sends a **Marathi voice note** on Telegram: *"मला हॉस्टेलमधलं अन्न वाया जाणं कमी करायचंय"* → appears in the web app as a parsed idea. **(Hooks: multilingual + agents, in 15 seconds.)**
2. **(0:20)** Analysis starts. The graph **builds itself live** — sources found, verified, clustered. Agents report in one by one.
3. **(1:10)** **Saturation Index: 78/100 — crowded.** The white-space map highlights the one gap: nobody has done *pre-consumption* forecasting for Indian hostel mess menus; everyone did post-consumption logging.
4. **(1:40)** **The kill shot.** Split screen: a raw ChatGPT answer recommending a repo that's been archived since 2021, next to our Resource Vault — every entry with a live-verified badge, checked seconds ago. *Click one to prove it.*
5. **(2:10)** Reality Check: *"2 people, 5 weeks, ₹0."* → Buildability Score, four features kept, nine cut, a 48-hour vertical slice as Milestone 0, and the free-tier stack.
6. **(2:40)** One click → GitHub repo scaffolded, issues opened, docs written.
7. **(3:00)** Telegram pings: *"Milestone 0 due Friday. You haven't pushed in 2 days — want me to reduce scope?"* **Close on that.**

---

## Part I — Next Steps

- [x] ~~Resolve Q1~~ — ✅ no organizer API; we build everything.
- [ ] Confirm Q3/Q4 (team, time, judging format) → sets how much of Tier 2 we attempt.
- [ ] Lock the tech stack + pick the concrete provider for each of the 8 capabilities.
- [ ] Lock the name.
- [ ] Generate the lightweight anubandh docs set (see below) — architecture, feature specs for E1–E6, page docs for P1–P11, checklist.
- [ ] Hand P1–P11 page docs to Claude Design for the UI pass.
- [ ] Build order per Vishwakarma: graph + jobs → search + ledger → verification → novelty → planner → dashboard → agent.

### Doc depth decision (hackathon pace)
**Keeping:** `DEVELOPMENT-CHECKLIST.md` · `CLAUDE.md` · `docs/architecture/00-project-overview.md` + `01-system-architecture.md` · `docs/specs/` (one per Tier-1 feature) · `docs/ux/` (one per page — the context Claude Design needs) · a short ADR log.
**Dropping:** compliance, legal, DPIA, marketing, business-model, i18n doc, operations, release, testing suite, partner integration. *(Not a long-term product — no regulatory surface, no ops burden.)*

---

## Journal

- `2026-08-01` — **Q1 resolved: no organizer API exists — we build all 8 Layer 2 capabilities ourselves.** Dropped the `LayerTwoProvider` abstraction; replaced with per-capability service modules named after the components. Added the third-party provider shortlist (all free-tier). Git initialized on `main`, remote → `github.com/omanandswami2005/project-insights`.
- `2026-07-29` — Braindump created. Mandate captured from `iNSIGHTS Track.txt`; landscape research done (research-tool cluster, project-failure causes, 2026 agentic trends); 18 feature candidates generated and tiered; wedge identified as **verifiability + scope-calibration**; three-pillar shape and demo narrative drafted. Open blocker: what iNSIGHTS Layer 2 actually is (Q1).
