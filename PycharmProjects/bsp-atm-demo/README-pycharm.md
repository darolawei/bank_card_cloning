# BSP ATM Security Awareness Demo — PyCharm Setup Guide

A high-fidelity BSP ATM skimming simulation for symposium use.

---

## Prerequisites

Install these before anything else:

1. **Node.js 20+** → https://nodejs.org (choose "LTS")
2. **npm** (comes with Node.js — no extra install needed)

---

## Step-by-Step Setup in PyCharm

### 1. Open the project
- In PyCharm: **File → Open** → select the `bsp-atm-demo` folder
- PyCharm may prompt you to install Node.js — follow those prompts

### 2. Rename the standalone package file
- Find `package.standalone.json` in the project root
- **Rename it to `package.json`** (replace the existing one)
  - Right-click → Rename → `package.json`

### 3. Rename the standalone Vite config
- Find `vite.standalone.config.ts` in the project root
- **This is your Vite config** — you'll use it directly (no rename needed)

### 4. Install dependencies
- Open PyCharm's **Terminal** (bottom toolbar → Terminal)
- Run:
  ```
  npm install
  ```
- Wait for it to finish (~1–2 minutes)

### 5. Fix import alias (one-time edit)
- Open `src/pages/ATMDemo.tsx`
- The `@workspace/api-client-react` import in `package.json` should be removed — it's already excluded in `package.standalone.json`

---

## Running the Demo

You need **TWO terminal windows** open at the same time:

### Terminal 1 — Skimmer Live Terminal (your "hacker console")
```bash
node skimmer-server.cjs
```
You'll see:
```
╔══════════════════════════════════════════════════╗
║        BSP ATM SKIMMER — LIVE CAPTURE SERVER     ║
║  Listening on http://localhost:4444              ║
║  Waiting for victim data...                      ║
╚══════════════════════════════════════════════════╝
```
**Keep this window visible during your presentation.**

### Terminal 2 — React App (the ATM screen)
```bash
npx vite --config vite.standalone.config.ts
```
Then open your browser to: **http://localhost:3000**

---

## Demo Flow

| Step | Action | What the audience sees |
|------|--------|----------------------|
| 1 | Open the browser | BSP ATM home screen with live clock |
| 2 | Point to the card slot | A **skimmer device** is attached (dark overlay) |
| 3 | **Drag the skimmer** off the ATM | Device "rips off" — red "SKIMMER DEVICE EXPOSED" alert appears |
| 4 | Click the ATM screen | ATM asks to insert card |
| 5 | Drag the BSP card into the slot | Card accepted — PIN entry screen |
| 6 | Press number keys (1-9) on keypad | PIN dots fill in |
| 7 | Click **PROCEED** or press **ENT** | — |
| 8 | Data flies off screen | Particle animation |
| 9 | Skimmer terminal appears (browser) | Captured card + PIN displayed |
| 10 | **Terminal 1 in PyCharm** | 🔴 LIVE data prints in your console! |
| 11 | ATM shows "Transaction Successful" | Victim is unaware |
| 12 | Red warning banner appears | Educational message |

---

## Tips for Presenters

- **Make Terminal 1 full-screen** or place it on a second monitor so the audience sees it light up when data is captured
- The **Security Awareness Ticker** at the top cycles ATM safety tips automatically
- The **↩ RESTART** button (bottom-left) resets everything including the skimmer device reattaching
- PIN must be **4–6 digits** before PROCEED activates
- Press **CANCEL** on the keypad to return to the home screen at any time

---

## Folder Structure

```
bsp-atm-demo/
├── src/
│   ├── pages/ATMDemo.tsx          ← Main orchestrator & state machine
│   ├── components/
│   │   ├── ATMBody.tsx            ← Physical ATM kiosk shell
│   │   ├── SkimmerDevice.tsx      ← Draggable skimmer overlay
│   │   ├── SkimmerTerminal.tsx    ← On-screen hacker terminal
│   │   ├── SecurityTicker.tsx     ← Top tips ticker
│   │   ├── RestartButton.tsx      ← Always-visible restart
│   │   ├── DraggableCard.tsx      ← BSP drag-to-insert card
│   │   └── screens/
│   │       ├── HomeScreen.tsx
│   │       ├── CardInsertScreen.tsx
│   │       ├── PINScreen.tsx
│   │       └── ProcessingScreen.tsx
│   └── index.css                  ← All animations & BSP brand styles
├── skimmer-server.cjs             ← Node.js terminal server (NO deps)
├── vite.standalone.config.ts      ← Vite config for local use
└── package.standalone.json        ← Rename to package.json
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `npm install` fails | Make sure you renamed `package.standalone.json` → `package.json` |
| Port 3000 in use | Edit `vite.standalone.config.ts` — change `port: 3000` to `port: 3001` |
| Port 4444 in use | Edit `skimmer-server.cjs` — change `const PORT = 4444` to another port, and update `ATMDemo.tsx` to match |
| Terminal server not printing | Make sure `node skimmer-server.cjs` is running BEFORE clicking PROCEED |
| Blank screen in browser | Check Terminal 2 for errors — usually a missing package |
