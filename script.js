// ============================================================
// DATA
// ============================================================

const portfolios = {
  "Global Multi-Asset Income": {
    description: "A multi-asset income portfolio with meaningful duration, high credit exposure, moderate EM FX exposure, small energy equity exposure, and modest inflation-linked hedges.",
    exposureBadges: ["Long duration", "High credit beta", "Moderate EM FX", "Small energy offset", "Modest inflation hedge"],
    exposures: [
      ["Duration",              "6.8 years",          "High",       "Vulnerable if yields rise",         88, "red"],
      ["IG/HY credit",          "42% NAV spread beta", "High",       "Vulnerable if spreads widen",        86, "orange"],
      ["EM FX",                 "11% unhedged",       "Medium",     "Vulnerable in USD / risk-off shock", 58, "yellow"],
      ["Energy equities",       "4% NAV long",        "Low positive","Partial offset to oil shock",        34, "green"],
      ["Inflation-linked",      "7% NAV",             "Medium-low", "Partial hedge, not enough alone",    44, "cyan"]
    ],
    vulnerability: "Oil shock becoming a rates + credit + FX event"
  },
  "Energy-Heavy Equity": {
    description: "An equity portfolio with high energy sector exposure, commodity-linked cyclicals, broad equity beta, and low duration exposure.",
    exposureBadges: ["Very high energy", "Broad equity beta", "Low duration", "Commodity cyclicals", "Oil/risk-off tradeoff"],
    exposures: [
      ["Energy equities",   "58% sector weight", "Very high", "Benefits from oil price upside",             94, "green"],
      ["Broad equity beta", "1.08 beta",         "High",      "Vulnerable if growth / risk sentiment falls", 82, "orange"],
      ["Duration",          "0.4 years",         "Low",       "Less directly exposed to rates",              24, "green"],
      ["Credit",            "3% credit-linked",  "Low",       "Limited spread exposure",                     28, "green"],
      ["Commodity cyclicals","18% NAV",          "Medium",    "Sensitive to demand outlook",                 56, "yellow"]
    ],
    vulnerability: "Demand destruction and broad equity risk-off, not oil alone"
  },
  "EM Local Debt": {
    description: "A portfolio exposed to EM local rates, EM FX, external funding pressure, and dollar strength.",
    exposureBadges: ["Very high EM FX", "EM local rates", "USD sensitivity", "Oil importers", "Funding pressure"],
    exposures: [
      ["EM FX",         "72% local currency", "Very high",        "Vulnerable to USD strength",          96, "red"],
      ["EM local rates","5.9y duration",     "High",             "Vulnerable to local rates selloff",   84, "orange"],
      ["Oil importers", "31% country weight", "Medium",           "Inflation / current account pressure",58, "yellow"],
      ["USD liquidity", "High beta screen",  "High sensitivity", "Vulnerable to funding stress",        86, "red"],
      ["Credit beta",   "0.35 spread beta",  "Medium",           "Risk-off spillover",                  52, "yellow"]
    ],
    vulnerability: "Oil shock + stronger USD + EM FX / local rates stress"
  }
};

const FOUNDRY_STEPS = [
  { id: 1, name: "News Briefer",       subtitle: "Market Monitor",        sig: false },
  { id: 2, name: "Catalyst Creator",   subtitle: "Causal Chain",          sig: false },
  { id: 3, name: "Historical Harvester", subtitle: "Historical Precedents", sig: false },
  { id: 4, name: "Factor Selection",   subtitle: "Map, retrieve, choose",  sig: false },
  { id: 5, name: "Shock Simulator",    subtitle: "Scenario Shocks",       sig: false },
  { id: 6, name: "Plausibility & Diagnostics", subtitle: "Shock Diagnostics", sig: false },
  { id: 7, name: "Portfolio Impact",   subtitle: "Impact Decomposition",  sig: false }
];

const FACTOR_UNIVERSE = [
  "Brent crude",
  "WTI crude",
  "US 2Y yield",
  "US 5Y yield",
  "US 10Y yield",
  "US 5Y breakeven inflation",
  "US 10Y breakeven inflation",
  "CDX IG",
  "CDX HY",
  "S&P 500",
  "MSCI World",
  "VIX",
  "EM FX basket",
  "EM local rates",
  "USD index"
];

const SCENARIO_DIAGNOSTICS = {
  A: {
    name: "Scenario A — Contained Oil Shock",
    shortName: "Scenario A",
    impact: "-0.8%",
    percentile: 72,
    status: "Inside 95% envelope",
    severity: "Moderate",
    factors: {
      "Brent crude": ["+20%", 1.4],
      "WTI crude": ["+18%", 1.3],
      "US 2Y yield": ["+10bp", 0.4],
      "US 5Y yield": ["+15bp", 0.6],
      "US 10Y yield": ["+12bp", 0.5],
      "US 5Y breakeven inflation": ["+15bp", 0.7],
      "US 10Y breakeven inflation": ["+10bp", 0.5],
      "CDX IG": ["+8bp", 0.4],
      "CDX HY": ["+25bp", 0.6],
      "S&P 500": ["-2%", -0.5],
      "MSCI World": ["-1.8%", -0.5],
      "VIX": ["+3 pts", 0.7],
      "EM FX basket": ["-1%", -0.4],
      "EM local rates": ["+15bp", 0.5],
      "USD index": ["+0.8%", 0.4]
    }
  },
  B: {
    name: "Scenario B — Stagflation Repricing",
    shortName: "Scenario B",
    impact: "-3.7%",
    percentile: 94,
    status: "Inside 95% envelope",
    severity: "Severe but plausible",
    recommended: true,
    factors: {
      "Brent crude": ["+35%", 2.2],
      "WTI crude": ["+32%", 2.0],
      "US 2Y yield": ["+70bp", 1.9],
      "US 5Y yield": ["+60bp", 1.8],
      "US 10Y yield": ["+45bp", 1.5],
      "US 5Y breakeven inflation": ["+35bp", 1.6],
      "US 10Y breakeven inflation": ["+25bp", 1.2],
      "CDX IG": ["+25bp", 1.4],
      "CDX HY": ["+90bp", 1.9],
      "S&P 500": ["-7%", -1.5],
      "MSCI World": ["-6%", -1.4],
      "VIX": ["+10 pts", 1.8],
      "EM FX basket": ["-3%", -1.2],
      "EM local rates": ["+45bp", 1.4],
      "USD index": ["+2.0%", 1.0]
    }
  },
  C: {
    name: "Scenario C — Credit Risk-Off",
    shortName: "Scenario C",
    impact: "-4.5%",
    percentile: 98,
    status: "Outside 95% envelope",
    severity: "Extreme / outside 95% envelope",
    factors: {
      "Brent crude": ["+20%", 1.4],
      "WTI crude": ["+18%", 1.3],
      "US 2Y yield": ["-20bp", -0.7],
      "US 5Y yield": ["-10bp", -0.3],
      "US 10Y yield": ["-5bp", -0.2],
      "US 5Y breakeven inflation": ["-10bp", -0.5],
      "US 10Y breakeven inflation": ["-8bp", -0.4],
      "CDX IG": ["+45bp", 2.4],
      "CDX HY": ["+140bp", 2.8],
      "S&P 500": ["-10%", -2.1],
      "MSCI World": ["-9%", -2.0],
      "VIX": ["+18 pts", 3.0],
      "EM FX basket": ["-5%", -2.0],
      "EM local rates": ["+70bp", 2.1],
      "USD index": ["+3.0%", 1.6]
    }
  }
};

// ============================================================
// STATE
// ============================================================

const state = {
  view: "landing",
  selectedPortfolio: "Global Multi-Asset Income",
  currentMode: "Setup",
  step: "portfolio",
  foundryStep: 0,
  messages: [],
  typing: false,
  quickReplies: [],
  inputMode: null,
  busy: false,
  livePanel: null,
  liveSections: [],
  activeSectionId: null,
  discoverComfort: null,
  scenarioState: {
    source: "—",
    thesis: "Pending",
    foundry: "Pending",
    challenge: "Pending",
    notes: "Pending",
    memo: "Pending",
    memory: "Pending"
  }
};

// ============================================================
// DOM REFS
// ============================================================

const root             = document.getElementById("root");
const portfolioLabel   = document.getElementById("portfolioLabel");
const modeLabel        = document.getElementById("modeLabel");
const brandButton      = document.getElementById("brandButton");

// ============================================================
// CORE UTILITIES
// ============================================================

const sleep = (ms) => new Promise((r) => window.setTimeout(r, ms));
const THINKING_DELAY_MULTIPLIER = 1.35;
const MIN_THINKING_DELAY = 1700;
const CHAT_SCROLL_DURATION = 2600;
const NOTEBOOK_SCROLL_DURATION = 1800;
const SCROLL_JUST_NOTICEABLE = 140;
const activeScrolls = new WeakMap();
let nextChatPosition = "preserve";

function showTypingThen(html, delay) {
  state.typing = true;
  render();
  const requestedDelay = delay || 1800;
  const pacedDelay = Math.max(MIN_THINKING_DELAY, Math.round(requestedDelay * THINKING_DELAY_MULTIPLIER));
  return sleep(pacedDelay).then(() => {
    state.typing = false;
    addAI(html);
  });
}

function sequence(fns) {
  return fns.reduce((p, fn) => p.then(fn), Promise.resolve());
}

// ============================================================
// MESSAGE API
// ============================================================

function addAI(html) {
  requestChatPosition(isChatNearBottom() ? "bottom" : "preserve");
  state.messages.push({ role: "ai", html });
  render();
}

function addUser(text) {
  // sanitize only < and > to prevent injected tags; entities render fine
  requestChatPosition(isChatNearBottom() ? "bottom" : "preserve");
  const safe = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  state.messages.push({ role: "user", html: safe });
  render();
}

function setQuickReplies(replies) {
  state.quickReplies = replies || [];
}

// ============================================================
// RENDER SYSTEM
// ============================================================

function render() {
  portfolioLabel.textContent = state.selectedPortfolio || "Not selected";
  modeLabel.textContent      = state.currentMode       || "Setup";
  updateProgress();

  if      (state.view === "landing")   root.innerHTML = renderLanding();
  else if (state.view === "portfolio") root.innerHTML = renderPortfolioSelection();
  else if (root.querySelector(".workspace")) patchWorkspace();
  else root.innerHTML = renderWorkspace();

  bindEvents();
}

// ── Landing ──────────────────────────────────────────────────
function renderLanding() {
  return `
    <section class="hero">
      <p class="eyebrow">Internal hackathon demo</p>
      <h1>Scenario Studio</h1>
      <p class="lead"><strong>Turn market stories into portfolio-specific scenarios &mdash; then challenge, explain, and reuse them.</strong></p>
      <p class="muted" style="max-width:700px;margin-bottom:22px">Start with a portfolio, discuss a market story with an AI scenario analyst, and preserve the logic behind every scenario for reuse.</p>
      <div class="actions">
        <button class="button primary large" data-action="start">Start demo</button>
      </div>
    </section>`;
}

// ── Portfolio selection ───────────────────────────────────────
function renderPortfolioSelection() {
  return `
    <section>
      <div class="hero" style="margin-bottom:14px">
        <p class="eyebrow">Step 1</p>
        <h2>Choose a portfolio</h2>
        <p class="muted">Scenario relevance starts with exposures. Select a portfolio and Scenario Studio will explain its risk profile conversationally before you pick a mode.</p>
      </div>
      <div class="grid-3">
        ${Object.entries(portfolios).map(([name, p]) => `
          <button class="portfolio-card ${state.selectedPortfolio === name ? "selected" : ""}" data-portfolio="${name}">
            <div>
              <h3>${name}</h3>
              <p class="muted" style="font-size:13px">${p.description}</p>
            </div>
            <div class="chip-row">${p.exposureBadges.map((b, i) => `<span class="badge ${badgeClass(i)}" style="font-size:11px">${b}</span>`).join("")}</div>
            <p style="font-size:13px;margin:0"><strong>Key vulnerability:</strong> <span class="muted">${p.vulnerability}</span></p>
            <span class="button ${state.selectedPortfolio === name ? "primary" : ""}" style="width:100%;justify-content:center">
              ${state.selectedPortfolio === name ? "&#10003; Selected" : "Select"}
            </span>
          </button>`).join("")}
      </div>
      <div class="actions" style="margin-top:16px">
        <button class="button" data-action="landing">Back</button>
        <button class="button primary" data-action="risk">Continue with ${state.selectedPortfolio}</button>
      </div>
    </section>`;
}

// ── Workspace ─────────────────────────────────────────────────
function renderWorkspace() {
  const disabled = state.busy ? "disabled" : "";
  return `
    <section class="workspace">
      ${renderContextPanel()}
      <div class="chat-shell">
        <div class="chat-header">
          <div>
            <strong>Scenario Studio Analyst</strong>
            <small class="muted">${headerSubtitle()}</small>
          </div>
          <span class="badge ${modeBadgeClass()}">${state.currentMode}</span>
        </div>
        <div class="chat-body" id="chatBody">
          ${state.messages.map(renderMessage).join("")}
          ${state.typing ? renderTyping() : ""}
        </div>
        <div class="chat-footer">
          ${state.quickReplies.length ? `
            <div class="quick-replies">
              ${state.quickReplies.map(q =>
                `<button class="quick ${q.primary ? "primary" : ""}" data-reply="${q.action}" ${disabled}>${q.label}</button>`
              ).join("")}
            </div>` : ""}
          <div class="chat-input" style="margin-top:${state.quickReplies.length ? "10px" : "0"}">
            <input class="input" id="chatInput" placeholder="${inputPlaceholder()}" ${disabled}>
            <button class="button primary" data-action="send-input" ${disabled}>Send</button>
          </div>
        </div>
      </div>
      ${renderLivePanel()}
    </section>`;
}

function patchWorkspace() {
  const disabled = state.busy ? "disabled" : "";

  const chatHeader = root.querySelector(".chat-header");
  if (chatHeader) {
    chatHeader.innerHTML = `
      <div>
        <strong>Scenario Studio Analyst</strong>
        <small class="muted">${headerSubtitle()}</small>
      </div>
      <span class="badge ${modeBadgeClass()}">${state.currentMode}</span>`;
  }

  const chatBody = document.getElementById("chatBody");
  if (chatBody) {
    const wasNearBottom = isChatNearBottom();
    const previousTop = chatBody.scrollTop;
    chatBody.innerHTML = `
      ${state.messages.map(renderMessage).join("")}
      ${state.typing ? renderTyping() : ""}`;
    if (nextChatPosition === "bottom" || wasNearBottom) {
      chatBody.scrollTop = Math.max(0, chatBody.scrollHeight - chatBody.clientHeight);
    } else {
      chatBody.scrollTop = Math.min(previousTop, Math.max(0, chatBody.scrollHeight - chatBody.clientHeight));
    }
    nextChatPosition = "preserve";
  }

  const chatFooter = root.querySelector(".chat-footer");
  if (chatFooter) {
    chatFooter.innerHTML = `
      ${state.quickReplies.length ? `
        <div class="quick-replies">
          ${state.quickReplies.map(q =>
            `<button class="quick ${q.primary ? "primary" : ""}" data-reply="${q.action}" ${disabled}>${q.label}</button>`
          ).join("")}
        </div>` : ""}
      <div class="chat-input" style="margin-top:${state.quickReplies.length ? "10px" : "0"}">
        <input class="input" id="chatInput" placeholder="${inputPlaceholder()}" ${disabled}>
        <button class="button primary" data-action="send-input" ${disabled}>Send</button>
      </div>`;
  }

  const contextPanel = root.querySelector(".context-panel");
  if (contextPanel) contextPanel.outerHTML = renderContextPanel();

  const livePanel = root.querySelector(".live-panel");
  if (livePanel) livePanel.outerHTML = renderLivePanel();
}

function renderMessage(msg) {
  return `
    <div class="message ${msg.role}">
      <div class="sender">${msg.role === "user" ? "You" : "Scenario Studio"}</div>
      <div class="bubble">${msg.html}</div>
    </div>`;
}

function renderTyping() {
  return `
    <div class="message ai">
      <div class="sender">Scenario Studio</div>
      <div class="bubble"><div class="typing"><span></span><span></span><span></span></div></div>
    </div>`;
}

// ── Context panel ─────────────────────────────────────────────
function renderContextPanel() {
  const showStepper = state.foundryStep > 0
    || ["analyze","challenge","explain","memory"].includes(state.step);

  return `
    <aside class="context-panel">
      <div class="context-section">
        <div class="context-title">Portfolio</div>
        <p style="margin:0 0 4px;font-weight:800;font-size:13px;line-height:1.25">${state.selectedPortfolio}</p>
        <p class="muted" style="margin:0;font-size:11px;line-height:1.35">${portfolios[state.selectedPortfolio].vulnerability}</p>
      </div>

      ${showStepper ? `
        <div class="context-section">
          <div class="context-title">Foundry</div>
          <div class="foundry-stepper">
            ${FOUNDRY_STEPS.map(fs => {
              const done   = state.foundryStep > fs.id;
              const active = state.foundryStep === fs.id;
              const cls    = done ? "done" : active ? "active" : "pending";
              return `
                <div class="foundry-step ${cls}${fs.sig ? " sig" : ""}">
                  <div class="foundry-step-dot">${done ? "&#10003;" : fs.id}</div>
                  <div>
                    <div class="foundry-step-name">${fs.name}${fs.sig ? " &#10022;" : ""}</div>
                    <div class="foundry-step-sub">${fs.subtitle}</div>
                  </div>
                </div>`;
            }).join("")}
          </div>
        </div>` : `
        <div class="context-section">
          <div class="context-title">Key vulnerability</div>
          <p class="muted" style="margin:0;font-size:12px">${portfolios[state.selectedPortfolio].vulnerability}</p>
        </div>`}

      <div class="context-section">
        <div class="context-title">Session</div>
        <div class="rail-stat"><span>Mode</span><strong>${state.currentMode}</strong></div>
        <div class="rail-stat"><span>Comfort PnL</span><strong>${state.discoverComfort || "Unset"}</strong></div>
        <div class="rail-stat"><span>Scenario</span><strong>${state.scenarioState.foundry === "Done" ? "Built" : state.scenarioState.foundry}</strong></div>
      </div>
    </aside>`;
}

function renderLivePanel() {
  return `
    <aside class="live-panel">
      <div class="live-panel-header">
        <div>
          <div class="context-title">Live Workspace</div>
          <strong>${livePanelTitle()}</strong>
        </div>
        <span class="badge ${modeBadgeClass()}">${state.currentMode}</span>
      </div>
      <div class="live-panel-body">
        ${renderLiveNotebook()}
      </div>
    </aside>`;
}

function setLivePanel(html) {
  state.livePanel = html;
  state.liveSections = [];
  state.activeSectionId = null;
  render();
  scrollLiveWorkspace("top");
}

function resetLiveNotebook(title, html, meta) {
  state.livePanel = null;
  state.liveSections = [{
    id: uniqueId("section"),
    title,
    meta: meta || "Current output",
    html
  }];
  state.activeSectionId = state.liveSections[0].id;
  render();
  scrollLiveWorkspace("top");
}

function addLiveSection(title, html, meta) {
  state.livePanel = null;
  const id = uniqueId("section");
  state.liveSections.unshift({ id, title, meta: meta || "Output", html });
  state.activeSectionId = id;
  render();
  scrollLiveWorkspace("top");
}

function renderLiveNotebook() {
  if (state.liveSections.length) {
    return `<div class="live-notebook">
      ${state.liveSections.map((section, index) => {
        const open = section.id === state.activeSectionId;
        return `<details class="live-section" ${open ? "open" : ""}>
          <summary>
            <span class="section-index">${index + 1}</span>
            <span><strong>${section.title}</strong><em>${section.meta}</em></span>
          </summary>
          <div class="live-section-body">${section.html}</div>
        </details>`;
      }).join("")}
    </div>`;
  }
  return state.livePanel || livePanelFallback();
}

function uniqueId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function livePanelTitle() {
  if (state.currentMode === "Discover") return "Vulnerability calibration";
  if (state.currentMode === "Watch") return "Alert intelligence";
  if (state.foundryStep === 6) return "Plausibility diagnostics";
  if (state.currentMode === "Challenge") return "Assumption impact";
  if (state.step === "memory") return "Saved scenario trail";
  return "Portfolio-aware outputs";
}

function livePanelFallback() {
  if (state.step === "risk" || state.step === "mode") return exposureSummaryCard();
  if (state.currentMode === "Watch") return watchEventCards();
  if (state.currentMode === "Discover") return discoverThemeDashboard();
  if (state.foundryStep >= 5) return shockMenuCard();
  return `<div class="empty-live">
    <strong>Outputs appear here as the analyst works.</strong>
    <span>Use the chat to steer the session; diagnostics, tables, and scenario artifacts will render in this workspace.</span>
  </div>`;
}

// ============================================================
// FLOW 1 — RISK PROFILE
// ============================================================

function contextSnapshot() {
  const source = state.scenarioState.source && state.scenarioState.source !== "â€”"
    ? state.scenarioState.source
    : "No scenario source selected yet.";

  if (state.step === "risk" || state.step === "mode") {
    return {
      summary: "Portfolio loaded. Waiting for the user to choose how scenario work should start.",
      title: "Risk readout",
      html: `<div class="context-list">
        <div class="exposure"><strong>Top concern</strong><span class="muted">Oil becoming a rates + credit event</span></div>
        <div class="exposure"><strong>Best next action</strong><span class="muted">Choose Ask, Watch, or Discover</span></div>
      </div>`
    };
  }

  if (state.currentMode === "Watch") {
    return {
      summary: "Scenario Studio is scanning event relevance against the selected portfolio.",
      title: "Alert focus",
      html: `<div class="context-list">
        <div class="exposure"><strong>Middle East escalation</strong><span class="badge red" style="width:max-content">92 relevance</span><span class="muted">Brent +8%, breakevens wider, USD stronger</span></div>
        <div class="exposure"><strong>Matched vulnerability</strong><span class="muted">Oil + rates + credit stagflation</span></div>
      </div>`
    };
  }

  if (state.currentMode === "Discover") {
    return {
      summary: "Scenario Studio is reverse-stressing the portfolio before a market story is provided.",
      title: "Discovery focus",
      html: `<div class="context-list">
        <div class="exposure"><strong>Top vulnerability</strong><span class="impact">-5.1%</span><span class="muted">Oil + rates + credit stagflation</span></div>
        <div class="exposure"><strong>Watch triggers</strong><span class="muted">Brent spike, breakevens wider, HY spreads wider</span></div>
      </div>`
    };
  }

  if (state.foundryStep >= 4 && state.foundryStep <= 6) {
    return {
      summary: source,
      title: "Current build output",
      html: `<div class="context-list">
        <div class="exposure"><strong>Selected factors</strong><span class="muted">Brent, US 5Y breakeven, US 5Y yield, CDX HY, EM FX, S&amp;P 500</span></div>
        <div class="exposure"><strong>Recommended scenario</strong><span class="badge red" style="width:max-content">Scenario B</span><span class="muted">Stagflation repricing</span></div>
        <div class="exposure"><strong>Estimated impact</strong><span class="impact">-3.7%</span></div>
      </div>`
    };
  }

  if (state.step === "challenge") {
    return {
      summary: "Human feedback is being incorporated into Scenario B.",
      title: "Revised scenario",
      html: `<div class="context-list">
        <div class="exposure"><strong>Brent crude</strong><span>+35% -> +50%</span></div>
        <div class="exposure"><strong>CDX HY</strong><span>+90bp -> +50bp</span></div>
        <div class="exposure"><strong>Impact</strong><span class="impact">-3.2%</span></div>
      </div>`
    };
  }

  return {
    summary: source,
    title: "Scenario insight",
    html: `<div class="context-list">
      <div class="exposure"><strong>Key insight</strong><span class="muted">Rates and credit dominate the loss, not oil alone.</span></div>
      <div class="exposure"><strong>Next output</strong><span class="muted">${state.step === "explain" ? "Decision notes / memo" : "Scenario build"}</span></div>
    </div>`
  };
}

function startRiskProfile() {
  state.view = "workspace";
  state.currentMode = "Risk Profile";
  state.step = "risk";
  state.messages = [];
  state.quickReplies = [];
  state.inputMode = null;
  state.foundryStep = 0;
  state.livePanel = null;
  state.liveSections = [];
  state.activeSectionId = null;
  state.discoverComfort = null;
  state.busy = true;
  state.scenarioState = { source: "—", thesis: "Pending", foundry: "Pending", challenge: "Pending", notes: "Pending", memo: "Pending", memory: "Pending" };
  render();

  sequence([
    () => showTypingThen(`<p>I've loaded <strong>${state.selectedPortfolio}</strong>. Before we choose a mode, I'll summarize the portfolio's risk profile so every scenario we build is grounded in actual exposures.</p>`, 2000),
    () => showTypingThen(`<p>I've put the exposure readout in the workspace. The headline is clear: rates and credit are doing most of the risk work here.</p>`, 1600).then(() => setLivePanel(exposureSummaryCard())),
    () => showTypingThen(`<p>My initial read: this portfolio is more exposed to <strong>second-order macro spillovers</strong> than to any single market headline. A pure oil shock may be partly offset by energy exposure, but oil becoming a rates-and-credit event is a different story — and that's the bigger risk here.</p>`, 2200),
    () => {
      state.busy = false;
      state.step = "mode";
      setQuickReplies([
        { label: "Ask — I have a market question or article", action: "mode-ask", primary: true },
        { label: "Watch — Show me relevant market themes",    action: "mode-watch" },
        { label: "Discover — Tell me what this portfolio is vulnerable to", action: "mode-discover" }
      ]);
      addAI(`<p>How would you like to start?</p>`);
    }
  ]);
}

// ============================================================
// FLOW 2 — ASK MODE
// ============================================================

function enterAsk() {
  state.currentMode = "Ask";
  state.step = "analyze";
  state.inputMode = "ask";
  state.busy = false;
  setQuickReplies([]);
  resetLiveNotebook("Ask workspace", askWorkspaceCard(), "User brings the story");

  showTypingThen(
    `<p>What market story, article, or client concern do you want to test against <strong>${state.selectedPortfolio}</strong>? You can type it below or choose a quick start.</p>`,
    1600
  ).then(() => {
    setQuickReplies([
      { label: "Middle East tensions / oil shock story",  action: "ask-submit", primary: true },
      { label: "Higher-for-longer Fed repricing",         action: "ask-submit" },
      { label: "China growth slowdown",                   action: "ask-submit" },
      { label: "Credit spread widening",                  action: "ask-submit" }
    ]);
    render();
  });
}

function submitAsk(userText) {
  const text = userText || "I am worried about Middle East tensions. Oil is moving higher and markets are questioning whether the Fed can cut. How could this impact my portfolio?";
  setQuickReplies([]);
  state.inputMode = null;
  state.busy = true;

  addUser(text);
  resetLiveNotebook("Ask intake", thesisWorkingCard(), "Reading user story");

  showTypingThen(
    `<p>I'll treat this as an oil / inflation / rates story and build it through the Scenario Foundry. First let me extract the market thesis.</p>
     ${loadingCard(["Reading concern", "Extracting market thesis", "Identifying risk channels", "Preparing Scenario Foundry"])}`,
    2400
  ).then(() => {
    state.scenarioState.thesis = "Done";
    addLiveSection("Extracted thesis", thesisCard(), "Risk channels mapped");
    addAI(`<p>I extracted the market thesis and mapped the risk channels in the workspace. Now I'll run it through <strong>Scenario Foundry</strong> &mdash; a structured build that converts this narrative into portfolio-specific factor shocks without jumping from story to arbitrary numbers.</p>`);
    state.busy = false;
    setQuickReplies([
      { label: "Run Scenario Foundry", action: "run-foundry", primary: true },
      { label: "Compare across portfolios first", action: "compare-portfolios" }
    ]);
    render();
  });
}

function comparePortfolios() {
  setQuickReplies([]);
  addUser("Compare across portfolios first.");
  state.busy = true;

  showTypingThen(
    `<p>I compared the same story across the portfolio universe. The workspace shows why one generic oil scenario would miss the point.</p>`,
    1800
  ).then(() => {
    addLiveSection("Cross-portfolio comparison", crossPortfolioTable(), "Same event, different relevance");
    state.busy = false;
    setQuickReplies([{ label: "Run Scenario Foundry", action: "run-foundry", primary: true }]);
    render();
  });
}

// ============================================================
// FLOW 3 — WATCH MODE
// ============================================================

function enterWatch() {
  state.currentMode = "Watch";
  state.step = "analyze";
  state.inputMode = null;
  state.busy = true;
  setQuickReplies([]);
  resetLiveNotebook("Watch alert center", watchEventCards(), "System brings the story");

  showTypingThen(
    `<p>I'm watching market themes against <strong>${state.selectedPortfolio}</strong>. I found three relevant alerts and put the alert center in the workspace.</p>
     <p>Which theme should we investigate?</p>`,
    2200
  ).then(() => {
    state.busy = false;
    setQuickReplies([
      { label: "Middle East escalation / oil shock",  action: "watch-middle-east", primary: true },
      { label: "Higher-for-longer Fed repricing",     action: "watch-fed" },
      { label: "Credit spread widening",              action: "watch-credit" }
    ]);
    render();
  });
}

function investigateWatch(theme) {
  setQuickReplies([]);
  const labels = {
    "middle-east": "Middle East escalation / oil shock",
    "fed":         "Higher-for-longer Fed repricing",
    "credit":      "Credit spread widening"
  };
  const label = labels[theme] || labels["middle-east"];
  addUser(`Let's investigate: ${label}.`);
  state.busy = true;

  const isMain = theme === "middle-east";
  addLiveSection("Alert relevance map", isMain ? watchMappingWorkspace() : watchEventCards(), "Portfolio match");

  showTypingThen(
    `${loadingCard(["Reading event signals", "Matching against portfolio vulnerabilities", "Checking Discover watchlist", "Preparing Foundry entry"])}
     <p>${isMain
       ? "This event maps directly to the portfolio's top vulnerability: oil shock spilling into rates and credit. I can build a portfolio-specific scenario from this event."
       : "This theme is material for the portfolio's duration and credit exposures and warrants a full scenario build."}</p>
     ${isMain ? "" : ""}`,
    2500
  ).then(() => {
    state.busy = false;
    addAI(`<p>The alert maps cleanly to the portfolio's vulnerability. I can route this into Scenario Foundry from the Watch alert.</p>`);
    setQuickReplies([
      { label: "Build scenario from this alert",    action: "watch-build", primary: true },
      { label: "Show other affected portfolios",    action: "watch-other" }
    ]);
    render();
  });
}

function watchOtherPortfolios() {
  setQuickReplies([]);
  addUser("Show other affected portfolios.");
  state.busy = true;

  showTypingThen(
    `<p>I checked the same event across the full portfolio set. The workspace shows the different transmission paths.</p>`,
    1800
  ).then(() => {
    addLiveSection("Cross-portfolio alert comparison", crossPortfolioTable(), "Affected portfolios");
    state.busy = false;
    setQuickReplies([{ label: "Build scenario for Global Multi-Asset Income", action: "watch-build", primary: true }]);
    render();
  });
}

// ============================================================
// FLOW 4 — DISCOVER MODE
// ============================================================

function enterDiscover() {
  state.currentMode = "Discover";
  state.step = "analyze";
  state.inputMode = null;
  state.busy = true;
  setQuickReplies([]);
  resetLiveNotebook("Discover driver map", discoverThemeDashboard(), "Portfolio reveals the story");

  showTypingThen(
    `<p>I'll start portfolio-first. No market event yet &mdash; just the portfolio telling us which themes and drivers matter most.</p>
     ${loadingCard(["Scanning exposure concentrations", "Linking factors to loss drivers", "Ranking risk themes", "Preparing calibration question"])}`,
    2800
  ).then(() =>
    showTypingThen(
      `<p>I found the portfolio's main vulnerability themes and placed the diagnostic map in the workspace.</p>
       <p>Before we create any scenario, what drawdown level would you be comfortable using as a reverse-stress target?</p>`,
      1800
    )
  ).then(() => {
    state.busy = false;
    setQuickReplies([
      { label: "Comfort level: -3%", action: "discover-comfort-3" },
      { label: "Comfort level: -4%", action: "discover-comfort-4", primary: true },
      { label: "Comfort level: -5%", action: "discover-comfort-5" }
    ]);
    render();
  });
}

function setDiscoverComfort(level) {
  setQuickReplies([]);
  state.discoverComfort = level;
  addUser(`Use ${level} as the reverse-stress comfort level.`);
  state.busy = true;
  addLiveSection("Reverse-stress calibration", discoverCalibrationWorkspace(level), `Comfort level ${level}`);

  showTypingThen(
    `<p>Got it. I used <strong>${level}</strong> as the PnL calibration target and identified the factor themes most likely to matter.</p>
     <p>This is still a discovery output, not a final scenario. We can monitor the themes, or carry this calibration into Foundry when a story arrives.</p>`,
    1900
  ).then(() => {
    state.busy = false;
    setQuickReplies([
      { label: "Monitor oil + rates + credit", action: "discover-save", primary: true },
      { label: "Investigate the driver map", action: "discover-oil" },
      { label: "Build scenario using this calibration", action: "discover-build" }
    ]);
    render();
  });
}

function investigateDiscover(label) {
  setQuickReplies([]);
  const titles = {
    oil:       "Oil + rates + credit stagflation",
    credit:    "Credit-led risk-off",
    rates:     "Rates bear steepening",
    "pure-oil":"Pure oil shock"
  };
  const title = titles[label] || titles.oil;
  addUser(`Investigate: ${title}.`);
  state.busy = true;

  const isMain = label === "oil";

  showTypingThen(
    `${loadingCard(["Expanding driver path", "Identifying trigger events", "Mapping to watch signals", "Saving calibration notes"])}
     <p>${isMain
       ? "Good choice. This is the portfolio's most material driver cluster: oil only matters when it pulls inflation, rates, and credit with it."
       : `I'll expand this driver cluster and keep it available for calibration later.`}</p>`,
    2400
  ).then(() => {
    state.busy = false;
    addLiveSection("Driver investigation notes", discoverCalibrationWorkspace(state.discoverComfort || "-4%"), "Saved for calibration");
    addAI(`<p>I saved the driver map. We can monitor it, or use it as calibration input when building a scenario.</p>`);
    setQuickReplies([
      { label: "Build scenario from this vulnerability", action: "discover-build", primary: true },
      { label: "Save vulnerability to watchlist",        action: "discover-save" }
    ]);
    render();
  });
}

// ============================================================
// SCENARIO FOUNDRY — 8 STEPS
// ============================================================

function runFoundry(sourceLabel) {
  state.currentMode = "Foundry";
  state.step = "analyze";
  state.scenarioState.foundry = "Running";
  state.scenarioState.source  = sourceLabel || "User concern";
  state.busy = true;
  state.foundryStep = 0;
  setQuickReplies([]);
  resetLiveNotebook("Scenario Foundry input", foundryWorkspaceIntro(sourceLabel), "Build source");

  addAI(`<p>Running the <strong>Scenario Foundry</strong>${sourceLabel ? ` from <em>${sourceLabel}</em>` : ""}. I'll work through the build and pause at key checkpoints for your feedback.</p>`);
  render();

  sequence([
    foundryStep1,
    foundryStep2,
    foundryStep3,
    foundryHistoricalFeedback
  ]);
}

function setFS(n) {
  state.foundryStep = n;
  render();
}

function foundryStep1() {
  setFS(1);
  return showTypingThen(
    `${fBadge(1, "News Briefer / Market Monitor")}
     <p>I'll first anchor the scenario in the current market state. This gives the scenario a live signal anchor rather than starting from a generic stress template.</p>
     ${loadingCard(["Checking recent market signals", "Tracking relevant factor moves", "Summarising current state"])}`,
    2000
  ).then(() => showTypingThen(
    `<p>Market state is anchored. I added the signal table to the workspace.</p>`,
    1200
  ).then(() => addLiveSection("Current market state", currentMarketStateCard(), "News Briefer")));
}

function foundryStep2() {
  setFS(2);
  return showTypingThen(
    `${fBadge(2, "Catalyst Creator")}
     <p>I'll map the causal chain &mdash; how this event could play out step by step and become a market scenario.</p>`,
    1500
  ).then(() => showTypingThen(
    `<p>Catalyst path is mapped. I added the causal chain to the workspace.</p>`,
    1200
  ).then(() => addLiveSection("Catalyst path", catalystPathCard(), "Causal chain")));
}

function foundryStep3() {
  setFS(3);
  return showTypingThen(
    `${fBadge(3, "Historical Harvester")}
     <p>I'll identify historical episodes that act as calibration precedents. These are not exact replays &mdash; they help bound plausibility and severity.</p>
     ${loadingCard(["Searching historical episode database", "Matching on shock type and transmission", "Extracting calibration priors"])}`,
    1800
  ).then(() => showTypingThen(
    `<p>Historical analogues are selected. I added the calibration precedents to the workspace.</p>`,
    1200
  ).then(() => addLiveSection("Historical analogues", historicalAnaloguesCard(), "Calibration precedents")));
}

function foundryHistoricalFeedback() {
  state.busy = false;
  setQuickReplies([
    { label: "Historical set looks good", action: "foundry-historical-ok", primary: true },
    { label: "Add 1970s oil shock as context", action: "foundry-historical-add" }
  ]);
  addAI(`<p><strong>Human checkpoint:</strong> Did I miss any relevant historical precedent before I move into Factor Selection?</p>`);
  render();
}

function continueAfterHistorical(feedback) {
  setQuickReplies([]);
  state.busy = true;
  if (feedback) addUser(feedback);
  sequence([
    foundryStep4,
    foundryFactorFeedback
  ]);
}

function foundryFactorFeedback() {
  state.busy = false;
  addLiveSection("Factor Selection", factorSelectionCard(), "Map, retrieve, choose");
  setQuickReplies([
    { label: "Factor set looks complete", action: "foundry-factor-ok", primary: true },
    { label: "Add oil volatility as a candidate", action: "foundry-factor-add" }
  ]);
  addAI(`<p><strong>Human checkpoint:</strong> Did we miss any key factor before I calibrate scenario shocks?</p>`);
  render();
}

function continueAfterFactors(feedback) {
  setQuickReplies([]);
  state.busy = true;
  if (feedback) addUser(feedback);
  sequence([
    foundryStep7,
    foundryShockFeedback
  ]);
}

function foundryShockFeedback() {
  state.busy = false;
  addLiveSection("Scenario shock menu", shockMenuCard(), "Shock Simulator");
  setQuickReplies([
    { label: "Review diagnostics", action: "foundry-diagnostics", primary: true },
    { label: "Continue to portfolio impact", action: "foundry-impact" },
    { label: "Make credit widening less severe", action: "foundry-shocks-adjust" }
  ]);
  addAI(`<p><strong>Human checkpoint:</strong> I've generated the shock menu. Before applying it to the portfolio, do you want to review scenario plausibility and factor-level diagnostics?</p>`);
  render();
}

function continueAfterShocks(feedback, reviewDiagnostics) {
  setQuickReplies([]);
  state.busy = true;
  if (feedback) addUser(feedback);
  const steps = reviewDiagnostics
    ? [foundryDiagnosticsStep, foundryDiagnosticsFeedback]
    : [foundryStep8, foundryDone];
  sequence(steps);
}

function foundryDiagnosticsStep() {
  setFS(6);
  return showTypingThen(
    `${fBadge(6, "Plausibility & Diagnostics")}
     <p>I'll diagnose the scenario menu before applying it to the portfolio. This checks factor-level shock extremity and joint scenario extremity.</p>
     ${loadingCard(["Computing factor shock Z-scores", "Checking joint scenario extremity", "Comparing against 95% envelope", "Building plausibility frontier"])}`,
    2200
  ).then(() => showTypingThen(
    `<div class="ai-card diagnostics-card">
       <h3 style="margin-bottom:10px">Plausibility & Diagnostics</h3>
       ${plausibilityNote()}
       ${plausibilityCards()}
       ${frontierPlot()}
       <h4 style="margin:16px 0 8px">Factor shock Z-score heatmap</h4>
       ${zScoreHeatmap()}
       <h4 style="margin:16px 0 8px">Selected Scenario B — key market factor impacts</h4>
       ${factorImpactBars("B")}
       <p class="insight-note">Scenario B is highlighted because it is the largest portfolio loss that remains inside the 95% plausibility envelope. Scenario C has a larger loss, but breaches the envelope.</p>
     </div>`,
    2600
  ));
}

function foundryDiagnosticsFeedback() {
  state.busy = false;
  addLiveSection("Plausibility & Diagnostics", foundryDiagnosticsWorkspace(), "95% envelope");
  setQuickReplies([
    { label: "Continue to portfolio impact", action: "foundry-impact", primary: true },
    { label: "Adjust shocks before impact", action: "foundry-shocks-adjust" }
  ]);
  addAI(`<p><strong>Human checkpoint:</strong> Diagnostics are complete. Should I use this plausibility-constrained scenario menu for portfolio impact?</p>`);
  render();
}

function foundryStep4() {
  setFS(4);
  return showTypingThen(
    `${fBadge(4, "Factor Selection")}
     <p>Now I’ll do Factor Selection in one pass: translate the narrative into factor intents, retrieve plausible candidates, and choose a final explainable factor set.</p>`,
    1800
  ).then(() => showTypingThen(
    `<div class="ai-card">
       <h3 style="margin-bottom:10px">Factor Selection</h3>
       ${tbl(["Theme","Candidate factors considered","Selected factor","Why selected"],[
         ["Oil supply shock", "Brent, WTI, energy equity sector", "Brent crude", "Closest liquid proxy for global supply shock"],
         ["Inflation repricing", "US 5Y breakeven, US 10Y breakeven", "US 5Y breakeven", "Medium-term inflation channel"],
         ["Fed / rates", "US 2Y, US 5Y, US 10Y yields", "US 5Y yield", "Delayed cuts + portfolio duration relevance"],
         ["Credit risk-off", "CDX IG, CDX HY, IG OAS, HY OAS", "CDX HY", "Higher-beta credit channel"],
         ["EM stress", "EM FX basket, EM local rates, EMBI", "EM FX basket", "Captures USD/risk-off spillover"],
         ["Equity risk sentiment", "S&amp;P 500, MSCI World, VIX", "S&amp;P 500", "Broad equity drawdown proxy"]
       ])}
       <div class="rejected-box">
         <strong>Rejected or lower-priority candidates</strong>
         <ul>
           <li>WTI crude &mdash; redundant with Brent for this scenario</li>
           <li>Defence equities &mdash; thematic but less central to portfolio risk</li>
           <li>Shipping rates &mdash; relevant but not a core modeled factor here</li>
           <li>Long-end breakevens &mdash; weaker fit for policy-repricing channel</li>
         </ul>
       </div>
       <p class="insight-note">Factor Selection keeps the set small enough to explain while still covering oil, inflation, rates, credit, FX, and equity channels.</p>
     </div>`,
    2400
  ));
}

function foundryStep7() {
  setFS(5);
  return showTypingThen(
    `${fBadge(5, "Shock Simulator")}
     <p>I'll generate a menu of plausible factor-shock scenarios using the catalyst path, historical analogues, selected factors, and portfolio context.</p>
     ${loadingCard(["Calibrating oil shock severity range", "Mapping inflation transmission", "Estimating credit widening paths", "Building scenario menu"])}`,
    2000
  ).then(() => showTypingThen(
    `<div class="ai-card">
       <h3 style="margin-bottom:10px">Scenario shock menu</h3>
       ${tbl(["Scenario","Logic","Key shocks","Est. impact"],[
         ["A &mdash; Contained Oil Shock",    "Oil rises, inflation / rates response contained",         "Brent +20%, 5Y +15bp, CDX HY +25bp, S&amp;P &minus;2%",                     "<span class='badge green'>&minus;0.8%</span>"],
         ["B &mdash; Stagflation Repricing",  "Oil feeds inflation, Fed delayed, credit weakens",        "Brent +35%, BEI +35bp, 5Y +60bp, CDX HY +90bp, S&amp;P &minus;7%",         "<span class='badge red'>&minus;3.7%</span>"],
         ["C &mdash; Credit Risk-Off",        "Geopolitical risk spills into broader market risk-off",   "Brent +20%, CDX HY +140bp, EM FX &minus;5%, S&amp;P &minus;10%",            "<span class='badge red'>&minus;4.5%</span>"]
       ])}
       <div class="rec-box">
         <strong style="color:#1f4fb5">Recommendation:</strong>
         Scenario B is the most useful client discussion scenario &mdash; it best matches the catalyst path and the portfolio's top vulnerability.
       </div>
     </div>`,
    2100
  ));
}

function foundryStep8() {
  setFS(7);
  return showTypingThen(
    `${fBadge(7, "Portfolio Impact")}
     <p>I'll decompose Scenario B into portfolio drivers to show where the loss is coming from.</p>`,
    1500
  ).then(() => showTypingThen(
    `<div class="ai-card">
       <h3 style="margin-bottom:10px">Scenario B &mdash; Impact decomposition</h3>
       ${tbl(["Driver","Contribution","Note"],[
         ["Duration / rates",         "<span class='impact'>&minus;1.4%</span>", "Long duration; US 5Y yield +60bp is the primary hurt"],
         ["Credit spreads",           "<span class='impact'>&minus;1.5%</span>", "High IG / HY beta; CDX HY +90bp"],
         ["EM FX risk-off",           "<span class='impact'>&minus;0.5%</span>", "Moderate EM FX exposure; USD stronger"],
         ["Equity drawdown",          "<span class='impact'>&minus;0.6%</span>", "Equity risk component; S&amp;P &minus;7%"],
         ["Energy equity offset",     "<span class='positive'>+0.3%</span>",     "Small energy position partly offsets the oil shock"],
         ["Inflation-linked hedge",   "<span class='muted'>~0.0%</span>",        "Modest hedge; not enough to offset the rates move"],
         ["<strong>Total</strong>",   "<span class='impact'><strong>&minus;3.7%</strong></span>", "Driven by rates + credit, not oil itself"]
       ])}
       <p class="insight-note">The portfolio is not mainly hurt by oil. It is hurt by the rates and credit repricing that follows the oil shock.</p>
     </div>`,
    2000
  ));
}

function foundryDone() {
  setFS(8);
  addLiveSection("Portfolio impact", impactDecompositionCard(), "Impact decomposition");
  state.scenarioState.foundry = "Done";
  state.busy = false;
  state.step = "challenge";
  setQuickReplies([
    { label: "Challenge assumptions",  action: "challenge",       primary: true },
    { label: "View Decision Notes",    action: "decision-notes" },
    { label: "Generate client memo",   action: "client-memo" }
  ]);
  addAI(`<p>Scenario Foundry complete. The recommended scenario is <strong>Scenario B: Stagflation Repricing, estimated impact &minus;3.7%</strong>. The main drivers are rates and credit, not oil itself.</p><p>You can challenge assumptions, view the decision notes, or go straight to the client memo.</p>`);
  render();
}

// ============================================================
// FLOW 5 — CHALLENGE
// ============================================================

function challengeScenario() {
  state.currentMode = "Challenge";
  state.step = "challenge";
  state.inputMode = "challenge";
  setQuickReplies([]);
  addUser("Challenge assumptions.");
  state.busy = true;

  showTypingThen(
    `<p>Scenario B is selected. You can challenge factor assumptions, severity, horizon, or transmission channels. What would you like to change?</p>`,
    1400
  ).then(() => {
    state.busy = false;
    setQuickReplies([
      { label: "What if oil rises more but credit spreads widen less?", action: "challenge-oil",     primary: true },
      { label: "Make it more severe but still plausible",              action: "challenge-severe" },
      { label: "Why are rates up if growth risk is rising?",           action: "challenge-rates" },
      { label: "Compare Scenario B with pure oil shock",               action: "challenge-compare" }
    ]);
    render();
  });
}

function submitChallenge(userText) {
  setQuickReplies([]);
  state.inputMode = null;
  const text = userText || "What if oil rises 50% instead of 35%, but credit spreads widen less?";
  addUser(text);
  state.busy = true;
  addLiveSection("Challenge & refined diagnostics", challengeWorkspaceCard(), "Human edit");

  showTypingThen(
    `<p>Updating Scenario B. A larger oil shock increases inflation pressure and rates impact, but lower credit widening reduces spread losses. The portfolio's partial energy offset means the incremental oil move is partly mitigated. Net loss is still driven mainly by duration and credit.</p>
     <p>I added the revised assumptions and before/after diagnostics to the workspace.</p>
     <p><strong>The portfolio is more sensitive to rates and credit than to oil itself. This challenge confirms that finding.</strong></p>`,
    1500
  ).then(() => {
    state.scenarioState.challenge = "Done";
    state.busy = false;
    setQuickReplies([
      { label: "Review updated plausibility", action: "review-updated-plausibility", primary: true },
      { label: "View Decision Notes",  action: "decision-notes" },
      { label: "Generate client memo", action: "client-memo" }
    ]);
    render();
  });
}

function reviewUpdatedPlausibility() {
  setQuickReplies([]);
  addUser("Review updated plausibility.");
  state.busy = true;
  addLiveSection("Updated plausibility review", challengeWorkspaceCard(), "After human edit");
  showTypingThen(
    `<p>The revised scenario stays inside the 95% plausibility envelope. The oil shock is more extreme, but lower credit contagion reduces joint scenario extremity. I kept the updated diagnostic card open in the workspace.</p>`,
    1100
  ).then(() => {
    state.busy = false;
    setQuickReplies([
      { label: "View Decision Notes", action: "decision-notes", primary: true },
      { label: "Generate client memo", action: "client-memo" }
    ]);
    render();
  });
}

function challengeRates() {
  setQuickReplies([]);
  addUser("Why are rates up if growth risk is rising?");
  state.busy = true;

  showTypingThen(
    `<p>Good challenge. The key is that Scenario B is an <strong>inflationary shock</strong>, not a pure growth shock. Central banks face a dilemma:</p>
     <ul style="margin:8px 0;padding-left:18px;font-size:13px">
       <li style="padding:3px 0">Oil raises inflation &rarr; argues for keeping rates high or hiking</li>
       <li style="padding:3px 0">Growth risk rises &rarr; normally argues for cuts</li>
     </ul>
     <p>In Scenario B, the inflation channel dominates: Fed cut expectations are priced out, so yields rise. If the growth channel dominated, we would build a different scenario (closer to 1970s stagflation with reluctant cuts despite inflation). Scenario B is internally consistent &mdash; rates rise because markets price out cuts, not because the economy is fine.</p>`,
    2000
  ).then(() => {
    state.busy = false;
    setQuickReplies([
      { label: "What if oil rises more but credit spreads widen less?", action: "challenge-oil",    primary: true },
      { label: "View Decision Notes",                                    action: "decision-notes" }
    ]);
    render();
  });
}

function challengeCompare() {
  setQuickReplies([]);
  addUser("Compare Scenario B with pure oil shock.");
  state.busy = true;

  showTypingThen(
    `<p>I compared the pure oil shock against the stagflation path and added the contrast to the workspace.</p>`,
    1200
  ).then(() => {
    addLiveSection("Scenario B vs pure oil shock", scenarioComparisonCard(), "Challenge response");
    state.busy = false;
    setQuickReplies([
      { label: "View Decision Notes",  action: "decision-notes", primary: true },
      { label: "Generate client memo", action: "client-memo" }
    ]);
    render();
  });
}

// ============================================================
// FLOW 6 — DECISION NOTES
// ============================================================

function decisionNotes() {
  state.currentMode = "Explain";
  state.step = "explain";
  setQuickReplies([]);
  addUser("View Decision Notes.");
  state.busy = true;

  showTypingThen(
    `<p>I'll record the full reasoning so the scenario can be reviewed, audited, and revisited. I added the Decision Notes to the workspace.</p>`,
    1200
  ).then(() => {
    addLiveSection("Decision Notes", decisionNotesCard(), "Governance trail");
    state.scenarioState.notes = "Done";
    state.busy = false;
    addAI(`<p><strong>Human checkpoint:</strong> Use the revised scenario and plausibility diagnostics in the client memo?</p>`);
    setQuickReplies([{ label: "Use revised scenario and diagnostics in memo", action: "client-memo", primary: true }]);
    render();
  });
}

// ============================================================
// FLOW 7 — CLIENT MEMO
// ============================================================

function clientMemo() {
  state.currentMode = "Explain";
  state.step = "explain";
  setQuickReplies([]);
  addUser("Generate client memo.");
  state.busy = true;

  showTypingThen(
    `<p>I generated the client-ready explanation and added it to the workspace.</p>`,
    1200
  ).then(() => {
    addLiveSection("Client memo", memoCard(), "Client-ready output");
    state.scenarioState.memo = "Done";
    state.busy = false;
    setQuickReplies([{ label: "Save to Scenario Memory", action: "memory", primary: true }]);
    render();
  });
}

// ============================================================
// FLOW 8 — SCENARIO MEMORY
// ============================================================

function scenarioMemory() {
  state.currentMode = "Memory";
  state.step = "memory";
  setQuickReplies([]);
  addUser("Save to Scenario Memory.");
  state.busy = true;

  showTypingThen(
    `<p>I've saved the complete scenario trail so the team can revisit or refresh it later &mdash; without reconstruction.</p>
     <p class="memory-close"><strong>The second client conversation is no longer a reconstruction exercise.</strong></p>`,
    1200
  ).then(() => {
    addLiveSection("Scenario Memory", memoryCard(), "Saved trail");
    state.scenarioState.memory = "Saved";
    state.busy = false;
    setQuickReplies([
      { label: "Restart demo",              action: "restart",        primary: true },
      { label: "Return to mode selection",  action: "mode-selection" }
    ]);
    render();
  });
}

// ============================================================
// HTML CONTENT GENERATORS
// ============================================================

function fBadge(n, name, sig) {
  return `<div class="foundry-badge-row">
    <span class="foundry-badge">Step ${n} &middot; ${name}</span>
  </div>`;
}

function loadingCard(steps) {
  return `<div class="ai-card" style="margin-bottom:10px">
    <div class="steps">${steps.map(s => `<div class="step">${s}</div>`).join("")}</div>
  </div>`;
}

function exposureSummaryCard() {
  const p = portfolios[state.selectedPortfolio];
  return `<div class="ai-card">
    <div class="embedded-grid">
      ${p.exposures.map(([name, value, level, text, width, color]) => `
        <div class="mini-card">
          <span class="badge ${color}" style="font-size:11px">${level}</span>
          <h3 style="font-size:13px;margin:6px 0 3px">${name}</h3>
          <p style="font-size:13px;margin:0 0 4px"><strong>${value}</strong></p>
          <p class="muted" style="font-size:12px;margin:0 0 6px">${text}</p>
          <div class="bar"><span style="--w:${width}%"></span></div>
        </div>`).join("")}
    </div>
  </div>`;
}

function currentMarketStateCard() {
  return `<div class="workspace-card">
    <h3>Current market state</h3>
    ${tbl(["Market factor","Recent move","Interpretation"],[
      ["Brent crude", "+8%", "Supply-risk premium entering crude markets"],
      ["5Y breakevens", "+20bp", "Inflation expectations repricing higher"],
      ["US 10Y yield", "+15bp", "Rates selloff on delayed-cut pricing"],
      ["HY spreads", "+25bp", "Early risk-off, credit caution building"],
      ["USD vs EM FX", "+1.5%", "Dollar pressure on EM"],
      ["Equities (MSCI)", "&minus;2%", "Risk sentiment beginning to weaken"]
    ])}
    <p class="insight-note">This gives the scenario a real-world anchor: oil is the catalyst but other risk factors are already moving in the same direction.</p>
  </div>`;
}

function catalystPathCard() {
  return `<div class="workspace-card">
    <h3>Catalyst path</h3>
    <ol class="catalyst-steps">
      <li>Middle East escalation raises supply-disruption risk</li>
      <li>Oil moves higher as risk premium enters crude markets</li>
      <li>Energy shock lifts inflation expectations</li>
      <li>Fed cut expectations are pushed out</li>
      <li>Yields rise, hurting duration exposure</li>
      <li>Credit spreads widen as risk appetite weakens</li>
      <li>USD strengthens, pressuring EM FX</li>
    </ol>
    <p class="insight-note">This is not just "oil up"; it is an oil shock becoming an inflation, rates, credit, and FX event.</p>
  </div>`;
}

function historicalAnaloguesCard() {
  return `<div class="workspace-card">
    <h3>Historical analogues</h3>
    ${tbl(["Analogue","Why relevant","What it contributes"],[
      ["Russia / Ukraine 2022", "Energy shock + inflation repricing", "Oil, breakevens, rates, credit response calibration"],
      ["Gulf War 1990", "Oil supply shock + geopolitical risk", "Oil risk-premium behavior and duration of shock"],
      ["Abqaiq 2019", "Oil supply disruption", "Short-lived shock: partial precedent for Scenario A"],
      ["2011 Middle East / oil", "Oil + risk sentiment", "Inflation and risk-off channel interaction"]
    ])}
    <p class="insight-note">These inform the shock menu; no single episode is copied one-for-one.</p>
  </div>`;
}

function thesisCard() {
  return `<div class="ai-card">
    <h3 style="margin-bottom:8px">Extracted market thesis</h3>
    <p class="muted" style="font-size:13px">Middle East escalation raises oil supply risk. Higher oil feeds inflation expectations, delays Fed cuts, pressures duration assets, widens credit spreads, and strengthens the USD against EM FX.</p>
    ${tbl(["Risk channel","Direction","Why it matters"],[
      ["Oil",                  "Up +30&ndash;50%",         "Supply disruption risk; geopolitical risk premium"],
      ["Inflation expectations","Up 20&ndash;40bp",        "Energy shock feeds breakeven inflation"],
      ["Rates",                "Up 40&ndash;70bp",         "Delayed cuts + term-premium repricing"],
      ["Credit spreads",       "Wider 50&ndash;140bp",     "Risk-off + higher funding costs"],
      ["EM FX",                "Weaker 2&ndash;5%",        "Stronger USD + external funding pressure"],
      ["Energy equities",      "Up / partial offset",      "Partial hedge to oil shock for portfolios with exposure"]
    ])}
  </div>`;
}

function watchEventCards() {
  return `<div class="event-grid">
    <div class="event-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px">
        <strong style="font-size:13px">Middle East escalation / oil shock</strong>
        <div class="score red">92</div>
      </div>
      <p style="font-size:12px;margin:4px 0"><strong>Signals:</strong> Brent +8%, inflation breakevens wider, USD stronger</p>
      <p style="font-size:12px;margin:4px 0"><strong>Relevance:</strong> <span class="badge red" style="font-size:10px">High</span></p>
      <p style="font-size:12px;margin:4px 0"><strong>Matched vulnerability:</strong> Oil + rates + credit stagflation</p>
    </div>
    <div class="event-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px">
        <strong style="font-size:13px">Higher-for-longer Fed repricing</strong>
        <div class="score orange">81</div>
      </div>
      <p style="font-size:12px;margin:4px 0"><strong>Signals:</strong> Rate-cut expectations pushed out, yields higher</p>
      <p style="font-size:12px;margin:4px 0"><strong>Relevance:</strong> <span class="badge orange" style="font-size:10px">High</span></p>
      <p style="font-size:12px;margin:4px 0"><strong>Matched vulnerability:</strong> Long duration + credit beta</p>
    </div>
    <div class="event-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px">
        <strong style="font-size:13px">Credit spread widening</strong>
        <div class="score yellow">74</div>
      </div>
      <p style="font-size:12px;margin:4px 0"><strong>Signals:</strong> HY spreads wider, risk appetite weaker</p>
      <p style="font-size:12px;margin:4px 0"><strong>Relevance:</strong> <span class="badge yellow" style="font-size:10px">Medium-high</span></p>
      <p style="font-size:12px;margin:4px 0"><strong>Matched vulnerability:</strong> Spread beta + income portfolio drawdown</p>
    </div>
  </div>`;
}

function watchMappingTable() {
  return tbl(["Event signal","Portfolio implication"],[
    ["Oil higher",            "Energy equity offset helps, but inflation channel matters more"],
    ["Breakevens wider",      "Inflation repricing pressures long-duration assets"],
    ["Fed cuts repriced out", "Long duration under meaningful pressure"],
    ["Credit spreads wider",  "High credit beta creates material drawdown risk"],
    ["USD stronger",          "EM FX exposure vulnerable to USD / risk-off"]
  ]);
}

function crossPortfolioTable() {
  return tbl(["Portfolio","How event lands","Recommended scenario","Est. impact"],[
    ["Global Multi-Asset Income", "Energy offset helps, but duration and credit dominate",          "Stagflation repricing",          "<span class='impact'>&minus;3.7%</span>"],
    ["Energy-Heavy Equity",       "Oil benefits revenue; demand destruction + equity beta matter",  "Oil upside with equity risk-off", "<span class='positive'>+1.2%</span> / <span class='impact'>&minus;2.4%</span>"],
    ["EM Local Debt",             "Oil + USD create FX and local rates stress",                    "EM FX / rates stress",           "<span class='impact'>&minus;4.1%</span>"]
  ]);
}

function vulnerabilityTable() {
  return `<div class="table-wrap">
    <table>
      <thead><tr><th>Rank</th><th>Scenario</th><th>Why it hurts</th><th>Est. loss</th></tr></thead>
      <tbody>
        <tr><td><strong>1</strong></td><td><strong>Oil + rates + credit stagflation</strong></td><td>Long duration + high credit beta; energy only partial offset</td><td><span class="impact">&minus;5.1%</span></td></tr>
        <tr><td>2</td><td>Credit-led risk-off</td><td>HY / IG spread widening and equity drawdown</td><td><span class="impact">&minus;4.4%</span></td></tr>
        <tr><td>3</td><td>Rates bear steepening</td><td>Long duration exposure dominates</td><td><span class="impact">&minus;3.2%</span></td></tr>
        <tr><td>4</td><td>Pure oil shock</td><td>Energy exposure offsets part of the move</td><td><span class="impact">&minus;1.0%</span></td></tr>
      </tbody>
    </table>
  </div>`;
}

function legacyDiscoverPlausibilityReverseStress() {
  return `<div class="ai-card diagnostics-card">
    <h3 style="margin-bottom:8px">Plausibility-constrained reverse stress</h3>
    ${plausibilityNote()}
    <div class="constraint-grid">
      <div class="metric-tile"><span>Constraint</span><strong>95% plausibility envelope</strong></div>
      <div class="metric-tile"><span>Objective</span><strong>Maximize portfolio loss inside envelope</strong></div>
    </div>
    <div class="plausibility-grid">
      ${plausibilityMiniCard("Rates bear steepening", "-3.2%", 88, "Inside 95% envelope", "Inside", false)}
      ${plausibilityMiniCard("Oil + rates + credit stagflation", "-3.7%", 94, "Inside 95% envelope", "Recommended", true)}
      ${plausibilityMiniCard("Credit risk-off cascade", "-4.5%", 98, "Outside 95% envelope", "Outside", false)}
      ${plausibilityMiniCard("Pure oil shock", "-0.8%", 72, "Inside 95% envelope", "Inside", false)}
    </div>
    ${frontierPlot()}
  </div>`;
}

function plausibilityMiniCard(name, impact, percentile, status, badge, recommended) {
  const outside = percentile > 95;
  return `<div class="plausibility-card ${recommended ? "recommended" : ""} ${outside ? "outside" : ""}">
    <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">
      <h4>${name}</h4>
      <span class="badge ${outside ? "red" : recommended ? "purple" : "green"}">${badge}</span>
    </div>
    <div class="plausibility-kpis">
      <span>Impact <strong class="impact">${impact}</strong></span>
      <span>${percentile}th percentile</span>
    </div>
    <div class="meter"><span style="--w:${percentile}%"></span><i style="left:95%"></i></div>
    <small class="${outside ? "impact" : "positive"}">${status}</small>
  </div>`;
}

function plausibilityNote() {
  return `<p class="diagnostic-note">Plausibility is an illustrative statistical diagnostic based on factor shock Z-scores and joint scenario extremity. It is not a forecast probability.</p>
  <p class="muted" style="font-size:12px">Individual factor Z-score = shock / historical scenario-horizon volatility. Scenario-level plausibility is based on joint factor shock extremity, conceptually similar to a Mahalanobis-style distance.</p>`;
}

function plausibilityCards() {
  return `<div class="plausibility-grid">
    ${["A","B","C"].map(k => {
      const s = SCENARIO_DIAGNOSTICS[k];
      return plausibilityMiniCard(s.name, s.impact, s.percentile, s.status, s.recommended ? "Recommended" : s.percentile > 95 ? "Outside" : "Inside", s.recommended);
    }).join("")}
  </div>`;
}

function zScoreHeatmap() {
  return `<div class="z-heatmap">
    <div class="zh-head">Market factor</div>
    <div class="zh-head">Scenario A</div>
    <div class="zh-head">Scenario B</div>
    <div class="zh-head">Scenario C</div>
    ${FACTOR_UNIVERSE.map(factor => `
      <div class="zh-factor">${factor}</div>
      ${["A","B","C"].map(k => {
        const [shock, z] = SCENARIO_DIAGNOSTICS[k].factors[factor];
        return `<div class="zh-cell ${zClass(z)}"><strong>${shock}</strong><span>z ${z > 0 ? "+" : ""}${z.toFixed(1)}</span></div>`;
      }).join("")}
    `).join("")}
  </div>`;
}

function factorImpactBars(key) {
  const scenario = SCENARIO_DIAGNOSTICS[key];
  return `<div class="factor-bars">
    ${FACTOR_UNIVERSE.map(factor => {
      const [shock, z] = scenario.factors[factor];
      const mag = Math.min(100, Math.abs(z) / 3 * 100);
      return `<div class="factor-bar-row">
        <span>${factor}</span>
        <strong>${shock}</strong>
        <div class="diag-bar"><span class="${z < 0 ? "negative" : ""}" style="--w:${mag}%"></span></div>
        <em>z ${z > 0 ? "+" : ""}${z.toFixed(1)}</em>
      </div>`;
    }).join("")}
  </div>`;
}

function frontierPlot() {
  const points = [
    { key: "A", x: 72, y: 18, label: "A", note: "Contained" },
    { key: "B", x: 94, y: 74, label: "B", note: "Largest inside 95%" },
    { key: "C", x: 98, y: 92, label: "C", note: "Outside envelope" }
  ];
  return `<div class="frontier-card">
    <div class="frontier-title">
      <strong>Plausibility vs portfolio impact frontier</strong>
      <span>95% envelope</span>
    </div>
    <div class="frontier-plot">
      <div class="envelope-line" style="left:95%"></div>
      ${points.map(p => `<div class="frontier-point ${p.key === "B" ? "best" : p.key === "C" ? "outside" : ""}" style="left:${p.x}%;bottom:${p.y}%"><span>${p.label}</span><em>${p.note}</em></div>`).join("")}
      <div class="axis x">Scenario extremity / plausibility percentile →</div>
      <div class="axis y">Portfolio loss ↑</div>
    </div>
  </div>`;
}

function zScoreHeatmap() {
  const maxAbs = 3;
  return `<div class="z-visual">
    <div class="z-legend">
      <span><i class="z-low"></i>|z| &lt; 1</span>
      <span><i class="z-medium"></i>1-2</span>
      <span><i class="z-high"></i>2-3</span>
      <span><i class="z-extreme"></i>3+</span>
    </div>
    <div class="z-visual-head"><span>Factor</span><span>A</span><span>B</span><span>C</span></div>
    ${FACTOR_UNIVERSE.map(factor => `
      <div class="z-visual-row">
        <strong>${factor}</strong>
        ${["A","B","C"].map(k => {
          const [shock, z] = SCENARIO_DIAGNOSTICS[k].factors[factor];
          const mag = Math.max(18, Math.min(100, Math.abs(z) / maxAbs * 100));
          return `<div class="z-dot-cell ${zClass(z)}" title="${factor} ${SCENARIO_DIAGNOSTICS[k].shortName}: ${shock}, z ${z > 0 ? "+" : ""}${z.toFixed(1)}">
            <span style="--size:${mag}%"></span>
            <em>${shock}<br>z ${z > 0 ? "+" : ""}${z.toFixed(1)}</em>
          </div>`;
        }).join("")}
      </div>
    `).join("")}
  </div>`;
}

function frontierPlot() {
  const toX = (percentile) => 44 + ((percentile - 65) / 35) * 456;
  const toY = (loss) => 246 - (Math.abs(loss) / 5) * 196;
  const points = [
    { key: "A", p: 72, loss: -0.8, label: "A", note: "Contained oil shock", cls: "" },
    { key: "B", p: 94, loss: -3.7, label: "B", note: "Largest inside 95%", cls: "best" },
    { key: "C", p: 98, loss: -4.5, label: "C", note: "Outside envelope", cls: "outside" }
  ];
  return `<div class="frontier-card">
    <div class="frontier-title">
      <strong>Plausibility vs portfolio impact frontier</strong>
      <span>95% envelope</span>
    </div>
    <svg class="frontier-svg" viewBox="0 0 560 310" role="img" aria-label="Plausibility versus portfolio impact frontier">
      <rect x="44" y="28" width="456" height="218" rx="8" fill="#f8fbff" stroke="#d9e2ef"></rect>
      <rect x="${toX(95)}" y="28" width="${500 - toX(95)}" height="218" fill="rgba(193,63,58,0.08)"></rect>
      <line x1="${toX(95)}" y1="28" x2="${toX(95)}" y2="246" stroke="#c13f3a" stroke-width="2" stroke-dasharray="5 5"></line>
      ${[70,80,90,100].map(t => `<line x1="${toX(t)}" y1="28" x2="${toX(t)}" y2="246" stroke="#e6edf5"></line><text x="${toX(t)}" y="268" text-anchor="middle">${t}</text>`).join("")}
      ${[1,2,3,4,5].map(t => `<line x1="44" y1="${toY(-t)}" x2="500" y2="${toY(-t)}" stroke="#e6edf5"></line><text x="28" y="${toY(-t)+4}" text-anchor="middle">-${t}%</text>`).join("")}
      <text x="272" y="296" text-anchor="middle">Scenario extremity percentile</text>
      <text x="14" y="136" transform="rotate(-90 14 136)" text-anchor="middle">Portfolio loss</text>
      <text x="${toX(95)+7}" y="43" fill="#a73532" font-weight="800">95%</text>
      <polyline points="${points.map(p => `${toX(p.p)},${toY(p.loss)}`).join(" ")}" fill="none" stroke="#9fb3cf" stroke-width="2"></polyline>
      ${points.map(p => `
        <g class="svg-point ${p.cls}" transform="translate(${toX(p.p)},${toY(p.loss)})">
          <circle r="${p.key === "B" ? 13 : 11}"></circle>
          <text y="4" text-anchor="middle">${p.label}</text>
        </g>
        <text class="frontier-label ${p.cls}" x="${p.key === "C" ? toX(p.p)-8 : toX(p.p)+16}" y="${toY(p.loss)-8}" text-anchor="${p.key === "C" ? "end" : "start"}">${p.note}</text>
      `).join("")}
    </svg>
  </div>`;
}

function challengeDiagnosticsCard() {
  return `<div class="ai-card diagnostics-card">
    <h3 style="margin-bottom:10px">Before / after diagnostics</h3>
    <div class="plausibility-grid">
      <div class="plausibility-card recommended">
        <h4>Original Scenario B</h4>
        <div class="plausibility-kpis"><span>Impact <strong class="impact">-3.7%</strong></span><span>94th percentile</span></div>
        <div class="meter"><span style="--w:94%"></span><i style="left:95%"></i></div>
        <small>Max factor Z: Brent +2.2, CDX HY +1.9</small>
      </div>
      <div class="plausibility-card">
        <h4>Revised Scenario B</h4>
        <div class="plausibility-kpis"><span>Impact <strong class="impact">-3.2%</strong></span><span>91st percentile</span></div>
        <div class="meter"><span style="--w:91%"></span><i style="left:95%"></i></div>
        <small>Max factor Z: Brent +2.8, CDX HY +1.1</small>
      </div>
    </div>
    <p class="insight-note">Reducing credit spread widening lowers both portfolio loss and joint scenario extremity, even though the oil shock is larger. The revised scenario remains severe but becomes more internally plausible because broad credit contagion is reduced.</p>
  </div>`;
}

function zClass(z) {
  const a = Math.abs(z);
  if (a >= 3) return "z-extreme";
  if (a >= 2) return "z-high";
  if (a >= 1) return "z-medium";
  return "z-low";
}

function assumptionTable() {
  return `<div class="ai-card">
    <h3 style="margin-bottom:10px">Updated assumptions &mdash; Scenario B revised</h3>
    <div style="overflow-x:auto">
      <table style="width:100%;min-width:360px;border-collapse:collapse">
        <thead><tr>
          <th style="padding:8px 10px;background:#f8fafc;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0.04em;border-bottom:1px solid var(--line)">Assumption</th>
          <th style="padding:8px 10px;background:#f8fafc;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0.04em;border-bottom:1px solid var(--line)">Original</th>
          <th style="padding:8px 10px;background:#f8fafc;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0.04em;border-bottom:1px solid var(--line)">Revised</th>
          <th style="padding:8px 10px;background:#f8fafc;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0.04em;border-bottom:1px solid var(--line)">Direction</th>
        </tr></thead>
        <tbody>
          <tr><td style="padding:8px 10px;border-bottom:1px solid var(--line)">Brent crude</td><td style="padding:8px 10px;border-bottom:1px solid var(--line)">+35%</td><td style="padding:8px 10px;border-bottom:1px solid var(--line)">+50%</td><td style="padding:8px 10px;border-bottom:1px solid var(--line)"><span class="impact">&uarr; Higher</span></td></tr>
          <tr><td style="padding:8px 10px;border-bottom:1px solid var(--line)">US 5Y yield</td><td style="padding:8px 10px;border-bottom:1px solid var(--line)">+60bp</td><td style="padding:8px 10px;border-bottom:1px solid var(--line)">+70bp</td><td style="padding:8px 10px;border-bottom:1px solid var(--line)"><span class="impact">&uarr; Higher</span></td></tr>
          <tr><td style="padding:8px 10px;border-bottom:1px solid var(--line)">CDX HY</td><td style="padding:8px 10px;border-bottom:1px solid var(--line)">+90bp</td><td style="padding:8px 10px;border-bottom:1px solid var(--line)">+50bp</td><td style="padding:8px 10px;border-bottom:1px solid var(--line)"><span class="positive">&darr; Lower</span></td></tr>
          <tr><td style="padding:8px 10px;border-bottom:1px solid var(--line)">S&amp;P 500</td><td style="padding:8px 10px;border-bottom:1px solid var(--line)">&minus;7%</td><td style="padding:8px 10px;border-bottom:1px solid var(--line)">&minus;5%</td><td style="padding:8px 10px;border-bottom:1px solid var(--line)"><span class="positive">&uarr; Less severe</span></td></tr>
          <tr><td style="padding:8px 10px"><strong>Portfolio impact</strong></td><td style="padding:8px 10px">&minus;3.7%</td><td style="padding:8px 10px"><strong>&minus;3.2%</strong></td><td style="padding:8px 10px"><span class="positive">&uarr; Less severe</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>`;
}

function decisionNotesCard() {
  return `<div class="ai-card">
    <h3 style="margin-bottom:12px">Decision Notes &mdash; Oil Shock / Stagflation Scenario</h3>
    <div class="dn-section">
      <h4>Why this scenario matters</h4>
      <p>The event matched the portfolio's top vulnerability: oil shock spilling into rates and credit. The portfolio is long duration and high credit beta, making a stagflation path more damaging than a pure commodity shock.</p>
    </div>
    <div class="dn-section">
      <h4>Diagnostic summary</h4>
      <p>Scenario B was selected because it is the largest portfolio-relevant loss inside the 95% plausibility envelope. Scenario C creates a larger loss, but it breaches the illustrative plausibility threshold at the 98th percentile.</p>
      <ul>
        <li>Factor Z-scores were reviewed across the 15-factor market universe.</li>
        <li>Original Scenario B plausibility: 94th percentile, with max factor Z-scores from Brent crude (+2.2) and CDX HY (+1.9).</li>
        <li>Human edit reduced the plausibility percentile from 94 to 91.</li>
        <li>Final scenario remains severe but plausible.</li>
        <li>Diagnostics are illustrative and not a forecast probability.</li>
      </ul>
    </div>
    <div class="dn-section">
      <h4>Why these factors were selected</h4>
      <p>Factor Selection mapped the story into six themes, retrieved plausible factor candidates, and chose Brent crude, US 5Y breakeven, US 5Y yield, CDX HY, EM FX basket, and S&amp;P 500 for relevance and parsimony &mdash; rejecting redundant or weakly-linked candidates including WTI crude, defence equities, shipping rates, and regional equity indices.</p>
    </div>
    <div class="dn-section">
      <h4>Why scenario shocks were chosen</h4>
      <p>Shock Simulator combined the catalyst path with historical analogues (Russia/Ukraine 2022 at moderate severity). Scenario B reflects an oil shock that becomes a stagflation repricing &mdash; consistent with precedent and with the catalyst path.</p>
    </div>
    <div class="dn-section">
      <h4>Human challenge incorporated</h4>
      <ul>
        <li>Brent crude changed from +35% to +50%</li>
        <li>CDX HY widening changed from +90bp to +50bp</li>
        <li>Rationale: higher oil severity but less broad credit contagion</li>
        <li>Revised portfolio impact: &minus;3.2%</li>
      </ul>
    </div>
    <div class="dn-section">
      <h4>Key uncertainty</h4>
      <p>Whether central banks treat the oil shock as inflationary or growth-negative. If they cut despite inflation, rates may not rise &mdash; changing the scenario materially.</p>
    </div>
    <div class="dn-section">
      <h4>Limitations</h4>
      <ul>
        <li>Illustrative stress scenario, not a forecast</li>
        <li>Mark-to-market impact only</li>
        <li>Earnings and cash-flow effects not decomposed</li>
        <li>Requires expert review before formal use</li>
      </ul>
    </div>
  </div>`;
}

function memoCard() {
  return `<div class="ai-card">
    <h3 style="margin-bottom:12px">Client memo &mdash; Global Multi-Asset Income</h3>
    <div class="dn-section">
      <h4>Client question</h4>
      <p>What does the oil shock story mean for my portfolio?</p>
    </div>
    <div class="dn-section">
      <h4>Summary</h4>
      <p>We analyzed the Middle East escalation and oil shock story against the Global Multi-Asset Income Portfolio. The direct oil shock is not the largest standalone risk because energy holdings provide partial offset. The more material vulnerability is a stagflation path where oil raises inflation expectations, delays rate cuts, lifts yields, and pressures credit spreads.</p>
    </div>
    <div class="dn-section">
      <h4>Estimated impact</h4>
      <p><span class="impact" style="font-size:17px;font-weight:900">&minus;3.2% under revised stagflation scenario</span></p>
    </div>
    <div class="dn-section">
      <h4>Plausibility diagnostic</h4>
      <p>The revised scenario remains severe but plausible: 91st percentile inside the illustrative 95% plausibility envelope. This is a diagnostic based on factor shock Z-scores and joint scenario extremity, not a forecast probability.</p>
    </div>
    <div class="dn-section">
      <h4>Top contributors</h4>
      <ol>
        <li style="padding:2px 0">Duration / rates exposure (&minus;1.4%)</li>
        <li style="padding:2px 0">Credit spread exposure (&minus;1.5%)</li>
        <li style="padding:2px 0">EM FX risk-off (&minus;0.5%)</li>
        <li style="padding:2px 0">Equity drawdown (&minus;0.6%)</li>
        <li style="padding:2px 0">Offset from energy equities (+0.3%)</li>
      </ol>
    </div>
    <div class="dn-section">
      <h4>Client talking points</h4>
      <ul>
        <li style="padding:2px 0">The story matters mainly through second-order effects, not the oil headline alone.</li>
        <li style="padding:2px 0">Rates and credit are the larger portfolio vulnerabilities.</li>
        <li style="padding:2px 0">Energy exposure helps, but does not fully hedge the stagflation path.</li>
        <li style="padding:2px 0">Factor selection was grounded in narrative relevance, candidate retrieval, and portfolio exposure.</li>
        <li style="padding:2px 0">This is a stress scenario, not a forecast.</li>
      </ul>
    </div>
  </div>`;
}

function memoryCard() {
  const items = [
    "Original client concern", "Market monitor snapshot", "Catalyst path",
    "Historical analogues", "Human historical feedback", "Factor Selection output",
    "Human factor feedback", "Scenario candidates A/B/C", "Human shock feedback", "Portfolio impact decomposition",
    "Human challenge", "Revised assumptions", "Decision notes", "Client memo"
  ];
  return `<div class="ai-card memory-record">
    <h3 style="margin-bottom:6px">Oil Shock / Stagflation Scenario &mdash; May 2026</h3>
    <p style="font-size:13px;margin-bottom:10px">
      <strong>Status:</strong> <span class="badge green" style="font-size:11px">Saved</span>
      &nbsp;&nbsp;<strong>Portfolio:</strong> Global Multi-Asset Income
      &nbsp;&nbsp;<strong>Mode:</strong> Ask
    </p>
    <strong style="font-size:12px">Saved trail:</strong>
    <div class="memory-grid" style="margin-top:8px">
      ${items.map(i => `<span class="memory-item">&#10003; ${i}</span>`).join("")}
    </div>
  </div>`;
}

function askWorkspaceCard() {
  return `<div class="workspace-card">
    <h3>Ask Mode workspace</h3>
    <p class="muted">User brings the story. The analyst will extract the thesis, map channels, and build portfolio-aware scenarios.</p>
    <div class="prompt-preview">
      <strong>Ready for:</strong>
      <span>Article paste</span>
      <span>Client concern</span>
      <span>Market question</span>
    </div>
  </div>`;
}

function thesisWorkingCard() {
  return `<div class="workspace-card">
    <h3>Extracting thesis</h3>
    ${loadingCard(["Parsing narrative", "Separating headline from transmission", "Checking portfolio exposure map"])}
  </div>`;
}

function watchMappingWorkspace() {
  return `<div class="workspace-card">
    <h3>Alert relevance map</h3>
    ${watchMappingTable()}
    <p class="insight-note">This is Watch's job: the system brings the story, then explains why it matters for this portfolio before any scenario is built.</p>
  </div>`;
}

function foundryWorkspaceIntro(sourceLabel) {
  return `<div class="workspace-card">
    <h3>Scenario Foundry input</h3>
    <div class="metric-strip">
      <div><span>Source</span><strong>${sourceLabel || "User concern"}</strong></div>
      <div><span>Portfolio</span><strong>${state.selectedPortfolio}</strong></div>
      <div><span>Calibration hint</span><strong>${state.discoverComfort || "None"}</strong></div>
    </div>
    <p class="muted">The Foundry will convert the story into factors, shocks, diagnostics, impact, and reusable notes.</p>
  </div>`;
}

function factorSelectionCard() {
  return `<div class="workspace-card">
    <h3>Factor Selection</h3>
    ${tbl(["Theme","Candidate factors considered","Selected factor","Why selected"],[
      ["Oil supply shock", "Brent, WTI, energy equity sector", "Brent crude", "Closest liquid proxy for global supply shock"],
      ["Inflation repricing", "US 5Y breakeven, US 10Y breakeven", "US 5Y breakeven", "Medium-term inflation channel"],
      ["Fed / rates", "US 2Y, US 5Y, US 10Y yields", "US 5Y yield", "Delayed cuts + portfolio duration relevance"],
      ["Credit risk-off", "CDX IG, CDX HY, IG OAS, HY OAS", "CDX HY", "Higher-beta credit channel"],
      ["EM stress", "EM FX basket, EM local rates, EMBI", "EM FX basket", "Captures USD/risk-off spillover"],
      ["Equity risk sentiment", "S&amp;P 500, MSCI World, VIX", "S&amp;P 500", "Broad equity drawdown proxy"]
    ])}
    <div class="rejected-box">
      <strong>Rejected or lower-priority candidates</strong>
      <ul>
        <li>WTI crude &mdash; redundant with Brent for this scenario</li>
        <li>Defence equities &mdash; thematic but less central to portfolio risk</li>
        <li>Shipping rates &mdash; relevant but not a core modeled factor here</li>
        <li>Long-end breakevens &mdash; weaker fit for policy-repricing channel</li>
      </ul>
    </div>
  </div>`;
}

function shockMenuCard() {
  return `<div class="workspace-card">
    <h3>Scenario shock menu</h3>
    ${tbl(["Scenario","Logic","Key shocks","Est. impact"],[
      ["A &mdash; Contained Oil Shock", "Oil rises, inflation / rates response contained", "Brent +20%, 5Y +15bp, CDX HY +25bp, S&amp;P &minus;2%", "<span class='badge green'>&minus;0.8%</span>"],
      ["B &mdash; Stagflation Repricing", "Oil feeds inflation, Fed delayed, credit weakens", "Brent +35%, BEI +35bp, 5Y +60bp, CDX HY +90bp, S&amp;P &minus;7%", "<span class='badge red'>&minus;3.7%</span>"],
      ["C &mdash; Credit Risk-Off", "Geopolitical risk spills into broader market risk-off", "Brent +20%, CDX HY +140bp, EM FX &minus;5%, S&amp;P &minus;10%", "<span class='badge red'>&minus;4.5%</span>"]
    ])}
    <div class="rec-box"><strong>Recommendation:</strong> Scenario B best matches the catalyst path and the portfolio's top vulnerability.</div>
  </div>`;
}

function impactDecompositionCard() {
  return `<div class="workspace-card">
    <h3>Scenario B &mdash; Impact decomposition</h3>
    ${tbl(["Driver","Contribution","Note"],[
      ["Duration / rates", "<span class='impact'>&minus;1.4%</span>", "Long duration; US 5Y yield +60bp is the primary hurt"],
      ["Credit spreads", "<span class='impact'>&minus;1.5%</span>", "High IG / HY beta; CDX HY +90bp"],
      ["EM FX risk-off", "<span class='impact'>&minus;0.5%</span>", "Moderate EM FX exposure; USD stronger"],
      ["Equity drawdown", "<span class='impact'>&minus;0.6%</span>", "Equity risk component; S&amp;P &minus;7%"],
      ["Energy equity offset", "<span class='positive'>+0.3%</span>", "Small energy position partly offsets the oil shock"],
      ["Inflation-linked hedge", "<span class='muted'>~0.0%</span>", "Modest hedge; not enough to offset the rates move"],
      ["<strong>Total</strong>", "<span class='impact'><strong>&minus;3.7%</strong></span>", "Driven by rates + credit, not oil itself"]
    ])}
    <p class="insight-note">The portfolio is not mainly hurt by oil. It is hurt by the rates and credit repricing that follows the oil shock.</p>
  </div>`;
}

function foundryDiagnosticsWorkspace() {
  return `<div class="workspace-card diagnostics-card">
    <h3>Plausibility & Diagnostics</h3>
    ${plausibilityNote()}
    ${plausibilityCards()}
    ${frontierPlot()}
    <h4>Factor shock Z-score map</h4>
    ${zScoreHeatmap()}
    <h4>Scenario B market factor impacts</h4>
    ${factorImpactBars("B")}
    <p class="insight-note">Scenario B is the largest portfolio loss inside the 95% envelope. Scenario C creates a larger loss, but sits outside the envelope.</p>
  </div>`;
}

function challengeWorkspaceCard() {
  return `<div class="workspace-card">
    ${assumptionTable()}
    ${challengeDiagnosticsCard()}
  </div>`;
}

function scenarioComparisonCard() {
  return `<div class="workspace-card">
    <h3>Scenario B vs pure oil shock</h3>
    ${tbl(["Factor","Pure oil shock (A)","Stagflation repricing (B)","What drives the difference"],[
      ["Brent crude", "+20%", "+35%", "Larger move in Scenario B"],
      ["Rates (5Y)", "+15bp", "+60bp", "Inflation repricing delays Fed cuts"],
      ["CDX HY", "+25bp", "+90bp", "Risk appetite deteriorates more"],
      ["S&amp;P 500", "&minus;2%", "&minus;7%", "Broader equity drawdown"],
      ["Portfolio impact", "&minus;0.8%", "&minus;3.7%", "Rate + credit channel dominates"]
    ])}
    <p class="insight-note">The portfolio's energy exposure helps in Scenario A. But once rates and credit move, that offset becomes insufficient.</p>
  </div>`;
}

function discoverThemeDashboard() {
  return `<div class="workspace-card discover-map">
    <h3>Portfolio vulnerability map</h3>
    <p class="muted">Discover starts without a market story. It highlights drivers that can move portfolio PnL and asks for a drawdown comfort level before calibration.</p>
    <div class="driver-grid">
      ${driverTile("Rates repricing", "6.8y duration", "High", 88, "US 2Y / 5Y / 10Y yields")}
      ${driverTile("Credit widening", "42% NAV spread beta", "High", 86, "CDX IG / CDX HY")}
      ${driverTile("Oil-inflation pass-through", "4% energy offset vs 7% inflation hedge", "Medium", 62, "Brent, breakevens")}
      ${driverTile("USD / EM FX stress", "11% unhedged EM FX", "Medium", 58, "USD index, EM FX basket")}
    </div>
    <div class="theme-ladder">
      <strong>Important theme cluster</strong>
      <span>Oil shock becomes inflation repricing</span>
      <span>Inflation repricing delays Fed cuts</span>
      <span>Rates sell off and credit spreads widen</span>
      <span>USD strength adds EM FX pressure</span>
    </div>
  </div>`;
}

function discoverCalibrationWorkspace(level) {
  return `<div class="workspace-card discover-map">
    <h3>Reverse-stress calibration target</h3>
    <div class="metric-strip">
      <div><span>Comfort PnL</span><strong>${level}</strong></div>
      <div><span>Primary driver</span><strong>Rates + credit</strong></div>
      <div><span>Oil role</span><strong>Catalyst, not main loss</strong></div>
    </div>
    <div class="calibration-board">
      <div>
        <h4>Main factors to calibrate later</h4>
        <ul>
          <li>Brent crude and US 5Y breakevens for inflation impulse</li>
          <li>US 5Y yield for delayed-cut repricing</li>
          <li>CDX HY for credit beta and funding stress</li>
          <li>EM FX basket and USD index for spillover pressure</li>
        </ul>
      </div>
      <div>
        <h4>Watch signals</h4>
        <ul>
          <li>Brent risk premium persists beyond the initial shock</li>
          <li>Breakevens widen while nominal yields rise</li>
          <li>HY spreads widen despite energy equity support</li>
          <li>USD strength transmits into EM FX drawdown</li>
        </ul>
      </div>
    </div>
    <p class="insight-note">This calibration note will be reused later in Scenario Foundry when converting a story into shocks.</p>
  </div>`;
}

function driverTile(name, value, label, width, factors) {
  return `<div class="driver-tile">
    <div><strong>${name}</strong><span class="badge ${width > 80 ? "red" : "yellow"}">${label}</span></div>
    <p>${value}</p>
    <div class="bar"><span style="--w:${width}%"></span></div>
    <small>${factors}</small>
  </div>`;
}

function tbl(headers, rows) {
  return `<div class="table-wrap">
    <table>
      <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>
  </div>`;
}

// Latest definitions keep heavy Foundry outputs in the live workspace instead of the chat transcript.
function foundryStep4() {
  setFS(4);
  return showTypingThen(
    `${fBadge(4, "Factor Selection")}
     <p>Now I'll do Factor Selection in one pass: translate the narrative into factor intents, retrieve plausible candidates, and choose a final explainable factor set.</p>`,
    1500
  ).then(() => showTypingThen(
    `<p>Factor Selection is complete. I added the selected factor set, candidate list, and rejected items to the workspace.</p>`,
    1000
  ));
}

function foundryStep7() {
  setFS(5);
  return showTypingThen(
    `${fBadge(5, "Shock Simulator")}
     <p>I'll generate a menu of factor-shock scenarios using the catalyst path, historical analogues, selected factors, portfolio context, and any Discover calibration target.</p>
     ${loadingCard(["Calibrating oil shock severity range", "Mapping inflation transmission", "Estimating credit widening paths", "Building scenario menu"])}`,
    1900
  ).then(() => showTypingThen(
    `<p>The shock menu is ready. I added the candidate scenarios to the workspace for review.</p>`,
    1000
  ));
}

function foundryDiagnosticsStep() {
  setFS(6);
  return showTypingThen(
    `${fBadge(6, "Plausibility & Diagnostics")}
     <p>I'll diagnose the scenario menu before applying it to the portfolio. This checks factor-level shock extremity and joint scenario extremity.</p>
     ${loadingCard(["Computing factor shock Z-scores", "Checking joint scenario extremity", "Comparing against 95% envelope", "Building plausibility frontier"])}`,
    2000
  ).then(() => showTypingThen(
    `<p>Diagnostics are ready. I added the plausibility cards, frontier, Z-score matrix, and factor impact bars to the workspace.</p>`,
    1000
  ));
}

function foundryStep8() {
  setFS(7);
  return showTypingThen(
    `${fBadge(7, "Portfolio Impact")}
     <p>I'll decompose Scenario B into portfolio drivers to show where the loss is coming from.</p>`,
    1300
  ).then(() => showTypingThen(
    `<p>Impact decomposition is complete. I added the contribution table to the workspace.</p>`,
    1000
  ));
}

// ============================================================
// ACTIONS & EVENTS
// ============================================================

function handleReply(action) {
  if (state.busy) return;

  const map = {
    "mode-ask":       () => { addUser("Ask — I want to test a market question or article against this portfolio."); enterAsk(); },
    "mode-watch":     () => { addUser("Watch — Show me relevant market themes for this portfolio."); enterWatch(); },
    "mode-discover":  () => { addUser("Discover — Tell me what this portfolio is most vulnerable to."); enterDiscover(); },
    "ask-submit":     () => submitAsk(null),
    "compare-portfolios": comparePortfolios,
    "run-foundry":    () => runFoundry("User concern: Middle East oil shock"),
    "foundry-historical-ok": () => continueAfterHistorical("Historical set looks good."),
    "foundry-historical-add": () => continueAfterHistorical("Add the 1970s oil shock as context."),
    "foundry-factor-ok": () => continueAfterFactors("Factor set looks complete."),
    "foundry-factor-add": () => continueAfterFactors("Add oil volatility as a candidate factor."),
    "foundry-diagnostics": () => continueAfterShocks("Review diagnostics.", true),
    "foundry-impact": () => continueAfterShocks("Continue to portfolio impact.", false),
    "foundry-shocks-adjust": () => continueAfterShocks("Make credit widening less severe before impact calculation.", true),
    "challenge":      challengeScenario,
    "challenge-oil":  () => submitChallenge(null),
    "challenge-severe": () => submitChallenge("Make Scenario B more severe but still plausible."),
    "challenge-rates":  challengeRates,
    "challenge-compare": challengeCompare,
    "review-updated-plausibility": reviewUpdatedPlausibility,
    "decision-notes": decisionNotes,
    "client-memo":    clientMemo,
    "memory":         scenarioMemory,
    "watch-middle-east": () => investigateWatch("middle-east"),
    "watch-fed":         () => investigateWatch("fed"),
    "watch-credit":      () => investigateWatch("credit"),
    "watch-other":       watchOtherPortfolios,
    "watch-build":    () => { addUser("Yes, build a scenario from this alert."); runFoundry("Watch alert: Middle East escalation"); },
    "watch-save":     () => showTypingThen(`<p>Saved to the portfolio watchlist. I'll keep monitoring for changes to this event's severity.</p>`, 1200),
    "discover-comfort-3": () => setDiscoverComfort("-3%"),
    "discover-comfort-4": () => setDiscoverComfort("-4%"),
    "discover-comfort-5": () => setDiscoverComfort("-5%"),
    "discover-oil":      () => investigateDiscover("oil"),
    "discover-credit":   () => investigateDiscover("credit"),
    "discover-rates":    () => investigateDiscover("rates"),
    "discover-pure-oil": () => investigateDiscover("pure-oil"),
    "discover-build": () => { addUser("Build a scenario using the Discover calibration."); runFoundry(`Discover calibration: ${state.discoverComfort || "-4%"} PnL target, oil + rates + credit drivers`); },
    "discover-save":  () => showTypingThen(`<p>Saved this vulnerability to the portfolio monitor. I'll keep it linked to oil, inflation, rates, credit, and USD/EM FX triggers.</p>`, 1200),
    "restart":        restart,
    "mode-selection": startRiskProfile
  };

  if (map[action]) map[action]();
}

function bindEvents() {
  document.querySelectorAll("[data-action]").forEach((el) => {
    el.addEventListener("click", () => {
      const a = el.dataset.action;
      if      (a === "start")      { state.view = "portfolio"; state.step = "portfolio"; render(); }
      else if (a === "landing")    { state.view = "landing";   state.step = "portfolio"; render(); }
      else if (a === "risk")       { startRiskProfile(); }
      else if (a === "send-input") {
        if (state.busy) return;
        const input = document.getElementById("chatInput");
        const val   = input ? input.value.trim() : "";
        if (state.inputMode === "challenge") {
          submitChallenge(val || null);
        } else if (state.inputMode === "ask") {
          submitAsk(val || null);
        } else if (val) {
          addUser(val);
          showTypingThen(`<p>Noted. Use the quick reply buttons above to continue, or choose a mode from the options.</p>`, 1200);
        }
        if (input) input.value = "";
      }
    });
  });

  document.querySelectorAll("[data-portfolio]").forEach((el) => {
    el.addEventListener("click", () => { state.selectedPortfolio = el.dataset.portfolio; render(); });
  });

  document.querySelectorAll("[data-reply]").forEach((el) => {
    el.addEventListener("click", () => handleReply(el.dataset.reply));
  });

  const inp = document.getElementById("chatInput");
  if (inp) {
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        document.querySelector("[data-action='send-input']")?.click();
      }
    });
  }
}

// ============================================================
// PROGRESS & SCROLL
// ============================================================

function updateProgress() {
  const order = ["portfolio","risk","mode","analyze","challenge","explain","memory"];
  const idx   = order.indexOf(state.step);
  document.querySelectorAll(".progress span").forEach((span) => {
    const i = order.indexOf(span.dataset.step);
    span.classList.toggle("active", i === idx);
    span.classList.toggle("done",   idx > i && idx !== -1);
  });
}

function scrollChat() {
  window.setTimeout(() => {
    const el = document.getElementById("chatBody");
    if (!el) return;
    slowScrollTo(el, el.scrollHeight, CHAT_SCROLL_DURATION);
  }, 120);
}

function requestChatPosition(mode) {
  nextChatPosition = mode;
}

function restoreChatPosition(previousTop) {
  const el = document.getElementById("chatBody");
  if (!el) return;

  const maxTop = Math.max(0, el.scrollHeight - el.clientHeight);
  if (nextChatPosition === "bottom") {
    el.scrollTop = maxTop;
  } else {
    el.scrollTop = Math.min(previousTop || 0, maxTop);
  }
  nextChatPosition = "preserve";
}

function isChatNearBottom() {
  const el = document.getElementById("chatBody");
  if (!el) return true;
  return el.scrollHeight - el.clientHeight - el.scrollTop < 260;
}

function gentleFollowChat() {
  window.setTimeout(() => {
    const el = document.getElementById("chatBody");
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.clientHeight - el.scrollTop;
    if (distanceFromBottom < 220) {
      slowScrollTo(el, el.scrollHeight, CHAT_SCROLL_DURATION);
    }
  }, 160);
}

function scrollLiveWorkspace(target) {
  window.setTimeout(() => {
    const body = document.querySelector(".live-panel-body");
    if (!body) return;

    if (target === "top") {
      slowScrollTo(body, 0, NOTEBOOK_SCROLL_DURATION);
      return;
    }

    const active = body.querySelector(".live-section[open]");
    if (!active) return;
    const nextTop = Math.max(0, active.offsetTop - body.offsetTop - 8);
    slowScrollTo(body, nextTop, NOTEBOOK_SCROLL_DURATION);
  }, 140);
}

function slowScrollTo(element, targetTop, duration) {
  const maxTop = Math.max(0, element.scrollHeight - element.clientHeight);
  const target = Math.max(0, Math.min(targetTop, maxTop));
  const start = element.scrollTop;
  const distance = target - start;
  if (Math.abs(distance) < 2) return;

  const previous = activeScrolls.get(element);
  if (previous) cancelAnimationFrame(previous);

  if (Math.abs(distance) < SCROLL_JUST_NOTICEABLE) {
    element.scrollTop = target;
    return;
  }

  const startTime = performance.now();
  const adjustedDuration = Math.min(4200, duration + Math.min(1400, Math.abs(distance) * 1.25));
  const ease = (t) => 0.5 - Math.cos(Math.PI * t) / 2;

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / adjustedDuration);
    element.scrollTop = start + distance * ease(progress);
    if (progress < 1) {
      activeScrolls.set(element, requestAnimationFrame(step));
    } else {
      activeScrolls.delete(element);
    }
  }

  activeScrolls.set(element, requestAnimationFrame(step));
}

// ============================================================
// HELPERS
// ============================================================

function inputPlaceholder() {
  if (state.inputMode === "challenge") return "Challenge factor assumptions, severity, horizon, or transmission channels...";
  if (state.inputMode === "ask")       return "I am worried about Middle East tensions. Oil is moving higher...";
  return "Type a message or use the quick replies above...";
}

function headerSubtitle() {
  const map = {
    "Ask":         "User brings the story",
    "Watch":       "System brings the story",
    "Discover":    "Portfolio reveals the story",
    "Foundry":     "Scenario build",
    "Challenge":   "Challenge &amp; refine",
    "Explain":     "Decision notes &amp; client memo",
    "Memory":      "Scenario saved",
    "Risk Profile":"Reviewing portfolio exposures"
  };
  return map[state.currentMode] || "Conversational scenario workspace";
}

function modeBadgeClass() {
  const map = { Ask:"blue", Watch:"cyan", Discover:"purple", Foundry:"orange", Challenge:"red", Memory:"green" };
  return map[state.currentMode] || "yellow";
}

function badgeClass(i) {
  return ["blue","cyan","purple","orange","green"][i % 5];
}

function labelize(k) {
  return k.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase());
}

function restart() {
  Object.assign(state, {
    view: "landing",
    selectedPortfolio: "Global Multi-Asset Income",
    currentMode: "Setup",
    step: "portfolio",
    foundryStep: 0,
    messages: [],
    typing: false,
    quickReplies: [],
    inputMode: null,
    busy: false,
    scenarioState: { source: "—", thesis: "Pending", foundry: "Pending", challenge: "Pending", notes: "Pending", memo: "Pending", memory: "Pending" }
  });
  render();
}

brandButton.addEventListener("click", restart);
render();
