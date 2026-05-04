import { useState, useRef, useCallback } from "react";
import ATMBody from "@/components/ATMBody";
import SkimmerTerminal from "@/components/SkimmerTerminal";
import ParticleCanvas from "@/components/ParticleCanvas";
import WarningBanner from "@/components/WarningBanner";
import DraggableCard from "@/components/DraggableCard";
import RestartButton from "@/components/RestartButton";
import SecurityTicker from "@/components/SecurityTicker";

export type ScreenState = "home" | "card_insert" | "pin_entry" | "animating" | "skimmer" | "success";

export interface Particle {
  id: number; x: number; y: number; text: string; endX: number; endY: number;
}

/** POST captured data to the local skimmer terminal server (port 4444). */
async function notifyTerminal(card: string, pin: string) {
  try {
    await fetch("http://localhost:4444/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        card,
        pin,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      }),
    });
  } catch (_) {
    // Server not running — silently ignore (demo still works)
  }
}

export default function ATMDemo() {
  const [screen, setScreen] = useState<ScreenState>("home");
  const [pin, setPin] = useState("");
  const [cardInserted, setCardInserted] = useState(false);
  const [skimmerAttached, setSkimmerAttached] = useState(true);
  const [skimmerLogs, setSkimmerLogs] = useState<string[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const particleIdRef = useRef(0);
  const pinAreaRef = useRef<HTMLDivElement>(null);
  const cardSlotRef = useRef<HTMLDivElement>(null);

  const playBeep = useCallback((freqs: number[]) => {
    try {
      const ctx = new AudioContext();
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.18);
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.18);
        gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + i * 0.18 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.14);
        osc.start(ctx.currentTime + i * 0.18);
        osc.stop(ctx.currentTime + i * 0.18 + 0.14);
      });
    } catch (_) {}
  }, []);

  const handleCardInserted = useCallback(() => {
    setCardInserted(true);
    playBeep([880, 1100]);
    setTimeout(() => setScreen("pin_entry"), 600);
  }, [playBeep]);

  const handlePinKey = useCallback((key: string) => {
    if (screen !== "pin_entry") return;
    if (key === "CLR") { setPin(""); return; }
    if (key === "CANCEL") { handleReset(); return; }
    if (key === "ENT" || key === "PROCEED") {
      if (pin.length < 4) return;
      handleProceed();
      return;
    }
    if (pin.length >= 6) return;
    setPin(p => p + key);
    playBeep([660]);
  }, [screen, pin]);

  const spawnParticles = useCallback(() => {
    const vw = window.innerWidth, vh = window.innerHeight;
    const endX = vw * 0.87, endY = vh * 0.07;
    const el = pinAreaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const sx = rect.left + rect.width / 2, sy = rect.top + rect.height / 2;
    const newP: Particle[] = [];
    "6012345678901234".split("").forEach((ch, i) => {
      newP.push({
        id: ++particleIdRef.current,
        x: sx + (i - 8) * 11 + (Math.random() - 0.5) * 20,
        y: sy - 20 + (Math.random() - 0.5) * 16,
        text: ch,
        endX: endX + (Math.random() - 0.5) * 60,
        endY: endY + (Math.random() - 0.5) * 50,
      });
    });
    (pin || "1234").split("").forEach((ch, i) => {
      newP.push({
        id: ++particleIdRef.current,
        x: sx + (i - 2) * 14 + (Math.random() - 0.5) * 18,
        y: sy + 10 + (Math.random() - 0.5) * 16,
        text: "*",
        endX: endX + (Math.random() - 0.5) * 50,
        endY: endY + (Math.random() - 0.5) * 50,
      });
    });
    for (let i = 0; i < 20; i++) {
      newP.push({
        id: ++particleIdRef.current,
        x: sx + (Math.random() - 0.5) * 80,
        y: sy + (Math.random() - 0.5) * 40,
        text: ["0","1","#","$","%","?","@","!"][Math.floor(Math.random() * 8)],
        endX: endX + (Math.random() - 0.5) * 70,
        endY: endY + (Math.random() - 0.5) * 60,
      });
    }
    setParticles(newP);
    setTimeout(() => setParticles([]), 1700);
  }, [pin]);

  const buildLogs = useCallback(() => {
    const ts = new Date().toISOString().replace("T", " ").substring(0, 19);
    return [
      `> SKIMMER v3.1 — ACTIVE`,
      `> ━━━━━━━━━━━━━━━━━━━━━━`,
      `> TIMESTAMP   : ${ts}`,
      `> CARD READER : INTERCEPTED`,
      `> CAPTURED CARD: 6012 3456 7890 1234`,
      `> PIN STATUS  : CLONED [${pin || "1234"}]`,
      `> ENC KEY     : AES-256 / STORED`,
      `> TRANSMIT    : 185.220.xxx.xxx`,
      `> STATUS      : ✓ DATA EXFILTRATED`,
    ];
  }, [pin]);

  const handleProceed = useCallback(() => {
    if (screen !== "pin_entry") return;
    setScreen("animating");
    playBeep([880, 1100]);
    spawnParticles();

    // 🔴 Send live data to PyCharm terminal (port 4444)
    notifyTerminal("6012 3456 7890 1234", pin || "1234");

    const logs = buildLogs();
    setTimeout(() => {
      setScreen("skimmer");
      logs.forEach((line, i) => setTimeout(() => setSkimmerLogs(p => [...p, line]), i * 190));
    }, 1000);
    setTimeout(() => { setShowSuccess(true); setTimeout(() => setShowSuccess(false), 3300); }, 1800);
    setTimeout(() => setShowWarning(true), 3500);
  }, [screen, pin, playBeep, spawnParticles, buildLogs]);

  const handleReset = useCallback(() => {
    setScreen("home");
    setPin("");
    setCardInserted(false);
    setSkimmerAttached(true);
    setSkimmerLogs([]);
    setParticles([]);
    setShowWarning(false);
    setShowSuccess(false);
  }, []);

  const handleScreenTap = useCallback(() => {
    if (screen === "home") setScreen("card_insert");
  }, [screen]);

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none" style={{ background: "#1a1a1a" }}>
      {/* Bank lobby background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=1920&q=80&fit=crop')",
          filter: "brightness(0.35) saturate(0.7)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

      <SecurityTicker />
      <ParticleCanvas particles={particles} />

      {/* Centered ATM */}
      <div className="relative z-10 flex items-center justify-center w-full h-full pt-8">
        <ATMBody
          screen={screen}
          pin={pin}
          showSuccess={showSuccess}
          skimmerAttached={skimmerAttached}
          onScreenTap={handleScreenTap}
          onPinKey={handlePinKey}
          onProceed={handleProceed}
          onSkimmerRemoved={() => setSkimmerAttached(false)}
          pinAreaRef={pinAreaRef}
          cardSlotRef={cardSlotRef}
          onCardInserted={handleCardInserted}
          onReset={handleReset}
        />
      </div>

      {/* Draggable BSP card */}
      {screen === "card_insert" && !cardInserted && (
        <DraggableCard cardSlotRef={cardSlotRef} onInserted={handleCardInserted} />
      )}

      {screen === "skimmer" && <SkimmerTerminal logs={skimmerLogs} />}
      {showWarning && <WarningBanner onClose={handleReset} />}

      {/* Always-visible floating restart button */}
      <RestartButton onReset={handleReset} screen={screen} />
    </div>
  );
}
