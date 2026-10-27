# Matthew Ralph portfolio

The public portfolio at <https://matt-rfs.github.io/matthew-ralph-portfolio/>.

It's built with Astro and three.js and deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

**Story:** "I build teams that perform. And I keep adding skills that help them. The newest one is AI."

**Homepage:**
- A dark first screen with recent titles, the problems solved (each with its number), and a résumé download. A holographic instrument dial sits beside them, one layer per role.
- "Sound familiar?": a team's problem, a reframe, the proof, and an invitation.
- A short career tour where the dial comes apart, one role at a time.
- The AI work and its four case studies.
- Questions a hiring manager would ask.

## Routes

| Path | Page |
|---|---|
| `/` | Homepage (general) |
| `/ai/` | The same story with the AI adoption proof and case studies first |
| `/enablement/` | The same story with training, coaching and tools first |
| `/work/job-opportunity-engine/` | Case study |
| `/work/response-flow-systems/` | Case study |
| `/work/personal-intelligence-refinery/` | Case study |
| `/work/ai-systems-reliability-lab/` | Case study |
| `/Matthew_Ralph_Resume.pdf` | Résumé |

The four `/work/` addresses are the same as in earlier versions, so links that have already been shared still work.

## Run

```bash
npm ci
npm run dev            # http://localhost:4331/matthew-ralph-portfolio/
npm run build          # static output in dist/
npm run verify:routes  # every route above was built
npm run preview
```

## Where things live

| Path | What it holds |
|---|---|
| `src/data/site.ts` | Every claim and line of copy: roles, stories, proofs, questions, and the three front doors (`frontDoors`) |
| `src/components/Home.astro` | The homepage, shared by `/`, `/ai/` and `/enablement/` |
| `src/scripts/studio.ts`, `src/scripts/hud.ts` | The 3D dial: hologram layers, particles, scroll-driven camera |
| `src/scripts/home.ts` | Scroll timeline, story drawer, and proof-to-layer hover |
| `src/layouts/Case.astro` | Case-study layout, including the "In plain words" summary |
| `public/` | Résumé, portrait, and the still images shown while the 3D loads (and on phones or with reduced motion) |

Phones, reduced motion, Save-Data and browsers without WebGL get a still image and plain stacked sections, with every word still there.
