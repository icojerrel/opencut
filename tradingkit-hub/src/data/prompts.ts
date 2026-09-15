export type Prompt = {
  id: string;
  title: string;
  category: string;
  text: string;
};

export const prompts: Prompt[] = [
  {
    id: "baseline",
    title: "First backtest (baseline only)",
    category: "Research",
    text: `I am going to paste a Pine Script strategy.
Backtest it with Trader Dev on crypto pairs.
Report the baseline first. Do not optimise until we understand the strategy.`,
  },
  {
    id: "quant-math",
    title: "Quant Mathematician mode",
    category: "Strategy creation",
    text: `I want to test a volatility breakout idea on crypto.
Use the Quant Mathematician skill from DaviddTech/ai-trading-agent.
Start with a hypothesis, then write Pine Script with no repaint and no lookahead.`,
  },
  {
    id: "mean-reversion",
    title: "Mean reversion engineer",
    category: "Strategy creation",
    text: `Design a mean-reversion system for crypto using the Mean Reversion Engineer skill.
Include volatility-aware filters and regime detection.
Backtest across multiple pairs and timeframes before reporting.`,
  },
  {
    id: "optimizer",
    title: "Fork and improve existing strategy",
    category: "Optimization",
    text: `Search Trader Dev for existing strategies related to trend following.
Fork the most promising one and improve it one variable at a time.
Compare each iteration against the baseline with compare_backtests.`,
  },
  {
    id: "position",
    title: "Position sizing lab",
    category: "Risk",
    text: `Use the Position Optimizer skill on my latest strategy.
Test leverage, fractional Kelly, vol-targeting, and drawdown throttling.
Keep entries frozen — only change sizing and risk controls.`,
  },
  {
    id: "robustness",
    title: "Robustness audit",
    category: "Risk",
    text: `Audit my latest backtest for overfitting.
Check stability across symbols and nearby timeframes.
Label the verdict as Reject, Watchlist, Incubate, Candidate, or Production candidate.`,
  },
];
