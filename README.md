# Scenario Studio - Conversational Static Demo

A hardcoded, clickable prototype for an internal hackathon idea: **Scenario Studio**, a portfolio-aware scenario intelligence workspace.

## What This Is

A purely static demo that simulates a conversational AI scenario analyst. No real LLM, APIs, backend, market data, or factor library are used. Everything is hardcoded and illustrative.

## How To Run Locally

Open `index.html` directly in any modern browser. No server, install, build step, or internet connection is required.

## How To Host On GitHub Pages

Push the repository to GitHub and enable Pages from **Settings -> Pages** using the `main` branch and repository root.

## Suggested Demo Flow

1. Start demo.
2. Select **Global Multi-Asset Income**.
3. Continue to the conversational risk profile.
4. Choose **Ask** and select the Middle East oil shock prompt.
5. Run Scenario Foundry.
6. Review historical precedent feedback.
7. Review Factor Selection feedback.
8. Review shock feedback and open **Plausibility & Diagnostics**.
9. Continue to portfolio impact.
10. Challenge assumptions and review updated plausibility.
11. Generate Decision Notes, Client Memo, and Scenario Memory.

## Optional Paths

- **Watch mode**: Scenario Studio suggests market themes and routes the selected alert into scenario building.
- **Discover mode**: Scenario Studio highlights important PnL drivers, asks for a drawdown comfort level, and saves calibration notes for later scenario building.

## Key Capabilities Shown

- Quantified portfolio exposures with high / medium / low labels.
- Factor Selection as a single step: map narrative themes, retrieve candidates, and select the final factor set.
- Human feedback checkpoints after historical analogues, factor selection, and shock selection.
- Plausibility & Diagnostics: scenario plausibility cards, compact factor shock Z-score visual matrix, 15-factor impact bars, and a plausibility-vs-impact frontier.
- Discover calibration that feeds later scenario construction without showing plausibility too early.
- Shock simulation and portfolio impact decomposition.
- Three-zone workspace: slim context rail, conversational chat, and a live results/diagnostics notebook.
- Outputs accumulate in the live notebook as collapsible sections, so the chat stays focused on narration and human checkpoints.
- Decision Notes, Client Memo, and Scenario Memory.

## Technical Notes

- Vanilla HTML, CSS, JavaScript only.
- No React, npm, build step, external libraries, CDNs, APIs, backend, or database.
- Works offline and on GitHub Pages.
