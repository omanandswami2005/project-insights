/**
 * THE DEMO SAFETY NET — and, on plain JS, the real contract.
 *
 * Every surface must render fully from this file before any API call is wired.
 * Lanes B and C build against this from minute one and never wait on Lane A.
 *
 * If NEXT_PUBLIC_USE_FIXTURES=1, the whole app runs from here with zero network.
 * Verify that path works before the pitch.
 */

/** @type {import('@/lib/types').Evidence[]} */
export const DEMO_EVIDENCE = [
  {
    id: 'e1',
    title: 'Food waste in institutional dining: drivers and interventions',
    url: 'https://www.sciencedirect.com/science/article/pii/S0956053X23001976',
    sourceType: 'paper',
    publishedAt: '2024-03-11',
    verify: 'verified',
    checkedAt: '2026-08-01T09:14:02Z',
    confidence: 0.91,
    corroborated: true,
  },
  {
    id: 'e2',
    title: 'Plate waste measurement in university canteens: a systematic review',
    url: 'https://www.mdpi.com/2071-1050/15/4/3345',
    sourceType: 'paper',
    publishedAt: '2023-02-18',
    verify: 'verified',
    checkedAt: '2026-08-01T09:14:02Z',
    confidence: 0.87,
    corroborated: true,
  },
  {
    id: 'e3',
    title: 'Demand forecasting for campus dining halls using LSTM',
    url: 'https://arxiv.org/abs/2401.09912',
    sourceType: 'paper',
    publishedAt: '2024-01-17',
    verify: 'verified',
    checkedAt: '2026-08-01T09:14:03Z',
    confidence: 0.78,
    corroborated: false,
  },
  {
    id: 'e4',
    title: 'huggingface/food101',
    url: 'https://huggingface.co/datasets/ethz/food101',
    sourceType: 'dataset',
    publishedAt: '2024-11-02',
    verify: 'verified',
    verifyNote: '101 classes · 101k images · CC BY-SA',
    checkedAt: '2026-08-01T09:14:03Z',
    confidence: 0.95,
    corroborated: true,
    license: 'CC-BY-SA-4.0',
  },
  {
    id: 'e5',
    title: 'FoodWasteNet — plate-waste image dataset',
    url: 'https://github.com/foodwastenet/dataset',
    sourceType: 'dataset',
    verify: 'dead',
    verifyNote: '404 — repository no longer exists',
    checkedAt: '2026-08-01T09:14:04Z',
    confidence: 0.0,
    corroborated: false,
  },
  {
    id: 'e6',
    title: 'mess-management-system',
    url: 'https://github.com/example/mess-management-system',
    sourceType: 'repo',
    publishedAt: '2021-03-22',
    verify: 'stale',
    verifyNote: 'last commit 2021-03 · 4 open issues · no license',
    checkedAt: '2026-08-01T09:14:04Z',
    confidence: 0.34,
    corroborated: false,
    stars: 31,
  },
  {
    id: 'e7',
    title: 'foodwaste-predictor',
    url: 'https://github.com/example/foodwaste-predictor',
    sourceType: 'repo',
    publishedAt: '2020-08-14',
    verify: 'dead',
    verifyNote: 'archived by owner · read-only since 2022-01',
    checkedAt: '2026-08-01T09:14:05Z',
    confidence: 0.1,
    corroborated: false,
    stars: 12,
  },
  {
    id: 'e8',
    title: 'ultralytics/ultralytics',
    url: 'https://github.com/ultralytics/ultralytics',
    sourceType: 'repo',
    publishedAt: '2026-07-28',
    verify: 'verified',
    verifyNote: 'pushed 4d ago · actively maintained',
    checkedAt: '2026-08-01T09:14:05Z',
    confidence: 0.93,
    corroborated: true,
    stars: 44120,
    license: 'AGPL-3.0',
  },
  {
    id: 'e9',
    title: 'facebook/prophet',
    url: 'https://github.com/facebook/prophet',
    sourceType: 'repo',
    publishedAt: '2026-05-30',
    verify: 'verified',
    verifyNote: 'pushed 2mo ago · stable',
    checkedAt: '2026-08-01T09:14:06Z',
    confidence: 0.88,
    corroborated: true,
    stars: 19340,
    license: 'MIT',
  },
  {
    id: 'e10',
    title: 'Open Government Data — Consumer Affairs, Food & Public Distribution',
    url: 'https://data.gov.in/sector/agriculture',
    sourceType: 'api',
    verify: 'verified',
    verifyNote: 'HTTP 200 · free tier, key required',
    checkedAt: '2026-08-01T09:14:06Z',
    confidence: 0.72,
    corroborated: false,
  },
  {
    id: 'e11',
    title: 'How our hostel cut mess waste by 30% — r/Indian_Academia',
    url: 'https://www.reddit.com/r/Indian_Academia/comments/1c8x2kq/',
    sourceType: 'forum',
    publishedAt: '2025-04-09',
    verify: 'verified',
    checkedAt: '2026-08-01T09:14:07Z',
    confidence: 0.52,
    corroborated: false,
  },
  {
    id: 'e12',
    title: 'Time Series Forecasting — practical course',
    url: 'https://www.kaggle.com/learn/time-series',
    sourceType: 'learning',
    verify: 'verified',
    verifyNote: 'free · ~4 hours',
    checkedAt: '2026-08-01T09:14:07Z',
    confidence: 0.8,
    corroborated: false,
  },
  {
    id: 'e13',
    title: 'Next.js App Router — official docs',
    url: 'https://nextjs.org/docs/app',
    sourceType: 'learning',
    verify: 'verified',
    verifyNote: 'free',
    checkedAt: '2026-08-01T09:14:08Z',
    confidence: 0.9,
    corroborated: false,
  },
  {
    id: 'e14',
    title: 'Smart canteen waste bins with load cells — build log',
    url: 'https://hackaday.io/project/181234-smart-canteen-bin',
    sourceType: 'article',
    publishedAt: '2023-06-30',
    verify: 'stale',
    verifyNote: 'last updated 2023-06 · project inactive',
    checkedAt: '2026-08-01T09:14:08Z',
    confidence: 0.44,
    corroborated: false,
  },
]

/** @type {import('@/lib/types').Graph} */
export const DEMO_GRAPH = {
  nodes: [
    { id: 'n0', label: 'Hostel food waste', kind: 'problem', evidenceIds: ['e1', 'e2', 'e11'] },
    { id: 'n1', label: 'Post-consumption logging', kind: 'approach', evidenceIds: ['e2', 'e6', 'e14'] },
    { id: 'n2', label: 'Computer-vision plate waste', kind: 'approach', evidenceIds: ['e4', 'e8', 'e5'] },
    { id: 'n3', label: 'IoT smart bins', kind: 'approach', evidenceIds: ['e14'] },
    { id: 'n4', label: 'Demand forecasting', kind: 'approach', evidenceIds: ['e3', 'e9'] },
    { id: 'n5', label: 'Food waste in institutional dining', kind: 'paper', evidenceIds: ['e1'] },
    { id: 'n6', label: 'Plate waste systematic review', kind: 'paper', evidenceIds: ['e2'] },
    { id: 'n7', label: 'LSTM campus dining forecast', kind: 'paper', evidenceIds: ['e3'] },
    { id: 'n8', label: 'ethz/food101', kind: 'dataset', evidenceIds: ['e4'] },
    { id: 'n9', label: 'FoodWasteNet', kind: 'dataset', evidenceIds: ['e5'] },
    { id: 'n10', label: 'mess-management-system', kind: 'repo', evidenceIds: ['e6'] },
    { id: 'n11', label: 'foodwaste-predictor', kind: 'repo', evidenceIds: ['e7'] },
    { id: 'n12', label: 'ultralytics', kind: 'repo', evidenceIds: ['e8'] },
    { id: 'n13', label: 'prophet', kind: 'repo', evidenceIds: ['e9'] },
    { id: 'n14', label: 'data.gov.in food data', kind: 'dataset', evidenceIds: ['e10'] },
    {
      id: 'g1',
      label: 'GAP — pre-consumption forecasting from mess menus',
      kind: 'gap',
      evidenceIds: ['e3', 'e9'],
    },
    { id: 'g2', label: 'GAP — Indian hostel context is unmodelled', kind: 'gap', evidenceIds: ['e1', 'e11'] },
    { id: 'g3', label: 'GAP — no feedback loop to the cook', kind: 'gap', evidenceIds: ['e11', 'e14'] },
  ],
  edges: [
    { source: 'n0', target: 'n1', relation: 'addressed by' },
    { source: 'n0', target: 'n2', relation: 'addressed by' },
    { source: 'n0', target: 'n3', relation: 'addressed by' },
    { source: 'n0', target: 'n4', relation: 'addressed by' },
    { source: 'n1', target: 'n6', relation: 'evidenced by' },
    { source: 'n1', target: 'n10', relation: 'implemented in' },
    { source: 'n1', target: 'n11', relation: 'implemented in' },
    { source: 'n2', target: 'n8', relation: 'trained on' },
    { source: 'n2', target: 'n9', relation: 'trained on' },
    { source: 'n2', target: 'n12', relation: 'implemented in' },
    { source: 'n3', target: 'n5', relation: 'evidenced by' },
    { source: 'n4', target: 'n7', relation: 'evidenced by' },
    { source: 'n4', target: 'n13', relation: 'implemented in' },
    { source: 'n4', target: 'n14', relation: 'needs' },
    { source: 'n4', target: 'g1', relation: 'opens' },
    { source: 'n0', target: 'g2', relation: 'unaddressed in' },
    { source: 'n1', target: 'g3', relation: 'missing from' },
  ],
}

/** @type {import('@/lib/types').Novelty} */
export const DEMO_NOVELTY = {
  saturationScore: 78,
  verdict:
    'Crowded. 23 comparable projects across 4 approach clusters — but 19 of them measure waste after it happens. Score = cluster density (0.71) × recency-weighted volume (0.84), penalised 12% for the thin forecasting cluster.',
  clusters: [
    {
      id: 'c1',
      name: 'Post-consumption logging',
      size: 11,
      summary: 'Weigh or photograph what comes back. Dominant, well-trodden, low novelty.',
    },
    {
      id: 'c2',
      name: 'Computer-vision plate waste',
      size: 6,
      summary: 'Classify leftovers from tray images. Active, but dataset-hungry and mostly Western cuisine.',
    },
    {
      id: 'c3',
      name: 'IoT smart bins',
      size: 4,
      summary: 'Load cells in bins. Hardware cost kills most student attempts.',
    },
    {
      id: 'c4',
      name: 'Pre-consumption demand forecasting',
      size: 2,
      summary: 'Predict how much to cook. Thinnest cluster — and the only one that prevents waste.',
    },
  ],
  whiteSpace: [
    'Nobody forecasts from the mess menu itself — the one input every Indian hostel already has, written on a board every morning.',
    'No published work models Indian hostel dining patterns (attendance collapse on weekends, festival menus, exam-week skips).',
    'Every existing system reports to administrators. None close the loop back to the cook, who is the only person who can change the quantity.',
  ],
}

/** @type {import('@/lib/types').Comparison[]} */
export const DEMO_COMPARISONS = [
  {
    name: 'Winnow Solutions',
    approach: 'Commercial smart scale + camera on the bin, analytics dashboard for kitchens',
    strengths: ['Proven at scale in commercial kitchens', 'Accurate weight data', 'Mature reporting'],
    weaknesses: ['Hardware cost far beyond a student budget', 'Closed source', 'Enterprise sales model'],
    missing: 'Measures waste after cooking. Never tells the kitchen how much to cook in the first place.',
    url: 'https://www.winnowsolutions.com/',
  },
  {
    name: 'LeanPath',
    approach: 'Food-waste tracking terminals with staff-entered categorisation',
    strengths: ['Strong behavioural-change methodology', 'Good longitudinal reporting'],
    weaknesses: ['Requires disciplined staff data entry', 'Expensive', 'No prediction'],
    missing: 'Entirely retrospective, and depends on staff compliance that hostel messes will not sustain.',
    url: 'https://www.leanpath.com/',
  },
  {
    name: 'mess-management-system (GitHub)',
    approach: 'Django CRUD for mess menus, attendance and billing',
    strengths: ['Free and open source', 'Directly targets the Indian hostel mess context'],
    weaknesses: ['Unmaintained since 2021', 'No license', 'No analytics or ML of any kind'],
    missing: 'It is a record-keeping app. Waste is never modelled, predicted, or even measured.',
    url: 'https://github.com/example/mess-management-system',
  },
  {
    name: 'Academic CV plate-waste models',
    approach: 'CNN classification of tray images to estimate leftover volume',
    strengths: ['Published accuracy figures', 'Reusable datasets like Food-101'],
    weaknesses: ['Datasets are Western cuisine', 'Needs per-canteen retraining', 'Stays in the lab'],
    missing: 'No deployed system, and Indian thali-style plating breaks the per-item segmentation assumption.',
  },
]

/** @type {import('@/lib/types').Architecture} */
export const DEMO_ARCHITECTURE = {
  mermaid: `flowchart TD
  A[Mess menu board photo] -->|OCR| B[Menu parser]
  C[Attendance feed] --> D[Forecast engine]
  B --> D
  E[Historical waste log] --> D
  D -->|predicted portions| F[Cook dashboard]
  F -->|actual cooked + leftover| E
  D --> G[Waste projection]
  G --> H[Warden weekly report]`,
  components: [
    { name: 'Menu parser', role: 'Photo of the mess board → structured dish list', tech: 'Next.js route + Claude vision' },
    { name: 'Attendance feed', role: 'Who is eating tonight — manual or existing mess-card data', tech: 'Postgres / CSV import' },
    { name: 'Forecast engine', role: 'Predicts portions per dish from menu + attendance + history', tech: 'Prophet or a gradient-boosted baseline' },
    { name: 'Cook dashboard', role: 'One number per dish, in the cook\'s language, on a phone', tech: 'Next.js PWA' },
    { name: 'Feedback loop', role: 'Cook logs actual cooked and leftover; retrains weekly', tech: 'Cron + the same store' },
  ],
  dataFlow:
    'The menu photo and tonight\'s attendance drive a portion forecast per dish. The cook sees one number per dish and reports back what was actually cooked and left over, which becomes next week\'s training data. Waste projections roll up to the warden weekly.',
}

/** @type {import('@/lib/types').RealityCheck} */
export const DEMO_REALITY = {
  buildabilityScore: 64,
  verdict: 'Feasible, if you cut',
  keep: [
    'Mess menu ingestion (photo → dish list)',
    'Portion forecast for the next meal',
    'Cook-facing prediction screen',
    'Actual-vs-predicted feedback logging',
  ],
  cut: [
    'Mobile app (use a PWA)',
    'Multi-hostel support',
    'Computer vision on plate waste',
    'IoT weight sensors',
    'Payment / billing integration',
    'Admin role management',
    'Real-time notifications',
    'Nutrition analysis',
    'Historical dashboards beyond one chart',
  ],
  stack: [
    { layer: 'Frontend', choice: 'Next.js PWA', why: 'One deploy, installable on the cook\'s phone', freeTier: true },
    { layer: 'Menu OCR', choice: 'Claude vision', why: 'Handles handwritten mess boards; no training data needed', freeTier: false },
    { layer: 'Forecasting', choice: 'Prophet', why: 'Works on ~30 days of data; no GPU', freeTier: true },
    { layer: 'Database', choice: 'Supabase Postgres', why: 'Free tier covers one hostel comfortably', freeTier: true },
    { layer: 'Hosting', choice: 'Vercel', why: 'Zero config, free hobby tier', freeTier: true },
  ],
  milestones: [
    {
      id: 'm0',
      title: 'Vertical slice — one meal, one prediction',
      days: 2,
      tasks: [
        'Hardcode one week of menu + attendance',
        'Fit a naive average-per-dish baseline',
        'Render one screen showing predicted portions',
      ],
      deliverable: 'A working prediction on real numbers, end to end. Ship this before anything else.',
    },
    {
      id: 'm1',
      title: 'Menu ingestion',
      days: 5,
      tasks: ['Photo upload', 'Claude vision → dish list', 'Manual correction UI'],
      deliverable: 'Photograph the mess board, get a structured menu.',
    },
    {
      id: 'm2',
      title: 'Forecast engine',
      days: 7,
      tasks: ['Collect 3 weeks of real waste data', 'Fit Prophet per dish', 'Compare against the baseline'],
      deliverable: 'Forecast that beats the naive baseline on held-out days.',
    },
    {
      id: 'm3',
      title: 'Feedback loop + cook screen',
      days: 6,
      tasks: ['Cook logs cooked + leftover', 'Weekly retrain job', 'Hindi/Marathi UI strings'],
      deliverable: 'A cook uses it unaided for one week.',
    },
  ],
}

/** @type {import('@/lib/types').Analysis} */
export const DEMO_ANALYSIS = {
  id: 'demo',
  idea: 'Build an AI solution to reduce food waste in college hostels',
  status: 'done',
  progress: [
    { step: 'deepsearch', label: 'Searching trusted sources', done: true, ms: 1800 },
    { step: 'papers', label: 'Retrieving research papers', done: true, ms: 3100 },
    { step: 'verifying', label: 'Verifying every resource is alive', done: true, ms: 4600 },
    { step: 'clustering', label: 'Clustering approaches, scoring novelty', done: true, ms: 7200 },
    { step: 'planning', label: 'Building the project plan', done: true, ms: 9400 },
  ],
  summary:
    'Reducing hostel food waste is a well-populated problem, but almost all existing work measures waste after it is produced. The unexploited angle is prediction: forecasting how much to cook from the mess menu and expected attendance, then closing the loop back to the cook. That is buildable by a small team on free tiers.',
  evidence: DEMO_EVIDENCE,
  graph: DEMO_GRAPH,
  novelty: DEMO_NOVELTY,
  reality: DEMO_REALITY,
  comparisons: DEMO_COMPARISONS,
  architecture: DEMO_ARCHITECTURE,
  language: 'en',
  unverified: [
    'The claim that Indian hostel messes waste 20-30% of cooked food comes from a single forum thread, not a study. Treat as anecdotal.',
    'Could not confirm whether data.gov.in exposes hostel-level consumption data — the sector listing is broad and the endpoint requires a key we did not have.',
    'Two of the four commercial comparisons have no public pricing; the "beyond student budget" judgement is inferred from their enterprise sales model, not from a quoted figure.',
  ],
  createdAt: '2026-08-01T09:14:00Z',
}

/** Example ideas for the intake page chips (Lane B). */
export const EXAMPLE_IDEAS = [
  'Build an AI solution to reduce food waste in college hostels',
  'A campus lost-and-found that matches photos automatically',
  'Detect crop disease from a phone photo for small farmers',
]

/** True when the app should run entirely offline from these fixtures. */
export const USE_FIXTURES = process.env.NEXT_PUBLIC_USE_FIXTURES === '1'
