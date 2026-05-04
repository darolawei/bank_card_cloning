import { RefObject } from "react";
import { AppState } from "@/pages/ATMDemo";

interface ATMKioskProps {
  cardNumber: string;
  pin: string;
  appState: AppState;
  showSuccess: boolean;
  onCardNumberChange: (v: string) => void;
  onPinChange: (v: string) => void;
  onProceed: () => void;
  onReset: () => void;
  proceedBtnRef: RefObject<HTMLButtonElement | null>;
  cardInputRef: RefObject<HTMLInputElement | null>;
  pinInputRef: RefObject<HTMLInputElement | null>;
}

const KEYPAD_KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["CLR", "0", "ENT"],
];

export default function ATMKiosk({
  cardNumber,
  pin,
  appState,
  showSuccess,
  onCardNumberChange,
  onPinChange,
  onProceed,
  onReset,
  proceedBtnRef,
  cardInputRef,
  pinInputRef,
}: ATMKioskProps) {
  const disabled = appState !== "idle";

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ perspective: "1200px" }}
    >
      {/* ATM outer body — 3D kiosk */}
      <div
        className="relative flex flex-col items-center rounded-2xl overflow-hidden"
        style={{
          width: "360px",
          background:
            "linear-gradient(160deg, #c8cdd6 0%, #8e9099 18%, #5a5f6b 40%, #3d4148 55%, #5a5f6b 72%, #8e9099 85%, #b0b5be 100%)",
          boxShadow:
            "8px 16px 48px rgba(0,0,0,0.7), inset 2px 2px 6px rgba(255,255,255,0.18), inset -2px -2px 8px rgba(0,0,0,0.35)",
          transform: "rotateY(-3deg) rotateX(1deg)",
          border: "2px solid rgba(255,255,255,0.12)",
        }}
      >
        {/* Top cap */}
        <div
          className="w-full flex items-center justify-center py-3"
          style={{
            background:
              "linear-gradient(180deg, #4a4f5a 0%, #2e3139 100%)",
            borderBottom: "2px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="rounded-full"
              style={{ width: 10, height: 10, background: "#ff4444", boxShadow: "0 0 6px #ff4444" }}
            />
            <div
              className="rounded-full"
              style={{ width: 10, height: 10, background: "#ffaa00", boxShadow: "0 0 6px #ffaa00" }}
            />
            <div
              className="rounded-full"
              style={{ width: 10, height: 10, background: "#00cc44", boxShadow: "0 0 6px #00cc44" }}
            />
          </div>
          <span
            className="ml-3 text-xs font-bold tracking-widest uppercase"
            style={{ color: "#aab0bb", letterSpacing: "0.18em" }}
          >
            BSP AUTOMATED TELLER MACHINE
          </span>
        </div>

        {/* Side rails */}
        <div
          className="absolute left-0 top-0 bottom-0"
          style={{
            width: 14,
            background:
              "linear-gradient(90deg, #222428 0%, #40444e 60%, #5a5f6b 100%)",
            boxShadow: "inset -2px 0 6px rgba(0,0,0,0.4)",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0"
          style={{
            width: 14,
            background:
              "linear-gradient(270deg, #222428 0%, #40444e 60%, #5a5f6b 100%)",
            boxShadow: "inset 2px 0 6px rgba(0,0,0,0.4)",
          }}
        />

        {/* Screen housing */}
        <div
          className="mx-auto mt-4 mb-3 rounded-xl overflow-hidden relative"
          style={{
            width: "310px",
            background: "#0a0e14",
            border: "3px solid #22262e",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.05), inset 0 2px 12px rgba(0,0,0,0.8)",
          }}
        >
          {/* Scanline effect */}
          <div className="scanline" />

          {/* ATM Screen */}
          <div
            className="relative p-5 flex flex-col"
            style={{
              background:
                "linear-gradient(160deg, #0e1520 0%, #091525 100%)",
              minHeight: "260px",
            }}
          >
            {/* BSP Bank Header */}
            <div className="flex flex-col items-center mb-4">
              <div
                className="flex items-center gap-2 mb-1"
              >
                <div
                  className="flex items-center justify-center rounded-lg font-black text-base"
                  style={{
                    width: 32,
                    height: 32,
                    background: "linear-gradient(135deg, #1a6fff 0%, #0a3fa8 100%)",
                    color: "#fff",
                    boxShadow: "0 2px 8px #1a6fff88",
                    letterSpacing: "-0.05em",
                  }}
                >
                  B
                </div>
                <span
                  className="font-black tracking-widest uppercase"
                  style={{
                    fontSize: 18,
                    color: "#e8f0ff",
                    textShadow: "0 0 16px #3a80ff88",
                    letterSpacing: "0.22em",
                  }}
                >
                  BSP BANK
                </span>
              </div>
              <div
                className="text-center"
                style={{ color: "#4a7acc", fontSize: 10, letterSpacing: "0.12em" }}
              >
                BANGKO SENTRAL NG PILIPINAS — SECURE TRANSACTION
              </div>
              <div
                className="w-full mt-2"
                style={{
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, #1a6fff55, #1a6fff, #1a6fff55, transparent)",
                }}
              />
            </div>

            {/* Card Number Field */}
            <div className="mb-3">
              <label
                className="block mb-1 font-semibold tracking-wider uppercase"
                style={{ color: "#4a7acc", fontSize: 9 }}
              >
                Card Number
              </label>
              <div className="relative">
                <input
                  ref={cardInputRef}
                  type="text"
                  inputMode="numeric"
                  maxLength={19}
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => onCardNumberChange(formatCardNumber(e.target.value))}
                  disabled={disabled}
                  className="w-full rounded-lg px-3 py-2 font-mono text-sm outline-none transition-all"
                  style={{
                    background: "rgba(10,20,40,0.8)",
                    border: "1.5px solid #1a3060",
                    color: "#7dd4ff",
                    fontSize: 14,
                    letterSpacing: "0.12em",
                    caretColor: "#4af",
                    boxShadow: "inset 0 1px 4px rgba(0,0,0,0.5), 0 0 0 0px #1a6fff",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = "1.5px solid #2a7fff";
                    e.currentTarget.style.boxShadow = "inset 0 1px 4px rgba(0,0,0,0.5), 0 0 8px #1a6fff55";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = "1.5px solid #1a3060";
                    e.currentTarget.style.boxShadow = "inset 0 1px 4px rgba(0,0,0,0.5)";
                  }}
                />
                <div
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  style={{ color: "#1a4488", fontSize: 12 }}
                >
                  💳
                </div>
              </div>
            </div>

            {/* PIN Field */}
            <div className="mb-4">
              <label
                className="block mb-1 font-semibold tracking-wider uppercase"
                style={{ color: "#4a7acc", fontSize: 9 }}
              >
                PIN
              </label>
              <input
                ref={pinInputRef}
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="••••"
                value={pin}
                onChange={(e) =>
                  onPinChange(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                disabled={disabled}
                className="w-full rounded-lg px-3 py-2 font-mono text-lg outline-none tracking-widest transition-all"
                style={{
                  background: "rgba(10,20,40,0.8)",
                  border: "1.5px solid #1a3060",
                  color: "#7dd4ff",
                  caretColor: "#4af",
                  boxShadow: "inset 0 1px 4px rgba(0,0,0,0.5)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1.5px solid #2a7fff";
                  e.currentTarget.style.boxShadow = "inset 0 1px 4px rgba(0,0,0,0.5), 0 0 8px #1a6fff55";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1.5px solid #1a3060";
                  e.currentTarget.style.boxShadow = "inset 0 1px 4px rgba(0,0,0,0.5)";
                }}
              />
            </div>

            {/* PROCEED button */}
            <button
              ref={proceedBtnRef}
              onClick={onProceed}
              disabled={disabled || !cardNumber.trim() || !pin.trim()}
              className="w-full py-2.5 rounded-lg font-bold tracking-widest uppercase transition-all text-sm"
              style={{
                background:
                  disabled || !cardNumber.trim() || !pin.trim()
                    ? "linear-gradient(135deg, #1a2a50 0%, #0d1c38 100%)"
                    : "linear-gradient(135deg, #1a6fff 0%, #0a3fa8 50%, #1a6fff 100%)",
                color: disabled || !cardNumber.trim() || !pin.trim() ? "#3a5080" : "#ffffff",
                boxShadow:
                  disabled || !cardNumber.trim() || !pin.trim()
                    ? "none"
                    : "0 4px 16px #1a6fff66, inset 0 1px 0 rgba(255,255,255,0.2)",
                letterSpacing: "0.22em",
                cursor: disabled ? "not-allowed" : "pointer",
                border: "1.5px solid",
                borderColor: disabled ? "#1a2a50" : "#2a7fff",
              }}
            >
              {appState === "animating" ? "PROCESSING..." : "PROCEED"}
            </button>

            {/* Transaction success overlay */}
            {showSuccess && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center success-flash"
                style={{ background: "rgba(0,20,0,0.92)", zIndex: 20 }}
              >
                <div
                  className="rounded-full flex items-center justify-center mb-3"
                  style={{
                    width: 64,
                    height: 64,
                    background: "rgba(0,200,80,0.15)",
                    border: "2px solid #00c850",
                    boxShadow: "0 0 24px #00c85088",
                  }}
                >
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <path
                      d="M8 19L15 26L28 11"
                      stroke="#00c850"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  className="font-bold text-center mb-1"
                  style={{ color: "#00c850", fontSize: 18, letterSpacing: "0.08em" }}
                >
                  TRANSACTION SUCCESSFUL
                </div>
                <div
                  className="text-center"
                  style={{ color: "#00aa40", fontSize: 11, letterSpacing: "0.04em" }}
                >
                  Please collect your card. Thank you for banking with BSP.
                </div>
                <div
                  className="mt-3 px-3 py-1 rounded"
                  style={{
                    background: "rgba(0,200,80,0.1)",
                    border: "1px solid #00aa4055",
                    color: "#00aa40",
                    fontSize: 10,
                  }}
                >
                  Ref: TXN-{Math.floor(Math.random() * 900000 + 100000)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card Slot */}
        <div
          className="mx-auto mb-3 rounded flex items-center justify-center card-slot-glow"
          style={{
            width: "180px",
            height: "14px",
            background: "linear-gradient(90deg, #050a14 0%, #0a1428 40%, #050a14 100%)",
            border: "2px solid #1a5acc",
            borderRadius: "4px",
          }}
        >
          <div
            style={{
              width: "140px",
              height: "3px",
              background:
                "linear-gradient(90deg, transparent, #1a6fff, #4af, #1a6fff, transparent)",
              borderRadius: "2px",
              opacity: 0.8,
            }}
          />
        </div>

        {/* Card slot label */}
        <div
          className="mb-2 text-center"
          style={{ color: "#4a5870", fontSize: 9, letterSpacing: "0.14em" }}
        >
          ← INSERT CARD HERE →
        </div>

        {/* Dummy keypad */}
        <div
          className="mx-auto mb-4 p-3 rounded-xl"
          style={{
            width: "200px",
            background: "linear-gradient(160deg, #1a1d24 0%, #12141a 100%)",
            border: "1.5px solid rgba(255,255,255,0.06)",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.6)",
          }}
        >
          {KEYPAD_KEYS.map((row, ri) => (
            <div key={ri} className="flex gap-2 mb-2 last:mb-0 justify-center">
              {row.map((key) => (
                <button
                  key={key}
                  className="keypad-key rounded-lg font-bold transition-all"
                  style={{
                    width: 44,
                    height: 36,
                    background:
                      key === "ENT"
                        ? "linear-gradient(135deg, #1a5f1a 0%, #0d3d0d 100%)"
                        : key === "CLR"
                        ? "linear-gradient(135deg, #5f1a1a 0%, #3d0d0d 100%)"
                        : "linear-gradient(135deg, #2a2e38 0%, #1a1d24 100%)",
                    color:
                      key === "ENT" ? "#44dd44" : key === "CLR" ? "#dd4444" : "#b0b8cc",
                    fontSize: key === "ENT" || key === "CLR" ? 9 : 14,
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow:
                      "0 2px 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
                    cursor: "default",
                    letterSpacing: key.length > 1 ? "0.05em" : 0,
                  }}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Cash dispenser slot */}
        <div
          className="mx-auto mb-4 rounded"
          style={{
            width: "220px",
            height: "12px",
            background: "linear-gradient(90deg, #0a0c10 0%, #14181f 50%, #0a0c10 100%)",
            border: "1.5px solid rgba(255,255,255,0.05)",
            boxShadow: "inset 0 2px 6px rgba(0,0,0,0.8)",
          }}
        />

        {/* Bottom brand strip */}
        <div
          className="w-full flex items-center justify-between px-6 py-2"
          style={{
            background: "linear-gradient(180deg, #16191f 0%, #0d0f13 100%)",
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <span style={{ color: "#3a4050", fontSize: 8, letterSpacing: "0.1em" }}>
            BSP REGULATED
          </span>
          <span style={{ color: "#3a4050", fontSize: 8 }}>●</span>
          <span style={{ color: "#3a4050", fontSize: 8, letterSpacing: "0.1em" }}>
            SECURE ATM NETWORK
          </span>
        </div>
      </div>

      {/* Reset button — shown after demo completes */}
      {appState === "skimmer" && (
        <button
          onClick={onReset}
          className="mt-4 px-6 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.18em",
            backdropFilter: "blur(4px)",
          }}
        >
          ↩ RESTART DEMO
        </button>
      )}
    </div>
  );
}
