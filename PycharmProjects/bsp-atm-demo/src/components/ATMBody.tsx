import { RefObject } from "react";
import { ScreenState } from "@/pages/ATMDemo";
import HomeScreen from "@/components/screens/HomeScreen";
import CardInsertScreen from "@/components/screens/CardInsertScreen";
import PINScreen from "@/components/screens/PINScreen";
import ProcessingScreen from "@/components/screens/ProcessingScreen";
import SkimmerDevice from "@/components/SkimmerDevice";

interface ATMBodyProps {
  screen: ScreenState;
  pin: string;
  showSuccess: boolean;
  skimmerAttached: boolean;
  onScreenTap: () => void;
  onPinKey: (key: string) => void;
  onProceed: () => void;
  onSkimmerRemoved: () => void;
  pinAreaRef: RefObject<HTMLDivElement | null>;
  cardSlotRef: RefObject<HTMLDivElement | null>;
  onCardInserted: () => void;
  onReset: () => void;
}

const KEYPAD = [
  ["1","2","3"],
  ["4","5","6"],
  ["7","8","9"],
  ["CANCEL","0","ENT"],
];

export default function ATMBody({
  screen, pin, showSuccess, skimmerAttached,
  onScreenTap, onPinKey, onProceed, onSkimmerRemoved, pinAreaRef, cardSlotRef, onCardInserted, onReset,
}: ATMBodyProps) {
  return (
    <div className="relative flex flex-col items-center" style={{ perspective: "1400px" }}>
      {/* === OUTER ATM BODY === */}
      <div
        className="relative flex flex-col items-center overflow-hidden"
        style={{
          width: 390,
          borderRadius: 18,
          background: "linear-gradient(175deg, #e8eaed 0%, #d0d4da 15%, #b8bcc5 35%, #cdd0d6 55%, #dde0e5 80%, #e8eaed 100%)",
          boxShadow: "10px 18px 60px rgba(0,0,0,0.75), inset 2px 2px 8px rgba(255,255,255,0.5), inset -2px -2px 10px rgba(0,0,0,0.25)",
          border: "2px solid rgba(255,255,255,0.18)",
          transform: "rotateY(-2deg) rotateX(0.5deg)",
        }}
      >
        {/* === BSP RED HEADER === */}
        <div
          className="w-full flex flex-col items-center justify-center py-3 px-4"
          style={{
            background: "linear-gradient(180deg, #CC0000 0%, #990000 100%)",
            borderBottom: "3px solid #770000",
            boxShadow: "0 3px 12px rgba(0,0,0,0.4)",
          }}
        >
          {/* BSP Logo row */}
          <div className="flex items-center gap-3">
            {/* BSP Logo placeholder — circular emblem */}
            <div
              className="flex items-center justify-center rounded-full font-black"
              style={{
                width: 44, height: 44,
                background: "linear-gradient(135deg, #ffffff 0%, #e8e0c8 100%)",
                border: "2px solid rgba(255,255,255,0.6)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                color: "#CC0000",
                fontSize: 14,
                letterSpacing: "-0.04em",
              }}
            >
              BSP
            </div>
            <div className="flex flex-col">
              <span className="font-black text-white" style={{ fontSize: 20, letterSpacing: "0.06em", lineHeight: 1, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
                BSP
              </span>
              <span className="text-red-200 font-medium" style={{ fontSize: 8, letterSpacing: "0.08em", lineHeight: 1.2 }}>
                BANK SOUTH PACIFIC
              </span>
            </div>
            <div className="ml-2 flex flex-col items-end">
              <span className="text-red-100 font-semibold" style={{ fontSize: 9, letterSpacing: "0.12em" }}>
                ATM SERVICE
              </span>
              <span className="text-red-300" style={{ fontSize: 7 }}>24 HOURS · 7 DAYS</span>
            </div>
          </div>
        </div>

        {/* === YELLOW ACCENT STRIPE === */}
        <div style={{ width: "100%", height: 4, background: "linear-gradient(90deg, #F5A323 0%, #FFD060 50%, #F5A323 100%)" }} />

        {/* Side rails */}
        <div className="absolute left-0 top-0 bottom-0" style={{ width: 13, background: "linear-gradient(90deg, #888c96 0%, #adb2bc 70%)", zIndex: 1 }} />
        <div className="absolute right-0 top-0 bottom-0" style={{ width: 13, background: "linear-gradient(270deg, #888c96 0%, #adb2bc 70%)", zIndex: 1 }} />

        {/* === SCREEN HOUSING === */}
        <div
          className="relative overflow-hidden"
          style={{
            width: 340, marginTop: 14, marginBottom: 10,
            borderRadius: 10,
            background: "#111",
            border: "4px solid #2a2a2a",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.08), inset 0 2px 14px rgba(0,0,0,0.9)",
            minHeight: 260,
          }}
        >
          <div className="scanline" />

          {/* Screen content */}
          <div className="relative" style={{ minHeight: 260 }}>
            {screen === "home" && <HomeScreen onTap={onScreenTap} />}
            {screen === "card_insert" && <CardInsertScreen cardSlotRef={cardSlotRef} onInserted={onCardInserted} />}
            {screen === "pin_entry" && (
              <PINScreen pin={pin} showSuccess={showSuccess} pinAreaRef={pinAreaRef} onProceed={onProceed} />
            )}
            {(screen === "animating" || screen === "skimmer") && (
              <ProcessingScreen showSuccess={showSuccess} />
            )}
          </div>
        </div>

        {/* === CARD SLOT + SKIMMER DEVICE === */}
        <div className="mx-auto mb-1" style={{ position: "relative" }}>
          {skimmerAttached ? (
            <SkimmerDevice onRemoved={onSkimmerRemoved} cardSlotRef={cardSlotRef} />
          ) : (
            <>
              {/* Exposed slot after skimmer removed */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                {/* "DEVICE FOUND" alert */}
                <div
                  className="fade-in"
                  style={{
                    padding: "2px 10px", borderRadius: 4,
                    background: "rgba(255,60,0,0.18)",
                    border: "1px solid rgba(255,80,0,0.5)",
                    color: "#ff6622",
                    fontSize: 8, fontWeight: 700, letterSpacing: "0.12em",
                    textShadow: "0 0 8px #ff4400",
                    whiteSpace: "nowrap",
                  }}
                >
                  ⚠ SKIMMER DEVICE EXPOSED
                </div>
                <div
                  ref={cardSlotRef}
                  className="slot-glow flex items-center justify-center"
                  style={{
                    width: 200, height: 16,
                    background: "linear-gradient(90deg, #0a0a0a, #1a1a1a, #0a0a0a)",
                    border: "2px solid #CC0000",
                    borderRadius: 4,
                  }}
                >
                  <div style={{ width: 160, height: 3, background: "linear-gradient(90deg, transparent, #CC0000, #FF4444, #CC0000, transparent)", borderRadius: 2, opacity: 0.7 }} />
                </div>
                <div style={{ color: "#888", fontSize: 8, letterSpacing: "0.14em", textAlign: "center" }}>
                  ◄ INSERT / REMOVE CARD ►
                </div>
              </div>
            </>
          )}
        </div>

        {/* === KEYPAD === */}
        <div
          className="mx-auto mb-3 p-3 rounded-xl"
          style={{
            width: 220,
            background: "linear-gradient(160deg, #1c1e24 0%, #131519 100%)",
            border: "1.5px solid rgba(255,255,255,0.07)",
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.7)",
          }}
        >
          {KEYPAD.map((row, ri) => (
            <div key={ri} className="flex gap-2 mb-2 last:mb-0 justify-center">
              {row.map((key) => (
                <button
                  key={key}
                  className="keypad-key rounded-lg font-bold"
                  onClick={() => onPinKey(key)}
                  style={{
                    width: key === "CANCEL" || key === "ENT" ? 58 : 52,
                    height: 38,
                    fontSize: key === "CANCEL" ? 7 : key === "ENT" ? 9 : 15,
                    letterSpacing: key.length > 1 ? "0.04em" : 0,
                    background:
                      key === "ENT" ? "linear-gradient(135deg, #1a6f1a, #0d420d)"
                      : key === "CANCEL" ? "linear-gradient(135deg, #8f1a1a, #5a0e0e)"
                      : "linear-gradient(135deg, #2e3240, #1e2030)",
                    color:
                      key === "ENT" ? "#55ee55"
                      : key === "CANCEL" ? "#ff6666"
                      : "#ccd0e0",
                    border: "1px solid rgba(255,255,255,0.09)",
                    boxShadow: "0 3px 6px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
                    cursor: "pointer",
                  }}
                >
                  {key === "CLR" ? "CLR" : key}
                </button>
              ))}
            </div>
          ))}
          {/* CLR key */}
          <div className="flex justify-center mt-2">
            <button
              className="keypad-key rounded-lg font-bold"
              onClick={() => onPinKey("CLR")}
              style={{
                width: 70, height: 30, fontSize: 9, letterSpacing: "0.06em",
                background: "linear-gradient(135deg, #3a2800, #261a00)",
                color: "#ffcc44",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 2px 5px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
                cursor: "pointer",
              }}
            >
              CLEAR
            </button>
          </div>
        </div>

        {/* === CASH DISPENSER === */}
        <div className="mx-auto mb-3" style={{ width: 240, height: 14, background: "linear-gradient(90deg, #090909, #181818, #090909)", border: "1.5px solid rgba(255,255,255,0.06)", borderRadius: 3, boxShadow: "inset 0 2px 8px rgba(0,0,0,0.8)" }} />

        {/* === BOTTOM STRIP === */}
        <div
          className="w-full flex items-center justify-between px-5 py-2"
          style={{
            background: "linear-gradient(180deg, #181a1e 0%, #0e0f12 100%)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <span style={{ color: "#3a3f50", fontSize: 7, letterSpacing: "0.1em" }}>BSP FINANCIAL GROUP</span>
          <div style={{ width: 24, height: 3, background: "linear-gradient(90deg, #CC0000, #F5A323)", borderRadius: 2 }} />
          <span style={{ color: "#3a3f50", fontSize: 7, letterSpacing: "0.1em" }}>PNG SECURE NETWORK</span>
        </div>
      </div>

      {/* Restart button after demo */}
      {(screen === "skimmer") && (
        <button
          onClick={onReset}
          className="mt-4 px-6 py-2 rounded-lg text-xs font-bold tracking-widest uppercase fade-in"
          style={{
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)",
            color: "rgba(255,255,255,0.55)", letterSpacing: "0.18em", backdropFilter: "blur(4px)", cursor: "pointer",
          }}
        >
          ↩ RESTART DEMO
        </button>
      )}
    </div>
  );
}
