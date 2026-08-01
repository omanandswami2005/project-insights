# Handoff: project-insights — Full Prototype (Landing, Live Analysis, Results, Reality Check)

## Overview
A single interactive HTML prototype covering all 4 routes of project-insights per `docs/UI-SPEC.md`: the Landing intake page, the Live Analysis (simulated) screen, the Results screen (knowledge graph + insight rail + resource vault), and the Reality Check plan (form + verdict). It runs entirely off the repo's own `lib/fixtures.js` demo data (mirrored locally as `data.js`).

## About the Design Files
The bundled file (`Project Insights.dc.html`) is a **design reference** — an HTML/React prototype built to show intended look, layout, and interaction, not production code to copy directly. The task is to **recreate this design in the actual Next.js app** (`app/` directory, App Router, Tailwind) using the codebase's existing patterns — real routes (`/`, `/analyze/[id]`, `/analyze/[id]/plan`), real data fetching in place of the simulated timers, and the project's own component conventions.

## Fidelity
**High-fidelity.** Colors, type, radii and the verify/stale/dead status system are pulled directly from the repo's own `app/globals.css` tokens — not invented. Copy/microcopy follows `docs/UI-SPEC.md` closely. Layout and spacing are close but not pixel-audited against a Figma file (none exists) — treat spacing values below as strong guidance, not gospel.

**No separate design system was created for this.** The prototype consumes your repo's existing tokens as-is (see Design Tokens below) — there is nothing else to import.

## Screens / Views

### 1. Landing (`/`)
- **Purpose:** capture one idea sentence; convince a judge this isn't another LLM wrapper before they type.
- **Layout:** single column, max-width ~900px hero, then full-width sections stacked with generous vertical padding (54px) and hairline rules between them, max-width ~1040px for body sections.
- **Components:**
  - Top bar: logo left (`project-insights`, mono 13px), "how it works" + "↗ git" links + dark/light toggle right. Sticky.
  - Hero: headline "Stop building / what already `exists ✓`" — the highlighted word is a **stamp**: mono font, 1px solid border in the verified color, tick inside, "checked N.Ns ago" caption below in 10px mono.
  - Subhead, 18px, muted, max 46ch.
  - Idea input: single-row textarea that grows, arrow submit button (neutral background, never colored), hint copy below in 12px mono muted.
  - Example chips (3): mono, pill, click fills the input (no auto-submit).
  - Live ticker: cycles through `DEMO_EVIDENCE` every 1.4s — "NOW CHECKING", title, status badge, star count.
  - Kill-shot section: two side-by-side panels (typical AI answer, dimmed 65% opacity vs. project-insights, full contrast with 2px lime left border).
  - "What you get": 2-column checklist of the 11 outputs, lime ticks.
  - "How it works": 3 numbered steps (01/02/03), 32px mono numerals, hairline rule between each.
  - Honesty panel: bordered box, quotes first entry of `DEMO_ANALYSIS.unverified`.
  - Capabilities: 4×2 grid from a capabilities list, done items ticked, one item dimmed/incomplete.
  - Footer: one mono line + repo link.

### 2. Live Analysis
- **Purpose:** show the pipeline actually working during the 40–90s analysis (simulated here in ~a few seconds).
- **Layout:** single column, idea recap quoted at top, then a progress list, a "graph assembling" box, then the "just verified" feed.
- **Components:**
  - Progress rows (5, from `DEMO_ANALYSIS.progress`): glyph (✓ / ⠋ spinner char / ·), mono step name, sans description, mono elapsed time. Active row full brightness; done rows dim to ~55% opacity.
  - Graph-assembling box: dashed border, shows "N / total nodes", node label chips fade in as they "arrive".
  - "Just verified" feed: evidence items slide in one at a time (staggered), each with glyph + status color + title + star count.
  - Auto-transitions to Results when the simulated timer completes.

### 3. Results
- **Purpose:** the payoff screen — graph + trust layer + vault.
- **Layout:** two-pane grid, 60% graph / 40% insight rail, both full height; a full-width Resource Vault section below.
- **Components:**
  - **Graph pane:** SVG force-directed layout (custom simple physics, computed once on entry — no external library), `viewBox="0 0 760 480"`. Nodes are draggable (mousedown+mousemove+mouseup), colored by `kind` (problem = ink white, approach = muted, paper/dataset = warm neutral variants, repo = verified/stale/dead by its own `verify` field, gap = hollow ring stroked in the verified/lime color, no fill). Node radius scales with `evidenceIds.length`. Click a node to select it: connected edges/nodes stay full opacity, everything else drops to ~15%; the insight rail's evidence ledger filters to that node's evidence.
  - **Insight rail** (scrollable), sections in this fixed order:
    1. Verdict card — saturation score (56–64px mono, color-coded lime/amber/red by threshold), progress bar, one-line verdict text.
    2. Approach clusters — horizontal bars sized by cluster.size, click to filter (stubbed).
    3. White space — bordered cards, lime left border + hollow-ring glyph, one per gap string.
    4. Evidence ledger — rows with glyph, title, meta line (source type · date · corroborated), thin confidence bar.
    5. "What I could not verify" — recessed panel, muted border, **no red**, lists `DEMO_ANALYSIS.unverified`.
  - "Check what I can actually build →" button at the bottom of the rail, navigates to the Reality Check form.
  - **Resource Vault:** filter chips (all/repo/dataset/paper/api) + a "verified only" toggle; responsive card grid. Each card: status word + glyph (colored, top-left), "checked Ns ago" (top-right, mono muted), title, subtitle/note, meta line (stars/license/date). Dead entries: ~70% opacity + strikethrough title. 2px left border in the status color is the primary at-a-glance signal.

### 4. Reality Check — Plan
- **State 1 (form):** team size stepper (1–6), weeks-available slider (1–16), skills multi-select chips (React/Python/ML/Mobile/Backend/Design), budget segmented control (₹0 / ₹0–2k / ₹2k+, ₹0 preselected). Submit: "Check what I can actually build".
- **State 2 (verdict):** buildability score (64px mono, color-coded), progress bar, verdict text. Two equal-weight columns: "Keeping N" (lime ticks) and "Cutting N" (muted, strikethrough) — cutting is shown with pride, not apology. Milestone timeline: 4 stops, milestone 0 visually emphasised (larger lime marker) as the 48-hour vertical slice. Stack table: layer / choice / why / free-tier (lime check or —). `₹0/month` total in large lime mono at the bottom.

## Interactions & Behavior
- Landing → Enter (or button) submits the idea → Live Analysis.
- Live Analysis auto-advances a compressed timer through the 5 pipeline steps and the evidence feed, then auto-navigates to Results.
- Results: click a graph node to filter the evidence ledger and highlight connections; drag nodes to reposition; vault filter chips + verified-only toggle are client-side filters over the same evidence array.
- "Check what I can actually build" → Reality Check form → submit → verdict.
- Dark/light toggle in the top bar affects the whole app instantly (no page reload); dark is the default, matching `docs/UI-SPEC.md` §2 ("dark is default and primary").
- Motion: fades/slides on arriving list items (~250–400ms), no page-transition animations, respects the spec's "fast and functional" motion guidance.

## State Management
- Current screen (`landing` / `live` / `results` / `plan-form` / `plan-result`).
- `idea` (submitted text), `dark` (theme toggle).
- Live-analysis: elapsed-time counter driving progress-row state and evidence-feed reveal count.
- Results: computed graph node positions (`{id,x,y}`), `selectedNodeId`, vault filter + verified-only toggle.
- Plan: team size, weeks, selected skills, budget choice.
- All screens read from the same in-memory copy of `lib/fixtures.js` (`DEMO_EVIDENCE`, `DEMO_GRAPH`, `DEMO_NOVELTY`, `DEMO_REALITY`, `DEMO_ANALYSIS`) — in the real app this becomes the API-backed `Analysis` object per `lib/types.js`.

## Design Tokens
Pulled verbatim from the repo's `app/globals.css` — **use those CSS variables directly, don't hardcode these hexes again**:
- `--color-canvas: #0c0b0a` (dark bg) / `--color-surface: #151412` / `--color-surface-2: #1c1a18`
- `--color-line: #262421` / `--color-line-bright: #3d3a35`
- `--color-ink: #f2efe9` / `--color-muted: #8d8880`
- `--color-verified: #7be04a` / `--color-stale: #e0a93a` / `--color-dead: #e5484d`
- Fonts: `--font-display` (Schibsted Grotesk 600/700, headings only) / `--font-sans` (Geist, body/UI) / `--font-mono` (Geist Mono, all data — scores, counts, urls, timestamps, stars)
- Radius: `--radius-card: 8px`, `--radius-control: 6px`
- The light-mode palette in the prototype (bg `#f7f6f3`, ink `#151412`, deepened verified/stale/dead for contrast) is **new** — not in the current repo, which is dark-only. Decide whether to formalize a light variant in `globals.css` or drop it; the toggle was an explicit ask in this project, not part of `docs/UI-SPEC.md`.

## Assets
No external images/icons — the design uses text glyphs (✓ ✅ ⚠️ ❌ ⠋) and CSS/SVG shapes only (the graph is plain SVG circles/lines, no icon library).

## Files
- `Project Insights.dc.html` — the full prototype (all 4 screens, React-like component authored for the Claude Design environment — see note below).
- `data.js` — ES module mirror of `lib/fixtures.js`, consumed by the prototype via dynamic `import()`.

**Important:** `Project Insights.dc.html` is authored in Claude Design's own component format (template + a `DCLogic` class), not plain React/JSX — don't copy its markup verbatim into the Next.js app. Use it as the layout/interaction/state spec and re-implement in `app/` as real routes/components against `lib/fixtures.js` and, later, live data per `lib/types.js`.
