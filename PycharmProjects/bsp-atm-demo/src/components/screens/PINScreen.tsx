import { RefObject } from "react";

interface PINScreenProps {
  pin: string;
  showSuccess: boolean;
  pinAreaRef: RefObject<HTMLDivElement | null>;
  onProceed: () => void;
}

const MASKED_CARD = "6012  ****  ****  1234";

export default function PINScreen({ pin, showSuccess, pinAreaRef, onProceed }: PINScreenProps) {
  const canProceed = pin.length >= 4;

  return (
    <div
      className="flex flex-col items-center justify-between screen-slide-in"
      style={{
        minHeight: 260, padding: "14px 18px",
        background: "linear-gradient(180deg, #060e06 0%, #040804 60%, #0a0a0a 100%)",
        position: "relative",
      }}
    >
      {/* Header */}
      <div className="flex flex-col items-center w-full mb-1">
        <div className="flex items-center gap-2 mb-1">
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00cc44", boxShadow: "0 0 8px #00cc44" }} />
          <span className="font-bold text-white" style={{ fontSize: 10, letterSpacing: "0.12em" }}>CARD ACCEPTED</span>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00cc44", boxShadow: "0 0 8px #00cc44" }} />
        </div>

        {/* Masked card number */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg mb-2"
          style={{
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <rect x="0.5" y="0.5" width="13" height="9" rx="1.5" stroke="#556677" strokeWidth="1" />
            <rect x="0" y="3" width="14" height="2.5" fill="#334455" />
            <rect x="1" y="7" width="4" height="1.5" rx="0.5" fill="#445566" />
          </svg>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "#5577aa", letterSpacing: "0.12em" }}>
            {MASKED_CARD}
          </span>
        </div>

        <div style={{ height: 1, width: "100%", background: "linear-gradient(90deg, transparent, #00cc4440, transparent)", marginBottom: 8 }} />
        <div className="text-white font-black" style={{ fontSize: 13, letterSpacing: "0.08em", marginBottom: 1 }}>
          ENTER YOUR PIN
        </div>
        <div style={{ color: "#445555", fontSize: 8, letterSpacing: "0.1em" }}>
          Use the keypad · 4–6 digits
        </div>
      </div>

      {/* PIN dots */}
      <div ref={pinAreaRef} className="flex flex-col items-center w-full my-1">
        <div
          className="flex items-center justify-center gap-4 px-6 py-3 rounded-xl w-full"
          style={{
            background: "rgba(0,0,0,0.65)",
            border: `1.5px solid ${canProceed ? "rgba(0,204,68,0.4)" : "rgba(0,204,68,0.15)"}`,
            boxShadow: canProceed ? "0 0 12px rgba(0,204,68,0.12)" : "inset 0 2px 8px rgba(0,0,0,0.8)",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
        >
          {Array.from({ length: Math.max(pin.length, 4) }).map((_, i) => (
            <div
              key={i}
              className={i < pin.length ? "pin-dot-pop" : ""}
              style={{
                width: i < pin.length ? 15 : 11,
                height: i < pin.length ? 15 : 11,
                borderRadius: "50%",
                background: i < pin.length
                  ? "radial-gradient(circle, #aaff99 0%, #00cc44 100%)"
                  : "rgba(255,255,255,0.07)",
                border: i < pin.length ? "none" : "1.5px solid rgba(255,255,255,0.13)",
                boxShadow: i < pin.length ? "0 0 10px #00cc44aa" : "none",
                transition: "all 0.15s",
              }}
            />
          ))}
        </div>

        <div className="mt-1.5 text-center" style={{ color: "#556", fontSize: 8.5, letterSpacing: "0.08em", minHeight: 14 }}>
          {pin.length === 0 && "Waiting for PIN entry..."}
          {pin.length > 0 && pin.length < 4 && `${pin.length} digit${pin.length > 1 ? "s" : ""} entered — need at least 4`}
          {pin.length >= 4 && <span style={{ color: "#00cc44" }}>✓ Press PROCEED or ENT to confirm</span>}
        </div>
      </div>

      {/* PROCEED button */}
      <button
        onClick={onProceed}
        disabled={!canProceed}
        style={{
          width: "100%",
          padding: "10px 0",
          borderRadius: 8,
          fontWeight: 800,
          fontSize: 12,
          letterSpacing: "0.2em",
          cursor: canProceed ? "pointer" : "not-allowed",
          background: canProceed
            ? "linear-gradient(135deg, #CC0000 0%, #990000 50%, #CC0000 100%)"
            : "rgba(30,10,10,0.6)",
          color: canProceed ? "#ffffff" : "#442222",
          border: `1.5px solid ${canProceed ? "#FF3333" : "#2a0808"}`,
          boxShadow: canProceed
            ? "0 4px 18px rgba(204,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)"
            : "none",
          transition: "all 0.25s",
          fontFamily: "inherit",
          marginBottom: 6,
        }}
      >
        {canProceed ? "PROCEED ▶" : "ENTER PIN TO PROCEED"}
      </button>

      {/* Security notice */}
      <div
        className="w-full rounded-lg px-2 py-1"
        style={{ background: "rgba(0,60,15,0.2)", border: "1px solid rgba(0,180,60,0.12)" }}
      >
        <div className="text-center" style={{ color: "#3a5e44", fontSize: 7.5, letterSpacing: "0.06em" }}>
          🔒 Shield your PIN · Press CANCEL to exit safely
        </div>
      </div>

      {/* Success overlay */}
      {showSuccess && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center success-flash"
          style={{ background: "rgba(0,12,0,0.95)", zIndex: 20, borderRadius: 6 }}
        >
          <div
            className="flex items-center justify-center rounded-full mb-3"
            style={{ width: 64, height: 64, background: "rgba(0,200,80,0.12)", border: "2px solid #00c850", boxShadow: "0 0 28px #00c85088" }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M8 19L15 26L28 11" stroke="#00c850" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="font-bold text-center mb-1" style={{ color: "#00c850", fontSize: 16, letterSpacing: "0.08em" }}>
            TRANSACTION SUCCESSFUL
          </div>
          <div className="text-center" style={{ color: "#00aa40", fontSize: 10, letterSpacing: "0.04em" }}>
            Please collect your card.<br />Thank you for banking with BSP.
          </div>
          <div className="mt-2 px-3 py-1 rounded" style={{ background: "rgba(0,200,80,0.1)", border: "1px solid #00aa4044", color: "#00aa40", fontSize: 9 }}>
            Ref: TXN-{(Date.now() % 900000 + 100000)}
          </div>
        </div>
      )}
    </div>
  );
}
