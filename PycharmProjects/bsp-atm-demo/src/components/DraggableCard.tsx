import { RefObject, useRef, useState, useCallback, useEffect } from "react";

interface DraggableCardProps {
  cardSlotRef: RefObject<HTMLDivElement | null>;
  onInserted: () => void;
}

export default function DraggableCard({ cardSlotRef, onInserted }: DraggableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [inserted, setInserted] = useState(false);
  const [snapTarget, setSnapTarget] = useState<{ x: number; y: number } | null>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const startMouseRef = useRef({ x: 0, y: 0 });

  // Initial position — lower-left quadrant, near the ATM
  const [origin] = useState(() => {
    const vw = window.innerWidth, vh = window.innerHeight;
    return { x: vw * 0.5 - 210, y: vh * 0.72 };
  });

  const checkProximity = useCallback((currentX: number, currentY: number) => {
    const slotEl = cardSlotRef.current;
    if (!slotEl) return false;
    const slotRect = slotEl.getBoundingClientRect();
    const cardEl = cardRef.current;
    if (!cardEl) return false;
    const cardRect = cardEl.getBoundingClientRect();
    const cardCX = cardRect.left + cardRect.width / 2;
    const cardCY = cardRect.top + cardRect.height / 2;
    const slotCX = slotRect.left + slotRect.width / 2;
    const slotCY = slotRect.top + slotRect.height / 2;
    const dist = Math.sqrt((cardCX - slotCX) ** 2 + (cardCY - slotCY) ** 2);
    return dist < 80;
  }, [cardSlotRef]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (inserted) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    startPosRef.current = { ...pos };
    startMouseRef.current = { x: e.clientX, y: e.clientY };
  }, [inserted, pos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging || inserted) return;
    const dx = e.clientX - startMouseRef.current.x;
    const dy = e.clientY - startMouseRef.current.y;
    setPos({ x: startPosRef.current.x + dx, y: startPosRef.current.y + dy });
  }, [dragging, inserted]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(false);
    const near = checkProximity(pos.x, pos.y);
    if (near) {
      const slotEl = cardSlotRef.current;
      const cardEl = cardRef.current;
      if (slotEl && cardEl) {
        const slotRect = slotEl.getBoundingClientRect();
        const cardRect = cardEl.getBoundingClientRect();
        const dx = (slotRect.left + slotRect.width / 2) - (cardRect.left + cardRect.width / 2);
        const dy = (slotRect.top + slotRect.height / 2) - (cardRect.top + cardRect.height / 2);
        setSnapTarget({ x: pos.x + dx, y: pos.y + dy });
        setInserted(true);
        setTimeout(() => onInserted(), 500);
      }
    } else {
      // Snap back
      setPos({ x: 0, y: 0 });
    }
  }, [dragging, pos, checkProximity, cardSlotRef, onInserted]);

  const isNear = dragging && checkProximity(pos.x, pos.y);

  return (
    <div
      ref={cardRef}
      className={`bsp-card${dragging ? " dragging" : ""}${inserted ? " card-inserting" : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: "fixed",
        left: origin.x + pos.x,
        top: origin.y + pos.y,
        width: 200,
        height: 126,
        borderRadius: 12,
        zIndex: 500,
        transition: inserted ? "none" : dragging ? "none" : "left 0.35s cubic-bezier(0.34,1.56,0.64,1), top 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        "--card-dx": snapTarget ? `${snapTarget.x - pos.x}px` : "0px",
        "--card-dy": snapTarget ? `${snapTarget.y - pos.y}px` : "0px",
      } as React.CSSProperties}
    >
      {/* BSP Card Design */}
      <div
        style={{
          width: "100%", height: "100%", borderRadius: 12, overflow: "hidden", position: "relative",
          background: "linear-gradient(135deg, #CC0000 0%, #880000 40%, #CC2200 70%, #FF4422 100%)",
          boxShadow: isNear
            ? "0 0 0 3px #F5A323, 0 0 30px #F5A32388, 0 8px 28px rgba(0,0,0,0.6)"
            : "0 8px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.2)",
          border: isNear ? "2px solid #F5A323" : "1.5px solid rgba(255,255,255,0.15)",
          transition: "box-shadow 0.2s, border 0.2s",
        }}
      >
        {/* Holographic stripe */}
        <div style={{
          position: "absolute", top: 0, right: 0, bottom: 0, width: 40,
          background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(245,163,35,0.12) 50%, rgba(255,255,255,0.05) 100%)",
        }} />
        {/* Diagonal pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.03) 8px, rgba(255,255,255,0.03) 9px)",
        }} />
        {/* Top row */}
        <div style={{ position: "absolute", top: 10, left: 12, right: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}>BSP</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 9, fontWeight: 700, letterSpacing: "0.06em" }}>BANK SOUTH PACIFIC</span>
          </div>
          {/* Visa-style brand mark */}
          <div style={{ display: "flex", gap: -4 }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,180,0,0.7)" }} />
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,80,0,0.7)", marginLeft: -10 }} />
          </div>
        </div>

        {/* Chip */}
        <div style={{
          position: "absolute", top: 46, left: 14,
          width: 36, height: 28, borderRadius: 4,
          background: "linear-gradient(135deg, #d4a843 0%, #b8892e 50%, #d4a843 100%)",
          border: "1px solid rgba(180,140,40,0.8)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 26, height: 20, border: "1px solid rgba(150,110,30,0.6)", borderRadius: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, padding: 2 }}>
            {[0,1,2,3].map(i => <div key={i} style={{ background: "rgba(150,110,30,0.4)", borderRadius: 1 }} />)}
          </div>
        </div>

        {/* Card number */}
        <div style={{
          position: "absolute", bottom: 32, left: 12, right: 12,
          fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.85)",
          letterSpacing: "0.14em", fontWeight: 700,
        }}>
          6012  3456  7890  1234
        </div>

        {/* Bottom row */}
        <div style={{ position: "absolute", bottom: 10, left: 12, right: 12, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 6, letterSpacing: "0.1em" }}>CARD HOLDER</div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 9, fontWeight: 700, letterSpacing: "0.04em" }}>JOHN D. CITIZEN</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 6, letterSpacing: "0.1em" }}>EXPIRES</div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 9, fontWeight: 700 }}>12/27</div>
          </div>
        </div>

        {/* Magnetic stripe */}
        <div style={{
          position: "absolute", top: 42, left: 0, right: 0, height: 0,
        }} />
      </div>

      {/* Proximity hint */}
      {isNear && (
        <div style={{
          position: "absolute", bottom: -28, left: "50%", transform: "translateX(-50%)",
          background: "#F5A323", color: "#000", borderRadius: 20, padding: "3px 10px",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", whiteSpace: "nowrap",
          boxShadow: "0 2px 8px rgba(245,163,35,0.5)",
        }}>
          RELEASE TO INSERT
        </div>
      )}

      {/* Drag hint (idle) */}
      {!dragging && !inserted && (
        <div style={{
          position: "absolute", bottom: -26, left: "50%", transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.5)", fontSize: 9, letterSpacing: "0.1em", whiteSpace: "nowrap",
          textAlign: "center",
        }}>
          ↑ DRAG CARD TO SLOT ↑
        </div>
      )}
    </div>
  );
}
