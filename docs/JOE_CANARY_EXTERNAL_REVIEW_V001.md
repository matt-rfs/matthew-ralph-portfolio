# JOE canary external review V001

## Inputs and method

- **Before:** live public JOE page at `origin/main`.
- **After:** local canary at `29c67ac` plus the accessibility refinement recorded below.
- **Authority:** `PRODUCT.md`, `DESIGN.md`, and `docs/DESIGN_RECONCILIATION_V001.md`.
- **Rendered validation:** ephemeral Playwright Chromium at 1440×1000 and 390×844 across home, JOE, RFS, and Lab. JOE before/after screenshots are local-only review artifacts outside the repository.
- **External critique:** ephemeral Impeccable browser detector using the existing `DESIGN.md`; it is advisory.

## Pilot footprint

Playwright 1.52, Chromium, and the Impeccable CLI were obtained through user-level ephemeral package/browser caches outside the repository. No package manifest, lockfile, runtime dependency, configuration, or public asset changed. The caches are retained only because the pilot established concrete validation value; future use remains an explicit, minimal pilot workflow rather than a project dependency.

## Before / after

The before page makes the governed system credible but delays its proof and boundary signals. The after page exposes a compact evidence ledger near the top, keeps JOE’s role and system narrative intact, makes four consequential decisions inspectable, and pairs the frozen checkpoint with the current human-authority boundary.

At 390px, the ledger, decision records, checkpoint pair, workflow, links, and navigation all render without document overflow. The canary is more immediately scannable without changing Matthew’s business-systems and AI-transformation positioning.

## Recommendation disposition

| Recommendation | Source | Authority alignment | Recruiter value | Evidence risk | Complexity | Disposition |
| --- | --- | --- | --- | --- | --- | --- |
| Raise decision-record micro-labels above the practical 11px floor | Impeccable detector | High | Medium | None | Low | ACCEPT |
| Remove the hero eyebrow as a generic SaaS signal | Impeccable detector | Low; conflicts with restrained technical labels and existing grammar | Low | None | Low | REJECT |
| Remove warm left-rule notes as “side tabs” | Impeccable detector | Low; existing bounded emphasis remains purposeful | Low | None | Low | REJECT |
| Remove uppercase short labels | Impeccable detector | Low; authority permits short, tracked labels | Low | None | Low | REJECT |
| Increase all tight display leading | Impeccable detector | Low; display leading is intentionally editorial and visually readable | Low | None | Low | REJECT |
| Replace Inter because it is widely used | Impeccable detector | Low; conflicts with explicit typography authority and adds unjustified change | Low | None | Moderate | REJECT |

The accepted refinement changes decision-record labels from `0.68rem` to `0.72rem`. No factual, maturity, authorship, or public/private claim changed.

## Tool disposition

- **Playwright — ADOPT_MINIMAL:** it supplied the missing real 390px validation and reproducible screenshots; it found no hidden defect.
- **Impeccable — ADOPT_SELECTIVELY:** its detector produced several generic false positives against intentional dossier choices, but it caught one concrete label-size issue. Use as a bounded input, never as authority.

## Rollout decision

**ROLLOUT_APPROVED_WITH_LIMITS.** The evidence ledger, selective decision records, checkpoint/boundary pair, and mobile stacking rules earned selective propagation to flagship case studies where equivalent evidence exists. They are not a homepage, Lab, or portfolio-wide template mandate. Existing palette, typography, hierarchy, navigation, and evidence boundaries remain unchanged.
