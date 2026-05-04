#!/usr/bin/env node
/**
 * BSP ATM Security Demo — Skimmer Terminal Server
 * ================================================
 * Run this BEFORE starting the React app:
 *   node skimmer-server.cjs
 *
 * When the demo triggers, captured data will print
 * live in THIS terminal window — just like a real
 * attacker's remote logging server.
 *
 * Listens on: http://localhost:4444
 * Endpoint:   POST /capture  { card, pin, timestamp }
 */

const http = require('http');

const PORT = 4444;

// ANSI colours
const R  = '\x1b[31m';   // red
const G  = '\x1b[32m';   // green
const Y  = '\x1b[33m';   // yellow
const C  = '\x1b[36m';   // cyan
const W  = '\x1b[37m';   // white
const B  = '\x1b[1m';    // bold
const DIM = '\x1b[2m';   // dim
const X  = '\x1b[0m';    // reset

function banner() {
  console.log(`${R}${B}
╔══════════════════════════════════════════════════╗
║        BSP ATM SKIMMER — LIVE CAPTURE SERVER     ║
║           ⚠  SECURITY AWARENESS DEMO  ⚠          ║
╠══════════════════════════════════════════════════╣
║  Listening on http://localhost:${PORT}             ║
║  Waiting for victim data...                      ║
╚══════════════════════════════════════════════════╝${X}
`);
}

function printCapture(data) {
  const ts  = data.timestamp || new Date().toISOString().replace('T',' ').slice(0,19);
  const card = data.card     || '6012 3456 7890 1234';
  const pin  = data.pin      || '????';

  console.log(`\n${R}${B}╔══════════════════════════════════════════════════╗${X}`);
  console.log(`${R}${B}║   💀  SKIMMER v3.1 — DATA INTERCEPTED            ║${X}`);
  console.log(`${R}${B}╠══════════════════════════════════════════════════╣${X}`);
  console.log(`${Y}${B}  TIMESTAMP   :${X} ${W}${ts}${X}`);
  console.log(`${Y}${B}  CARD READER :${X} ${R}${B}INTERCEPTED ✓${X}`);
  console.log(`${Y}${B}  CARD NUMBER :${X} ${G}${B}${card}${X}`);
  console.log(`${Y}${B}  PIN CLONED  :${X} ${G}${B}[ ${pin} ]${X}`);
  console.log(`${Y}${B}  ENC KEY     :${X} ${C}AES-256 / STORED${X}`);
  console.log(`${Y}${B}  TRANSMIT TO :${X} ${DIM}185.220.xxx.xxx (TOR EXIT)${X}`);
  console.log(`${R}${B}╠══════════════════════════════════════════════════╣${X}`);
  console.log(`${R}${B}║   ✓ DATA EXFILTRATED — VICTIM UNAWARE            ║${X}`);
  console.log(`${R}${B}╚══════════════════════════════════════════════════╝${X}\n`);
  console.log(`${DIM}[!] Waiting for next victim...${X}\n`);
}

const server = http.createServer((req, res) => {
  // CORS — allow the local React dev server
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'online', server: 'skimmer-terminal' }));
    return;
  }

  if (req.method === 'POST' && req.url === '/capture') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        printCapture(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, received: data }));
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, '127.0.0.1', () => {
  banner();
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n${R}[ERROR] Port ${PORT} is already in use.${X}`);
    console.error(`Stop whatever is running on that port and retry.\n`);
    process.exit(1);
  }
  throw err;
});
