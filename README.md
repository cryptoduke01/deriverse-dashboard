# Deriverse Trading Analytics Dashboard

A comprehensive trading analytics solution for [Deriverse](https://deriverse.gitbook.io/deriverse)—a next-gen, fully on-chain, decentralized Solana trading ecosystem. This dashboard provides a professional trading journal and portfolio analysis for active traders.

## Features

- **Total PnL tracking** with visual performance indicators (green/red)
- **Trading volume and fee analysis** (total volume, total fees, cumulative fees)
- **Win rate statistics** and trade count metrics
- **Average trade duration** calculations
- **Long/Short ratio** analysis with directional bias (notional-based)
- **Largest gain/loss** tracking for risk management
- **Average win/loss amount** analysis
- **Symbol-specific filtering** and **date range selection**
- **Historical PnL charts** with **drawdown visualization**
- **Time-based performance**: session (Asian/London/NY) and time-of-day (UTC hour)
- **Detailed trade history table** with **annotation capabilities** (persisted in localStorage)
- **Fee composition breakdown** and **cumulative fee tracking** (taker vs protocol)
- **Order type performance** analysis (limit, market, stop, stop_limit)
- **Mock vs live:** When no wallet is connected, a banner and "Demo data" pill indicate mock data; connect your wallet to load live history. If the wallet has no Deriverse trades, the app prompts you to make a trade on [Deriverse testnet](https://alpha.deriverse.io).

## Tech Stack

- **Next.js 15** (App Router), **TypeScript**, **Tailwind CSS**
- **Recharts** for PnL, drawdown, session, and time-of-day charts
- **Solana Wallet Adapter** (Phantom and others) for wallet connect
- **@deriverse/kit** for live data (wallet tx history → decode → trades); mock data fallback when no wallet or no history

## Getting Started

### Prerequisites

- Node.js v20+
- pnpm

### Install

```bash
pnpm install
```

### Environment

**No API key is required.** Deriverse uses public Solana RPC (devnet) by default. Copy the example and you’re set:

```bash
cp .env.example .env
```

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_RPC_HTTP` | Solana RPC endpoint (wallet + future @deriverse/kit). Default: devnet. |
| `NEXT_PUBLIC_RPC_WS` | WebSocket endpoint (optional, for live updates). |
| `NEXT_PUBLIC_PROGRAM_ID` | Deriverse program ID (needed when wiring real data via @deriverse/kit). |
| `NEXT_PUBLIC_DERIVERSE_VERSION` | Protocol data version (from [kit-example](https://github.com/deriverse/kit-example)). |

For production or heavier usage, replace the public RPC with a dedicated provider (e.g. Helius, QuickNode); no Deriverse-specific API key is needed.

**429 Too Many Requests:** The public devnet RPC (`api.devnet.solana.com`) rate-limits heavily. If you see 429 in the console or "everything is 0" after connecting a wallet, set your own RPC in `.env`:
- **Helius:** Sign up at [helius.dev](https://helius.dev), create a devnet RPC, then `NEXT_PUBLIC_RPC_HTTP=https://devnet.helius-rpc.com/?api-key=YOUR_KEY`
- **QuickNode:** Create a Solana devnet endpoint and paste the HTTP URL into `NEXT_PUBLIC_RPC_HTTP`
Until then, the app falls back to **demo data** so the dashboard still shows numbers.

### Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
pnpm build
pnpm start
```

## Data Source

- **No wallet connected:** The UI shows **mock trade data** from `src/lib/mock-data.ts`. A banner says "This is mock data" and a "Demo data" pill appears so it’s clear you’re not viewing real history.
- **Wallet connected:** The app fetches the wallet’s transaction history from Solana RPC, decodes Deriverse program logs with `@deriverse/kit`’s `Engine.logsDecode`, and maps spot/perp fills to the dashboard’s `Trade` type. If no Deriverse trades are found (or RPC fails), the app falls back to mock data and shows: **"No trades found for this wallet. Make a trade on Deriverse testnet to see your data: [alpha.deriverse.io](https://alpha.deriverse.io)"**
- **Trade on testnet:** To see your own analytics, connect your wallet and place trades on [alpha.deriverse.io](https://alpha.deriverse.io), then refresh or reconnect.

## Project Structure

- `src/app/` – Next.js App Router (layout, page)
- `src/components/` – Header, sidebar, filters, KPI cards, charts, fee breakdown, order type table, trade history table, loading overlay, footer, wallet provider
- `src/hooks/` – useDeriverseTrades (live vs mock), useMediaQuery
- `src/lib/` – Types, mock data, deriverse-trades (fetch + decode), analytics, utils

## Deploy to GitHub

From the project root:

```bash
# Initialize repo (if not already)
git init

# Add all files (respects .gitignore)
git add .

# Initial commit
git commit -m "Initial commit: Deriverse Trading Analytics Dashboard"

# Add your GitHub repo as origin (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/deriverse-dashboard.git

# Push (use main or master depending on your default branch)
git push -u origin main
```

If your default branch is `master`, use `git push -u origin master` instead. To create a new repo on GitHub: [github.com/new](https://github.com/new), then run the `git remote add origin` and `git push` commands with the new repo URL.

## Credits

Built by [duke.sol](https://x.com/cryptoduke01) · [@cryptoduke01](https://x.com/cryptoduke01) on X

## License

MIT
