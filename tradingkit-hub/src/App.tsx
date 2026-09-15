import { useMemo, useState } from "react";
import { CopyButton } from "./components/CopyButton";
import { ProductIcon } from "./components/ProductIcon";
import {
  agentSetups,
  firstBacktest,
  mcpEndpoint,
  skillBootstrap,
} from "./data/mcpSetup";
import { products } from "./data/products";
import { prompts } from "./data/prompts";

type Tab = "products" | "setup" | "prompts";

const tabs: { id: Tab; label: string }[] = [
  { id: "products", label: "Products" },
  { id: "setup", label: "MCP Setup" },
  { id: "prompts", label: "Prompts" },
];

export function App() {
  const [tab, setTab] = useState<Tab>("products");
  const [promptFilter, setPromptFilter] = useState("All");
  const categories = useMemo(
    () => ["All", ...new Set(prompts.map((p) => p.category))],
    [],
  );
  const filteredPrompts =
    promptFilter === "All"
      ? prompts
      : prompts.filter((p) => p.category === promptFilter);

  return (
    <div className="page">
      <div className="bg-glow" aria-hidden />
      <div className="bg-grid" aria-hidden />
      <svg
        className="bg-chart"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#E0249A" />
            <stop offset="0.5" stopColor="#8B3FE0" />
            <stop offset="1" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(139,63,224,.16)" />
            <stop offset="1" stopColor="rgba(139,63,224,0)" />
          </linearGradient>
        </defs>
        <path
          d="M0 470 L120 430 L240 452 L360 380 L480 410 L600 300 L720 340 L840 250 L960 286 L1080 190 L1200 226 L1320 140 L1440 170 L1440 600 L0 600 Z"
          fill="url(#chartFill)"
        />
        <path
          d="M0 470 L120 430 L240 452 L360 380 L480 410 L600 300 L720 340 L840 250 L960 286 L1080 190 L1200 226 L1320 140 L1440 170"
          fill="none"
          stroke="url(#chartLine)"
          strokeWidth="2.5"
        />
      </svg>

      <header className="topbar">
        <a className="brand" href="https://tradingkit.com" target="_blank" rel="noreferrer">
          <LogoMark />
          <span className="brand-text">
            <span>TRADING</span>
            <span className="brand-accent">
              KIT<span className="brand-tld">.com</span>
            </span>
          </span>
        </a>
        <nav className="tabs" aria-label="Sections">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              className={tab === item.id ? "tab active" : "tab"}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="content">
        <section className="hero">
          <div className="pill">
            <span className="pill-dot" />
            <span>AI TRADING SUITE · HUB</span>
          </div>
          <h1>
            Everything you need to{" "}
            <span className="gradient-text">trade with AI.</span>
          </h1>
          <p>
            Onboarding hub for the DaviddTech stack — product links, Trader Dev
            MCP setup, and copy-paste research prompts for Cursor and Claude.
          </p>
        </section>

        {tab === "products" && (
          <section className="panel">
            <div className="cards">
              {products.map((product, index) => (
                <a
                  key={product.id}
                  href={product.href}
                  target="_blank"
                  rel="noreferrer"
                  className="card"
                  style={{
                    animationDelay: `${0.08 * index}s`,
                    borderColor: product.border,
                  }}
                >
                  <div className="card-body">
                    <span
                      className="card-icon"
                      style={{
                        background: product.gradient,
                        boxShadow: `0 0 22px ${product.accent}66`,
                      }}
                    >
                      <ProductIcon kind={product.icon} />
                    </span>
                    <div className="card-copy">
                      <div className="card-tag" style={{ color: product.accent }}>
                        {product.tag}
                      </div>
                      <div className="card-title">{product.title}</div>
                      <div className="card-desc">{product.description}</div>
                    </div>
                    <span
                      className="card-cta"
                      style={{
                        background: product.gradient,
                        boxShadow: `0 14px 36px -12px ${product.accent}88`,
                      }}
                    >
                      {product.cta}
                      <ArrowIcon />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {tab === "setup" && (
          <section className="panel setup-panel">
            <div className="setup-intro">
              <h2>Connect Trader Dev MCP</h2>
              <p>
                Trader Dev runs Pine Script backtests for your AI agent. Install
                the SSE endpoint once, then paste the bootstrap prompts below.
              </p>
              <div className="endpoint-box">
                <code>{mcpEndpoint}</code>
                <CopyButton text={mcpEndpoint} label="Copy URL" />
              </div>
            </div>

            <div className="setup-grid">
              {agentSetups.map((agent) => (
                <article key={agent.id} className="setup-card">
                  <h3>{agent.name}</h3>
                  {agent.note && <p className="setup-note">{agent.note}</p>}
                  <pre>{agent.command}</pre>
                  <CopyButton text={agent.command} />
                </article>
              ))}
            </div>

            <div className="prompt-stack">
              <article className="setup-card wide">
                <h3>1. Bootstrap your agent</h3>
                <pre>{skillBootstrap}</pre>
                <CopyButton text={skillBootstrap} />
              </article>
              <article className="setup-card wide">
                <h3>2. Run your first backtest</h3>
                <pre>{firstBacktest}</pre>
                <CopyButton text={firstBacktest} />
              </article>
            </div>

            <p className="disclaimer">
              Research and education only. Backtests are not guarantees. See{" "}
              <a
                href="https://github.com/DaviddTech/ai-trading-agent"
                target="_blank"
                rel="noreferrer"
              >
                ai-trading-agent
              </a>{" "}
              for the full disclaimer.
            </p>
          </section>
        )}

        {tab === "prompts" && (
          <section className="panel">
            <div className="filter-row">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={
                    promptFilter === category ? "filter active" : "filter"
                  }
                  onClick={() => setPromptFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="prompt-grid">
              {filteredPrompts.map((prompt) => (
                <article key={prompt.id} className="prompt-card">
                  <div className="prompt-meta">
                    <span className="prompt-category">{prompt.category}</span>
                    <h3>{prompt.title}</h3>
                  </div>
                  <pre>{prompt.text}</pre>
                  <CopyButton text={prompt.text} />
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="footer-line" />
        <p>
          TradingKit Hub · companion for{" "}
          <a href="https://tradingkit.com" target="_blank" rel="noreferrer">
            TradingKit.com
          </a>{" "}
          by DaviddTech
        </p>
      </footer>
    </div>
  );
}

function LogoMark() {
  return (
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" aria-hidden>
      <defs>
        <linearGradient id="nodeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E0249A" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <g stroke="url(#nodeGrad)" strokeWidth="2" opacity="0.55">
        <line x1="24" y1="34" x2="50" y2="22" />
        <line x1="50" y1="22" x2="74" y2="40" />
        <line x1="24" y1="34" x2="38" y2="60" />
        <line x1="38" y1="60" x2="66" y2="68" />
        <line x1="66" y1="68" x2="74" y2="40" />
        <line x1="50" y1="22" x2="38" y2="60" />
        <line x1="50" y1="50" x2="66" y2="68" />
        <line x1="50" y1="50" x2="24" y2="34" />
      </g>
      <g fill="url(#nodeGrad)">
        <circle cx="50" cy="22" r="6" />
        <circle cx="24" cy="34" r="4.5" />
        <circle cx="74" cy="40" r="5.5" />
        <circle cx="38" cy="60" r="4" />
        <circle cx="66" cy="68" r="5" />
        <circle cx="50" cy="50" r="3.5" />
      </g>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
