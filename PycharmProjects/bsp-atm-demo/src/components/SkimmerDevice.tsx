import { RefObject, useRef, useState } from "react";

interface SkimmerDeviceProps {
  onRemoved: () => void;
  cardSlotRef?: RefObject<HTMLDivElement | null>;
}

export default function SkimmerDevice({ onRemoved, cardSlotRef }: SkimmerDeviceProps) {
  const [dragging, setDragging] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [flung, setFlung] = useState(false);
  const [hint, setHint] = useState(true);
  const startRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    if (removed) return;
    setHint(false);
    setDragging(true);
    startRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || removed) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    posRef.current = { x: dx, y: dy };
    setPos({ x: dx, y: dy });
  };

  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    const dist = Math.hypot(posRef.current.x, posRef.current.y);
    if (dist > 70) {
      // Fling it away
      setFlung(true);
      setPos({ x: posRef.current.x * 5, y: posRef.current.y * 5 - 80 });
      setTimeout(() => {
        setRemoved(true);
        onRemoved();
      }, 500);
    } else {
      // Snap back
      setPos({ x: 0, y: 0 });
    }
  };

  if (removed) return null;

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Real card slot (visible underneath, holds the ref for card snapping) */}
      <div
        ref={cardSlotRef}
        style={{
          width: 200, height: 16,
          background: "linear-gradient(90deg, #0a0a0a, #1a1a1a, #0a0a0a)",
          border: "2px solid #CC0000",
          borderRadius: 4,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{ width: 160, height: 3, background: "linear-gradient(90deg, transparent, #CC0000, #FF4444, #CC0000, transparent)", borderRadius: 2, opacity: 0.7 }} />
      </div>

      {/* ===== SKIMMER OVERLAY ===== */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          position: "absolute",
          top: -8,
          left: "50%",
          transform: `translateX(-50%) translate(${pos.x}px, ${pos.y}px)`,
          transition: flung
            ? "transform 0.45s cubic-bezier(0.2,0,0.8,1), opacity 0.45s"
            : dragging
            ? "none"
            : "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          opacity: flung ? 0 : 1,
          zIndex: 20,
          cursor: dragging ? "grabbing" : "grab",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        {/* The skimmer device body */}
        <div
          style={{
            width: 220,
            background: "linear-gradient(160deg, #3a3228 0%, #2a2218 50%, #1e1a12 100%)",
            borderRadius: 5,
            border: "1.5px solid rgba(255,200,100,0.18)",
            boxShadow: dragging
              ? "0 12px 32px rgba(0,0,0,0.9), 0 0 0 2px rgba(255,160,0,0.4)"
              : "0 4px 12px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.06) inset",
            padding: "5px 10px 4px",
            transition: dragging ? "none" : "box-shadow 0.2s",
          }}
        >
          <div className="flex items-center justify-between">
            {/* Card slot slit */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
              {/* The fake slot opening */}
              <div
                style={{
                  width: 140, height: 5,
                  background: "#0a0a0a",
                  borderRadius: 2,
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.9)",
                }}
              />
            </div>

            {/* Right side — indicator + label */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
              {/* Blinking green LED (looks legitimate) */}
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <div
                  style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: "#00cc44",
                    boxShadow: "0 0 5px #00cc44",
                    animation: "cursor-blink 1.2s steps(1) infinite",
                  }}
                />
                <span style={{ color: "rgba(180,160,100,0.5)", fontSize: 6, letterSpacing: "0.08em" }}>READY</span>
              </div>
            </div>
          </div>

          {/* Tiny brand text — looks like the ATM brand */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
            <span style={{ color: "rgba(200,180,120,0.35)", fontSize: 5.5, letterSpacing: "0.14em" }}>
              BSP CARD READER v2
            </span>
            {/* Suspicious tiny wires */}
            <div style={{ display: "flex", gap: 2 }}>
              {["#ff4400","#00aaff","#00cc44"].map((c, i) => (
                <div key={i} style={{ width: 1, height: 8, background: c, opacity: 0.4, borderRadius: 1 }} />
              ))}
            </div>
          </div>
        </div>

        {/* Drag hint */}
        {hint && (
          <div
            style={{
              position: "absolute",
              bottom: -22,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(255,160,0,0.15)",
              border: "1px solid rgba(255,160,0,0.3)",
              borderRadius: 10,
              padding: "2px 8px",
              color: "#ffaa44",
              fontSize: 8,
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              animation: "fade-in 1s 1s both",
            }}
          >
            ← DRAG TO REVEAL →
          </div>
        )}
      </div>

      <div style={{ color: "#888", fontSize: 8, letterSpacing: "0.14em", marginTop: 22, textAlign: "center" }}>
        ◄ INSERT / REMOVE CARD ►
      </div>
    </div>
  );
}
