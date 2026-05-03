# Scenario Studio Conversational Demo Spec

## Objective

Build a static, clickable, hardcoded HTML demo for **Scenario Studio**, a portfolio-aware conversational scenario intelligence workspace.

The product should feel like chatting with an AI scenario analyst. It should not feel like a slide deck or a set of static dashboards.

Core promise:

> Turn market stories into portfolio-specific scenarios, then challenge, explain, and reuse them.

## Technical Constraints

- Vanilla HTML, CSS, and JavaScript only.
- No React, npm, build step, external libraries, CDN, APIs, backend, or database.
- Must run by opening `index.html` directly.
- Must work offline and on GitHub Pages.
- All data is hardcoded and illustrative.

## Required Files

- `index.html`
- `styles.css`
- `script.js`
- `README.md`
- `Scenario_Studio_SPEC.md`

## Main Flow

1. User starts demo.
2. User selects a portfolio.
3. Scenario Studio gives a conversational portfolio risk profile.
4. Scenario Studio asks what the user wants to do next: Ask, Watch, or Discover.
5. Ask, Watch, and Discover all remain conversational, but have different starting points and intermediate outputs.
6. Scenario Studio runs Scenario Foundry.
7. Human feedback checkpoints appear after historical precedent selection, Factor Selection, shock selection, diagnostics review, and before memo generation.
8. User can challenge assumptions.
9. Scenario Studio generates Decision Notes, Client Memo, and Scenario Memory.

## Opening Screen

Keep the opening screen simple.

Show:

- Scenario Studio title.
- Product promise.
- Short description.
- Start demo CTA.

Do not explicitly call out Ask / Watch / Discover on the opening screen. Those choices appear later after the portfolio risk profile.

## Portfolios

Use three hardcoded portfolios:

### Global Multi-Asset Income

Description:
A multi-asset income portfolio with meaningful duration, high credit exposure, moderate EM FX exposure, small energy equity exposure, and modest inflation-linked hedges.

Exposures should show actual units first, then high / medium / low label:

| Risk exposure | Quantity | Label | Interpretation |
|---|---:|---|---|
| Duration | 6.8 years | High | Vulnerable if yields rise |
| IG/HY credit | 42% NAV spread beta | High | Vulnerable if spreads widen |
| EM FX | 11% unhedged | Medium | Vulnerable in USD/risk-off shock |
| Energy equities | 4% NAV long | Low positive | Partial offset to oil shock |
| Inflation-linked | 7% NAV | Medium-low | Partial hedge, not enough alone |

Key vulnerability:
Oil shock becoming a rates + credit + FX event.

### Energy-Heavy Equity

Use quantitative exposures such as 58% energy sector weight, 1.08 broad equity beta, 0.4 years duration, 3% credit-linked exposure, and 18% commodity cyclicals.

Key vulnerability:
Oil helps, but demand destruction and broad equity risk-off can dominate.

### EM Local Debt

Use quantitative exposures such as 72% local currency, 5.9y local rates duration, 31% oil importer country weight, high USD liquidity beta, and 0.35 spread beta.

Key vulnerability:
Oil shock + stronger USD + EM FX/local rates stress.

## Mode Logic

### Ask

User brings the story.

Ask starts with the user typing a concern or selecting a quick prompt. The system extracts a thesis, maps risk channels, overlays portfolio exposures, runs Scenario Foundry, generates candidates, asks for feedback, supports challenge/refinement, then generates outputs.

### Watch

System brings the story.

Watch starts with Scenario Studio suggesting relevant market themes/events. The user chooses one. Scenario Studio explains why it matters to the selected portfolio and can route the event into scenario building.

### Discover

Portfolio reveals the story.

Discover starts with Scenario Studio reverse-stressing the selected portfolio. The user chooses a vulnerability to investigate. Scenario Studio shows triggers/watch signals and can route to Watch or scenario building.

## Scenario Foundry

Scenario Foundry should be a visible, conversational build process with these steps:

1. News Briefer / Market Monitor
2. Catalyst Creator
3. Historical Harvester
4. Factor Selection
5. Shock Simulator
6. Plausibility & Diagnostics
7. Portfolio Impact

Factor Selection is one step. Do not split it into Factor Finder, Factor Fetcher, and Factor Selector.

Factor Selection should show:

- Themes detected from the narrative.
- Candidate factors considered.
- Final selected factors.
- Rejected or lower-priority candidates.
- Why the final set is explainable and portfolio-relevant.

## Human Feedback Checkpoints

The conversation should ask for human input during the build:

1. After historical analogues:
   - Ask whether any relevant precedent was missed.
   - Provide quick replies such as "Historical set looks good" and "Add 1970s oil shock as context".

2. After Factor Selection:
   - Ask whether any key factor was missed.
   - Provide quick replies such as "Factor set looks complete" and "Add oil volatility as a candidate".

3. After shock selection:
   - Ask whether the user wants to review plausibility before portfolio impact.
   - Provide quick replies such as "Review diagnostics", "Continue to portfolio impact", and "Make credit widening less severe".

Challenge & Refine still appears later as a deeper scenario-editing step.

## Plausibility & Diagnostics

Scenario Studio should not call this true scenario probability. Use these terms:

- Scenario plausibility score
- Scenario extremity percentile
- Factor shock Z-score
- 95% plausibility envelope
- Plausibility-constrained reverse stress

Visible explanatory note:

> Plausibility is an illustrative statistical diagnostic based on factor shock Z-scores and joint scenario extremity. It is not a forecast probability.

Conceptual framing:

- Individual factor Z-score = shock / historical scenario-horizon volatility.
- Scenario-level plausibility is based on joint factor shock extremity, conceptually similar to a Mahalanobis-style distance.
- A 95th percentile scenario is severe but still inside the selected plausibility envelope.
- Discover mode can search for the largest portfolio loss subject to the scenario remaining inside the 95% plausibility envelope.

Diagnostics should include:

- Scenario plausibility cards.
- Factor shock Z-score heatmap.
- Key market factor impact bars for Scenario B.
- Plausibility vs portfolio impact frontier with the 95% envelope.

Scenario B should be shown as the largest loss inside the 95% envelope. Scenario C should be shown as a larger loss that breaches the envelope.

## Right Context Panel

Do not show static portfolio exposures throughout the entire experience.

Use the right panel dynamically for:

- Current risk readout.
- Current alert focus.
- Current discovery focus.
- Scenario Foundry progress.
- Selected factors.
- Recommended scenario and impact.
- Revised assumptions.
- Decision state.

## Scenario Content

Use the Middle East escalation theme:

Middle East escalation -> oil shock -> inflation repricing -> delayed Fed cuts -> rates selloff -> credit widening -> EM FX pressure.

Recommended scenario:

Scenario B - Stagflation Repricing.

Expected impact before challenge:
-3.7%.

Revised challenge:

| Assumption | Original | Revised |
|---|---:|---:|
| Brent crude | +35% | +50% |
| US 5Y yield | +60bp | +70bp |
| CDX HY | +90bp | +50bp |
| S&P 500 | -7% | -5% |
| Portfolio impact | -3.7% | -3.2% |

## Acceptance Criteria

- Opening `index.html` works without internet.
- No console errors.
- Opening screen is simple and not overly busy.
- User first selects a portfolio.
- Portfolio exposures show quantities plus high / medium / low labels.
- User sees a conversational risk profile.
- User can choose Ask, Watch, or Discover after risk profile.
- All modes feel conversational but materially different.
- Scenario Foundry uses a single Factor Selection step.
- Human feedback checkpoints appear after historical analogues, Factor Selection, shock selection, diagnostics, and before memo generation.
- Plausibility & Diagnostics appears after Shock Simulator and before Portfolio Impact.
- Discover includes plausibility-constrained reverse stress.
- Scenario B is highlighted as the largest loss inside the 95% plausibility envelope.
- Scenario C is shown as a larger loss outside the envelope.
- Factor shock Z-score heatmap, 15-factor impact bars, and plausibility frontier are visible.
- Challenge & Refine updates both portfolio impact and plausibility diagnostics.
- Right panel changes based on current state instead of repeating exposures.
- Demo includes cross-portfolio comparison, scenario candidates, challenge, Decision Notes, Client Memo, and Scenario Memory.
- Works offline and on GitHub Pages.
