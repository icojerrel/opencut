export type AgentSetup = {
  id: string;
  name: string;
  command: string;
  note?: string;
};

export const mcpEndpoint = "https://mcp.trader.dev/sse";

export const agentSetups: AgentSetup[] = [
  {
    id: "cursor",
    name: "Cursor",
    command: `Add MCP server in Settings → MCP:\n\nURL: ${mcpEndpoint}\nTransport: SSE`,
    note: "Or add to ~/.cursor/mcp.json under mcpServers.trader-dev",
  },
  {
    id: "claude",
    name: "Claude Code",
    command: `claude mcp add --transport sse --scope user trader-dev ${mcpEndpoint}`,
  },
  {
    id: "codex",
    name: "Codex",
    command: `codex mcp add trader-dev -- npx -y mcp-remote ${mcpEndpoint}`,
  },
  {
    id: "openclaw",
    name: "OpenClaw / Cline / Continue",
    command: `Register remote SSE MCP server:\n${mcpEndpoint}`,
  },
];

export const skillBootstrap = `Read https://raw.githubusercontent.com/DaviddTech/ai-trading-agent/main/SKILL.md
and help me build an AI hedge fund research desk using Trader Dev MCP.`;

export const firstBacktest = `Backtest a Bollinger Band squeeze breakout on the top 10 Bybit pairs at 1h.
Report profit factor, max drawdown, and stability across symbols.
Reject overfit results.`;
