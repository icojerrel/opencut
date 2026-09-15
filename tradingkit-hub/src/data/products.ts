export type Product = {
  id: string;
  tag: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  accent: string;
  border: string;
  gradient: string;
  icon: "chart" | "shield" | "factory" | "arena";
};

export const products: Product[] = [
  {
    id: "trader-dev",
    tag: "MCP SERVER · TRADER.DEV",
    title: "Backtest Trades with AI",
    description:
      "Backtest trading strategies with AI. Connect to Claude and research, build and validate edges in plain English.",
    href: "https://trader.dev",
    cta: "Launch Trader.dev",
    accent: "#3B82F6",
    border: "#3B82F633",
    gradient: "linear-gradient(135deg,#3B82F6,#22D3EE)",
    icon: "chart",
  },
  {
    id: "propfirm",
    tag: "FUNDED TRADING",
    title: "PropFirm AI",
    description:
      "Pass your funded challenge with an AI co-pilot — live rule monitoring, drawdown alerts and guided trade execution.",
    href: "https://prop.tradingkit.com",
    cta: "Get Early Access",
    accent: "#E0249A",
    border: "#E0249A33",
    gradient: "linear-gradient(135deg,#E0249A,#8B3FE0)",
    icon: "shield",
  },
  {
    id: "strategy-factory",
    tag: "BY DAVIDDTECH",
    title: "Strategy Factory",
    description:
      "Strategies built, backtested and live-traded by DaviddTech. Proven systems you can follow and deploy.",
    href: "https://strategyfactory.ai",
    cta: "Explore Strategies",
    accent: "#8B3FE0",
    border: "#8B3FE033",
    gradient: "linear-gradient(135deg,#8B3FE0,#6366F1)",
    icon: "factory",
  },
  {
    id: "arena",
    tag: "LLM VS LLM",
    title: "AI Trading Arena",
    description:
      "Watch trading AIs go head-to-head. An arena where the best LLMs compete live to out-trade each other.",
    href: "https://aitradingarena.com",
    cta: "Enter the Arena",
    accent: "#2DD4A7",
    border: "#2DD4A733",
    gradient: "linear-gradient(135deg,#2DD4A7,#3B82F6)",
    icon: "arena",
  },
];
