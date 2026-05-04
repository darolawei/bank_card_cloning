import { useEffect, useRef, useState } from "react";

const TIPS = [
  "⚠  SECURITY AWARENESS DEMO — This is a controlled BSP ATM skimming simulation for educational purposes only",
  "🛡  ATM SAFETY TIP: Always inspect the card slot before inserting your card — skimmers can be attached externally",
  "👀  ATM SAFETY TIP: Cover the keypad with your hand when entering your PIN to prevent shoulder-surfing",
  "📵  ATM SAFETY TIP: Never accept help from strangers at an ATM — criminals may try to distract you",
  "🔒  ATM SAFETY TIP: Use ATMs located inside banks or well-lit public areas when possible",
  "📞  ATM SAFETY TIP: If your card is retained by an ATM, call your bank immediately — do not leave the machine",
  "🚫  ATM SAFETY TIP: Never share your PIN with anyone — your bank will NEVER ask for it",
  "⚠  SECURITY AWARENESS DEMO — Skimming devices steal card data and PINs silently. Protect yourself.",
];

export default function SecurityTicker() {
  const [tipIndex, setTipIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const cycle = () => {
      setVisible(false);
      timerRef.current = setTimeout(() => {
        setTipIndex(i => (i + 1) % TIPS.length);
        setVisible(true);
      }, 500);
    };
    const id = setInterval(cycle, 5000);
    return () => { clearInterval(id); clearTimeout(timerRef.current); };
  }, []);

  const isDemo = tipIndex === 0 || tipIndex === TIPS.length - 1;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 py-1.5 overflow-hidden"
      style={{
        background: isDemo
          ? "linear-gradient(90deg, rgba(100,0,0,0.92), rgba(160,0,0,0.92))"
          : "linear-gradient(90deg, rgba(10,20,10,0.88), rgba(20,40,20,0.88))",
        backdropFilter: "blur(6px)",
        borderBottom: `1px solid ${isDemo ? "rgba(255,50,50,0.3)" : "rgba(0,200,60,0.2)"}`,
        transition: "background 0.5s",
        height: 32,
      }}
    >
      {/* Icon badge */}
      <div
        style={{
          flexShrink: 0,
          padding: "1px 8px",
          borderRadius: 20,
          background: isDemo ? "rgba(255,0,0,0.25)" : "rgba(0,180,60,0.2)",
          border: `1px solid ${isDemo ? "rgba(255,80,80,0.4)" : "rgba(0,200,60,0.3)"}`,
          color: isDemo ? "#ff8888" : "#44dd88",
          fontSize: 8,
          fontWeight: 800,
          letterSpacing: "0.1em",
          marginRight: 10,
        }}
      >
        {isDemo ? "DEMO" : "TIPS"}
      </div>

      {/* Scrolling tip */}
      <div
        style={{
          fontSize: 10,
          color: isDemo ? "#ffaaaa" : "#88ddaa",
          letterSpacing: "0.06em",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-6px)",
          transition: "opacity 0.4s, transform 0.4s",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {TIPS[tipIndex]}
      </div>
    </div>
  );
}
