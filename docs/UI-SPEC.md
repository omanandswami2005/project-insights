# UI SPEC — project-insights

> **Project:** project-insights (iNSIGHTS Track hackathon)
> **Purpose:** The complete design brief. **This is the file you hand to Claude Design.**
> **Last Updated:** 2026-08-01
> **Constraint:** 3 routes, built in ~70 minutes by 2 devs. Depth over breadth — one surface must be genuinely beautiful, the rest merely clean.

**Hand Claude Design this file + `lib/types.js`. Nothing else.** ([BRAINDUMP.md](../BRAINDUMP.md) is strategy and will make it design features we're not building; [DEVELOPMENT-CHECKLIST.md](../DEVELOPMENT-CHECKLIST.md) is task allocation.)

---

## 1. What this product is

An AI copilot that takes a student's one-line project idea and, in under 5 minutes, tells them: **what's already been built, whether their idea is actually novel, and what they can realistically finish in the weeks they have** — with every single recommended repo, dataset, and paper **verified live** rather than recalled from a model's memory.

**The one-sentence positioning that drives every design decision:**
> Not another research chatbot. A *reality-checked* copilot — it verifies every link before it shows it to you.

**The user:** a 2nd/3rd-year engineering student in India, 6 weeks from a deadline, with an idea they can't tell is good. Fast, mobile-aware, no patience for enterprise chrome.

---

## 2. Design direction: **instrument, not marketing site**

This app's entire value is *measurement and verification*. It should feel like a **precision instrument reading out a result** — closer to a lab dashboard or a well-made terminal than to a SaaS landing page.

### The signature move
**Every piece of machine-produced data renders in monospace.** Scores, counts, URLs, timestamps, stars, confidence values, commit dates. Prose renders in the sans face. That single split — *measured things are mono, human things are sans* — is the visual identity. It costs nothing and reads as rigor.

### Palette
| Role | Value | Use |
|---|---|---|
| Canvas | `#0A0A0B` near-black | page background |
| Surface | `#141416` | cards, panels |
| Border | `#232327` | hairlines, 1px, everywhere |
| Text primary | `#EDEDEF` | headings, body |
| Text muted | `#8A8A93` | labels, metadata |
| **Verified** | `#7BE04A` acid lime | the hero signal — a check passing |
| **Stale** | `#E0A93A` amber | last-commit-3-years-ago |
| **Dead** | `#E5484D` red | archived, 404 |
| Accent | `#EDEDEF` on `#232327` | buttons — deliberately neutral so the status colours own all the attention |

**Dark is the default and primary.** Light mode only if it's free.

> **Why no brand colour?** The verify/stale/dead traffic-light *is* the brand. Introducing a purple or blue accent would compete with the only colours that carry meaning.

### Type
- **Sans:** Geist or Inter. Tight tracking on headings (`-0.02em`), generous line-height on body (1.6).
- **Mono:** Geist Mono or JetBrains Mono. All data. Slightly smaller optical size than the sans beside it.
- **Scale:** big numbers are BIG — the saturation score and buildability score should be 56–72px mono. They are the product's verdicts; let them land.

### Texture
1px hairline borders, not shadows. Generous negative space. Subtle grain or a faint dot-grid on the canvas is welcome. Radii: 8px cards, 6px controls, full-round only on badges.

---

## 3. 🚫 Anti-slop rules (non-negotiable)

Every competing team will ship these. If any appear, the design has failed:

- ❌ Purple→blue gradient hero
- ❌ A chatbox with a ✨ sparkle icon
- ❌ Three generic feature cards with outline icons under the fold
- ❌ Fake dashboard density — widgets that display nothing real
- ❌ Glassmorphism / frosted cards
- ❌ "Powered by AI" badges, robot mascots, neural-network background graphics
- ❌ Stock illustrations of people pointing at charts
- ❌ Centred marketing copy with a "Get Started" and "Learn More" button pair

**Also banned:** a bare loading spinner anywhere in the product. See §5.

---

## 4. Route 1 — Intake `/`

**Job:** get one sentence out of the user in under 10 seconds. This is *not* a landing page. There is no fold, no features section, no footer.

**Layout:** vertically centred, single column, max-width ~680px.

```
        project-insights                          [ mono, small, top-left, muted ]

        What do you want to build?                [ sans, 40px, tight ]

        ┌────────────────────────────────────────────────┐
        │  Build an AI solution to reduce food waste …   │  ← single-line growing textarea
        │                                          [ → ] │     autofocus, Enter submits
        └────────────────────────────────────────────────┘

        Try:  ⟨ hostel food waste ⟩  ⟨ campus lost-and-found ⟩       [ mono chips ]
              ⟨ crop disease detection ⟩

        ── verified against live sources · nothing recalled from memory ──
                                                     [ mono, 12px, muted, centred ]
```

**Details**
- Input has a 1px border that lifts to `#3A3A40` on focus. No glow, no gradient ring.
- Example chips fill the input on click (don't auto-submit — let them see it land).
- The bottom line is the entire pitch. Keep it small and confident; do not make it a badge.
- **Empty state is the whole page.** Nothing below the fold. Resist adding anything.

---

## 5. Route 2 — Live Analysis `/analyze/[id]` *(status ≠ done)*

**This is the most important screen for the demo and the one most likely to be under-designed.** The analysis takes 40–90 seconds. A spinner there loses the room.

**Concept: the process is the spectacle.** Show the machine working — agents reporting in, sources arriving, the graph assembling itself node by node.

```
┌──────────────────────────────────────────────────────────────────────┐
│  "Build an AI solution to reduce food waste in college hostels"      │
│  ────────────────────────────────────────────────────────────────    │
│                                                                      │
│   ✓ deepsearch      searched 6 sources          mono   1.8s          │
│   ✓ papers          14 found · 9 peer-reviewed          3.1s         │
│   ⠋ verifying       checking github/agri-waste-ml…      ← live       │
│   ·  clustering                                          queued      │
│   ·  planning                                            queued      │
│                                                                      │
│              ╭─────────────────────────────────────╮                │
│              │                                     │                │
│              │      [ graph assembling live ]      │  nodes fade in  │
│              │                                     │  as found       │
│              ╰─────────────────────────────────────╯                │
│                                                                      │
│   just verified ──────────────────────────────────────────────       │
│   ✅ huggingface/food-101          verified   2.1k ★  ·  4d ago      │
│   ⚠️ gh/hostel-mess-tracker        stale      last commit 2021-03    │
│   ❌ gh/foodwaste-predictor        dead       archived                │
└──────────────────────────────────────────────────────────────────────┘
```

**Details**
- Progress rows come from `Analysis.progress[]`. Each row: state glyph, mono step name, sans description, mono elapsed time. Completed rows dim slightly; the active row is full-brightness with a small animated indicator.
- **The "just verified" feed is the star.** Items slide in one at a time as verification completes, each with its status colour. This is where a judge realises we're actually checking things — make it legible and unhurried (stagger ~250ms).
- The graph builds progressively in the centre. Nodes fade + settle; edges draw after.
- On `status === 'error'`: show what failed and what we still have. Never a blank error page.

---

## 6. Route 2 — Results `/analyze/[id]` *(status === 'done')*

Same route, transitions in place. **Two-pane: graph left (60%), insight rail right (40%).** Below ~1024px the graph collapses to a fixed-height panel and the rail stacks under it.

### 6.1 Knowledge Graph Canvas — the hero *(left pane, full height, sticky)*

The screenshot that ends up on the winning slide. Force-directed, dark canvas.

- **Node colour by `kind`:** problem (white, largest) · approach (muted blue-grey) · paper (soft cyan) · repo (lime if verified, amber if stale, red if dead) · dataset (violet-grey) · **gap (hollow ring, lime stroke, no fill — the white space, visually distinct from everything else)**
- **Node size** by `evidenceIds.length`.
- **Labels** in mono, 11px, shown on hover and for large nodes always.
- **Click a node** → the right rail switches to that node's evidence list. Node gets a ring; connected edges brighten; unconnected nodes drop to ~15% opacity.
- Edges: 1px, `#232327`, brightening on relation hover. Relation label in mono on hover only.
- Gentle idle drift. No autoplay zoom, no camera animation.

> **Fallback if the force-graph library fights you:** ship a static clustered layout — concentric rings, problem at centre, clusters as arcs. A beautiful static graph beats a janky interactive one. Design should specify both.

### 6.2 Insight rail *(right pane, scrolls)*

Sections stack in this order — **this order is the argument the product is making, don't rearrange it:**

**A. Verdict card** — the summary sentence, large sans, plus the saturation score.

```
┌──────────────────────────────────────────┐
│  SATURATION                     mono/12  │
│                                          │
│   78            crowded                  │  ← 64px mono, amber at 60-85
│  ────────────                            │     lime under 40, red over 85
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░               │
│                                          │
│  23 similar projects across 4 approach   │
│  clusters. Post-consumption logging is   │
│  saturated; forecasting is not.          │
└──────────────────────────────────────────┘
```

**B. Approach clusters** — horizontal bars sized by `Cluster.size`, name in sans, count in mono. Click → filters the graph.

**C. 🎯 White space** — *give this real visual weight; it's the product's payoff.* Each gap in a bordered card with a lime hairline and hollow-ring glyph matching the graph's gap nodes. This is what the student came for.

**D. Evidence Ledger** — the trust layer. Each row:
```
  ✅  Reducing food waste in institutional dining        [sans]
      paper · peer-reviewed · 2024 · corroborated ×3     [mono, muted]
      ▓▓▓▓▓▓▓▓░░  confidence 0.82                        [mono]
```
Source-type as a small mono chip. Confidence as a thin bar, not a percentage badge.

**E. ⚠️ "What I could not verify"** — a distinct, slightly recessed panel. **Never hide it, never collapse it by default, never let it be empty on a real query.** Design it to look like an honest disclosure, not a warning — muted border, no red. This panel is a *feature*; treat it with the same care as the hero.

### 6.3 Resource Vault *(below the two panes, full width)*

**Design this section to be screenshot-able side-by-side against a raw ChatGPT answer.** In the demo we show a competitor recommending an archived repo next to this. It must read as obviously more trustworthy at a glance, from across a room.

Table or card grid — cards work better on a projector:

```
┌────────────────────────────────────┐   ┌────────────────────────────────────┐
│ ✅ VERIFIED            checked 4s   │   │ ⚠️ STALE               checked 4s   │
│                                    │   │                                    │
│ huggingface/food-101               │   │ gh/hostel-mess-tracker             │
│ Image dataset · 101 classes        │   │ Django mess-management system      │
│                                    │   │                                    │
│ ★ 2,140   MIT   pushed 4d ago      │   │ ★ 31   no license   2021-03        │
└────────────────────────────────────┘   └────────────────────────────────────┘
        left border 2px lime                     left border 2px amber
```

- Status word in mono uppercase, coloured. 2px left border in the status colour — the single strongest at-a-glance signal.
- `checked Ns ago` in mono, muted, top-right. **This tiny detail is the whole pitch — make sure it's present and legible.**
- Filter chips: `all · repos · datasets · papers · APIs` and a `verified only` toggle.
- Dead entries: keep them visible at ~55% opacity with strikethrough on the name. **We show what we rejected — that's the point.**

---

## 7. Route 3 — Reality Check `/analyze/[id]/plan`

**The second-most-differentiated screen.** Nobody else will have this. Two states on one route.

### State 1 — the form (compact, ~4 fields, one screen, no scroll)
`team size` (stepper 1–6) · `weeks available` (slider 1–16) · `skills` (multi-select chips: React, Python, ML, Mobile, Backend, Design…) · `budget` (segmented: `₹0` / `₹0–2k` / `₹2k+`, with **₹0 preselected**)

Submit: **"Check what I can actually build"** — plain, direct, no exclamation.

### State 2 — the verdict

```
   BUILDABILITY                           mono/12, muted

    64  / 100          feasible, if you cut          ← 64px mono
   ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░

   ┌─── KEEPING 4 ──────────┐  ┌─── CUTTING 9 ─────────────┐
   │ ✓ Mess menu ingestion  │  │ ✗ Mobile app        strike │
   │ ✓ Waste forecast model │  │ ✗ Multi-hostel      strike │
   │ ✓ Daily prediction UI  │  │ ✗ Payment integration      │
   │ ✓ Feedback loop        │  │ ✗ Real-time IoT sensors    │
   └────────────────────────┘  └────────────────────────────┘
        lime hairline                muted, strikethrough
```

- **Show the cut list with pride, not apology.** Equal visual weight to the keep list. Cutting is the product's thesis — the design must not treat it as negative space or an afterthought.
- **Milestones:** horizontal timeline. **Milestone 0 is always a 48-hour vertical slice and is visually emphasised** (lime marker, larger) — it's the "you could start tonight" moment.
- **Stack table:** `layer · choice · why · free-tier ✓`. Free-tier column in lime. A `₹0/month` total at the bottom in large mono if everything is free-tier — that number is worth designing around.

---

## 8. Cross-cutting

**States** — every data surface needs: loading (skeleton with the right shape, never a spinner), empty (say what would appear and why it hasn't), error (what failed + what survived), partial (`unverified` badges when a check couldn't complete). **Partial is the normal case — design it first, not last.**

**Motion** — fast and functional. 150ms for state changes, 250ms stagger for arriving items, 400ms for the graph settling. No page-transition animations, no parallax, no scroll-triggered reveals.

**Responsive** — desktop-first (it's a projector demo), but must not break on a phone: the two panes stack, the graph gets a fixed 320px panel, the vault becomes one column. Tables scroll inside their own container; the page body never scrolls sideways.

**Accessibility** — status must never be colour-only: every badge carries its word (`VERIFIED` / `STALE` / `DEAD`) and glyph. Contrast ≥ 4.5:1 on all text including muted (`#8A8A93` on `#0A0A0B` passes). Focus rings visible on the dark canvas.

**Agent hooks** — put `data-agent-id` on every interactive element (`intake.submit`, `graph.node`, `vault.filter`, `plan.submit`). Costs nothing now, and it's what makes the surface driveable later.

---

## 9. Priority if time runs out

Build in this order. Cut from the bottom.

1. **Resource Vault cards** — the kill shot, and the cheapest big win
2. **Graph Canvas** — the hero screenshot
3. **Live Analysis view** — sells that real work is happening
4. **Saturation + white space** — the moat, stated
5. **Reality Check verdict** — the unique second act
6. **Intake** — needs to be clean, not remarkable
7. Evidence Ledger detail polish
8. Light mode, exports, print styles — **do not build these**
