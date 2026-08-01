# REQUIREMENTS COVERAGE AUDIT

> **Project:** project-insights (iNSIGHTS Track)
> **Purpose:** Line-by-line audit of the planned build against `iNSIGHTS Track.txt`. Answers one question: **would this submission be judged complete?**
> **Last Updated:** 2026-08-01
> **Verdict:** ⚠️ **Not yet aligned.** 3 required outputs missing, 2 required capabilities missing, and the mandatory-component count sits at exactly 4 with one contested.

---

## 🚨 Headline finding

> The brief says: *"Your solution **must** utilize at least **four** of the following Layer 2 capabilities."*
>
> Our defensible count is **exactly 4** — DeepSearch, Real-time Web Intelligence, Knowledge Clustering, Project HUB. The 5th we were claiming (📊 Personalized Dashboards) is **contestable**: we have no users, no persistence, and no personalization. It's a results page, not a personalized dashboard.
>
> **If a judge strikes one claim, we fail a hard requirement — and no amount of UI polish recovers from that.** We're running with zero margin on the only pass/fail rule in the document.

This audit fixes that, and closes the missing outputs, for **~65 minutes of added work** — most of it prompt changes and render tasks, not new systems.

---

## 1. Required capabilities (the 7 bullets, lines 32–38)

| # | Requirement (verbatim intent) | Status | Where |
|---|---|---|---|
| R1 | **Discover real-world problems worth solving** | ❌ **MISSING** — cut as E7 (Problem Radar) | — |
| R2 | DeepSearch across trusted sources → citation-backed summaries | ✅ Covered | A-1, C-2 |
| R3 | Analyze existing solutions, identify gaps, recommend innovative approaches | ⚠️ **PARTIAL** — gaps ✅, innovative approaches ✅, but **no existing-solution comparison** | A-3, C-1 |
| R4 | Complete project plan via Project HUB: milestones, **architecture**, tech stack, APIs, timelines, **documentation** | ⚠️ **PARTIAL** — milestones ✅ stack ✅ timeline ✅, **architecture ❌, documentation ❌** | A-5, C-4 |
| R5 | Recommend datasets, GitHub repos, research papers, **learning resources** | ⚠️ **PARTIAL** — learning resources missing | A-1, C-3 |
| R6 | **Collaborate through AI Agents (WhatsApp/Telegram)** — reminders, progress, assistance | ❌ **MISSING** — cut | — |
| R7 | Intuitive dashboard with actionable recommendations | ✅ Covered | B-2/B-3, C-1..C-4 |

**Score: 3 clean / 3 partial / 2 missing.**

> ⚠️ **R1 deserves special attention.** It is the *first* listed capability, and the Background section frames the entire challenge as moving students *"from **problem discovery** to project execution."* Problem discovery isn't a side feature — it's half the stated arc. We cut it entirely.

---

## 2. Required outputs (the 11 bullets, lines 75–85)

The brief is explicit: from one sentence, *"within minutes, the platform should generate"* — this reads as a checklist a judge will literally tick.

| # | Required output | Status | Where |
|---|---|---|---|
| 1 | Problem validation | ✅ | Saturation score + verdict (C-1) |
| 2 | Market and literature research | ✅ | DeepSearch + Evidence Ledger (A-1, C-2) |
| 3 | **Existing solution comparison** | ❌ **MISSING** | Clusters are a *grouping*, not a *comparison*. No side-by-side. |
| 4 | Innovation opportunities | ✅ | White-space gaps (C-1) |
| 5 | **Project architecture** | ❌ **MISSING** | RealityCheck has stack + milestones. No architecture anywhere. |
| 6 | Development roadmap | ✅ | Milestones (C-4) |
| 7 | Recommended tech stack | ✅ | Stack table (C-4) |
| 8 | GitHub repositories | ✅ | Resource Vault (C-3) |
| 9 | APIs and datasets | ✅ | Resource Vault (C-3) |
| 10 | Implementation timeline | ✅ | Milestone timeline (C-4) |
| 11 | **Presentation-ready documentation** | ❌ **MISSING** | Cut as E10 (Pitch Pack) |

**Score: 8 / 11.** Three visible holes on a list judges will tick item by item.

---

## 3. Mandatory Layer 2 components — the pass/fail rule

| Component | Claim | Honest assessment |
|---|---|---|
| 🔍 **DeepSearch** | ✅ **Solid** | Multi-source search (Tavily + Semantic Scholar), citation-backed. Textbook fit. |
| 🌐 **Real-time Web Intelligence** | ✅ **Strongest claim we have** | Live GitHub API + HTTP liveness checks at request time. Nobody can dispute this. |
| 🧠 **Knowledge Clustering** | ✅ **Solid** | Approach clusters + the knowledge graph. Visually self-evident. |
| 🚀 **Project HUB** | ✅ **Solid** *(once architecture + docs land)* | Currently missing 2 of the 6 things the brief names under Project HUB. |
| 📊 Personalized Dashboards | ⚠️ **Contestable** | No auth, no persistence, no personalization. It's a results view. **Do not count on this.** |
| 🤖 AI Agents | ❌ Not built | — |
| 📚 Research Workspaces | ❌ Not built | — |
| 🌍 Multilingual Support | ❌ Not built | — |

**Defensible: 4/8. Required: 4/8. Margin: zero.**

---

## 4. Success criteria (line 94)

> *"accurate, verifiable, scalable, and actionable"*

| Criterion | Our position |
|---|---|
| **Accurate** | ✅ Strong — corroboration across ≥2 sources, confidence scoring |
| **Verifiable** | ✅ **Our single strongest card** — live verification + Evidence Ledger + the "what I could not verify" panel. This is the differentiator and it's already central. |
| **Actionable** | ✅ Strong — Reality Check + scoped milestones + 48-hour vertical slice |
| **Scalable** | ⚠️ Weak — no persistence, in-memory only. **Address in the pitch narrative, not in code.** One slide on the architecture path (job queue → graph store → cache layer) covers this. Don't spend build minutes here. |

---

## 5. The fix — ranked by requirement-coverage per minute

Every item below closes a *stated requirement*. Ordered by value density; cut from the bottom.

| # | Add | Closes | Cost | Notes |
|---|---|---|---|---|
| **F1** | **Telegram bot** — `/analyze <idea>` → summary + link back; a reminder command | **R6** + 🤖 **AI Agents** | ~20 min | **Highest value per minute in the entire plan.** Takes the component count off the minimum. Standalone file, zero merge conflicts. |
| **F2** | **Existing-solution comparison table** — solution · approach · strengths · weaknesses · what it misses | **Output #3**, strengthens **R3** | ~10 min | Mostly free: prompt addition to A-3 + one render component. Data already exists. |
| **F3** | **Architecture output** — LLM emits a Mermaid diagram + component list; render it | **Output #5**, completes **R4** | ~15 min | Prompt addition to A-5 + a Mermaid render. Also visually impressive. |
| **F4** | **Multilingual toggle** — Hindi/Marathi/English on the report | 🌍 **Multilingual** | ~12 min | One translate route + a toggle. Cheap component, strong India-hackathon appeal. |
| **F5** | **Export brief** — generated markdown/print view: problem, research, comparison, architecture, roadmap, stack, resources | **Output #11**, completes **R4** | ~15 min | Print stylesheet over existing components. Literally "presentation-ready documentation". |
| **F6** | **Learning resources** in the Vault | Completes **R5** | ~3 min | One category added to the A-1 search prompt + a vault filter chip. |
| **F7** | **Workspace history** — localStorage list of past analyses | 📚 **Research Workspaces** + repairs the 📊 Dashboards claim | ~8 min | Makes "personalized" defensible: it remembers *your* analyses. Two claims for 8 minutes. |
| **F8** | **Problem Radar (lite)** — intake shows *"No idea yet?"* → 6 ranked real-world problems | **R1** | ~20 min | Fixture-backed with one live search refresh. **Cheapest honest version of the first-listed requirement.** |

### After the fix

| Metric | Before | After |
|---|---|---|
| Required capabilities clean | 3/7 | **7/7** |
| Required outputs | 8/11 | **11/11** |
| Layer 2 components (defensible) | **4** — zero margin | **7** — comfortable margin |

**Total added cost ≈ 103 min across 3 people ≈ 34 min each.** Affordable, because most items are prompt additions and render tasks over data we already produce.

---

## 6. What this costs us

To fund the above, these get trimmed:

- **B-5** (hover-sentence → graph highlight) — was already stretch. **Cut.**
- **Evidence Ledger polish** — ship functional, not beautiful. **Reduced.**
- **Graph Canvas** — hard-stop at 30 min, fall back to the static clustered layout per [UI-SPEC §6.1](UI-SPEC.md). **Time-boxed.**
- **Reality Check form** — 4 fields, no validation niceties. **Reduced.**

> **The trade is correct.** Reality Check and the Vault are our *differentiation*; the items above are *requirements*. A submission that's brilliantly differentiated but fails "must use at least four components" loses to a boring one that passes. **Requirements first, moat second, polish third.**

---

## 7. ⏰ Contract change — do this at T+15, not later

`lib/types.js` freezes at T+15. These fields must be in it **from the start**, or F2/F3/F6 force a contract break mid-build:

```js
/**                                     F2 — required output #3
 * @typedef {Object} Comparison
 * @property {string} name
 * @property {string} approach
 * @property {string[]} strengths
 * @property {string[]} weaknesses
 * @property {string} missing           what it fails to address ← the gap link
 * @property {string} [url]
 */

/**                                     F3 — required output #5
 * @typedef {Object} Architecture
 * @property {string} mermaid           flowchart source, rendered client-side
 * @property {{name: string, role: string, tech: string}[]} components
 * @property {string} dataFlow
 */

// Evidence.sourceType gains 'learning'          ← F6
// Analysis gains:  comparisons: Comparison[]
//                  architecture (optional)
//                  language: 'en' | 'hi' | 'mr' ← F4
```

✅ **Already applied** — see the full contract in [DEVELOPMENT-CHECKLIST.md](../DEVELOPMENT-CHECKLIST.md#the-contract-freeze-at-t15) and the shipped `lib/types.js`.

---

## 8. Revised priority order

1. **Requirement coverage** — F1–F6. Non-negotiable; this is the pass/fail surface.
2. **Differentiation** — live verification, saturation index, Reality Check. This is how we win rather than merely qualify.
3. **Polish** — graph beauty, motion, Evidence Ledger detail.
4. **Stretch** — F7, F8, anything in [BRAINDUMP Tier 3](../BRAINDUMP.md#-tier-3--nice-park-them).

> **The one-line rule for the next 2 hours:** *if it isn't in `iNSIGHTS Track.txt`, it doesn't get built until everything that is has shipped.*
