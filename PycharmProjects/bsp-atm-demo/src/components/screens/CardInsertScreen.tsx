import { RefObject } from "react";

interface CardInsertScreenProps {
  cardSlotRef: RefObject<HTMLDivElement | null>;
  onInserted: () => void;
}

export default function CardInsertScreen({ }: CardInsertScreenProps) {
  return (
    <div
      className="flex flex-col items-center justify-between screen-slide-in"
      style={{
        minHeight: 260, padding: "20px",
        background: "linear-gradient(180deg, #1a0000 0%, #0a0a0a 100%)",
      }}
    >
      {/* Header */}
      <div className="flex flex-col items-center mb-2">
        <div className="text-white font-bold mb-1" style={{ fontSize: 13, letterSpacing: "0.06em" }}>INSERT YOUR CARD</div>
        <div style={{ height: 1.5, width: 180, background: "linear-gradient(90deg, transparent, #CC0000, transparent)" }} />
      </div>

      {/* Card slot illustration */}
      <div className="flex flex-col items-center gap-3 my-2">
        {/* Animated arrow pointing down toward card slot */}
        <div className="flex flex-col items-center gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: 0, height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderTop: `10px solid rgba(245,163,35,${0.3 + i * 0.25})`,
                animation: `arrow-bounce ${0.7 + i * 0.1}s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

        {/* Card slot graphic */}
        <div
          className="flex items-center justify-center"
          style={{
            width: 180, height: 20,
            background: "#050505",
            border: "2px solid #CC0000",
            borderRadius: 4,
            boxShadow: "0 0 16px #CC000066",
          }}
        >
          <div style={{ width: 140, height: 3, background: "linear-gradient(90deg, transparent, #CC0000, #FF6666, #CC0000, transparent)", borderRadius: 2 }} />
        </div>

        <div style={{ color: "#888", fontSize: 9, letterSpacing: "0.12em", textAlign: "center" }}>
          CARD SLOT
        </div>
      </div>

      {/* Instruction */}
      <div
        className="w-full rounded-xl p-3"
        style={{ background: "rgba(204,0,0,0.12)", border: "1px solid rgba(204,0,0,0.3)" }}
      >
        <div className="text-center" style={{ color: "#ffaaaa", fontSize: 10, lineHeight: 1.5 }}>
          Drag your BSP card to the card slot below the screen.
        </div>
        <div className="flex items-center justify-center gap-2 mt-2" style={{ color: "#F5A323", fontSize: 9 }}>
          <span className="arrow-bounce">→</span>
          <span>Grab the card and drag it up to insert</span>
          <span className="arrow-bounce">←</span>
        </div>
      </div>
    </div>
  );
}
