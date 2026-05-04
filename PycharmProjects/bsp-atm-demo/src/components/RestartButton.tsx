import { ScreenState } from "@/pages/ATMDemo";
import { useState } from "react";

interface RestartButtonProps {
  onReset: () => void;
  screen: ScreenState;
}

export default function RestartButton({ onReset, screen }: RestartButtonProps) {
  const [hovered, setHovered] = useState(false);
  const isHome = screen === "home";

  return (
    <button
      onClick={onReset}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Restart Demo"
      style={{
        position: "fixed",
        bottom: 24,
        left: 24,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: hovered ? "10px 18px" : "10px 14px",
        borderRadius: 40,
        background: isHome
          ? "rgba(255,255,255,0.06)"
          : hovered
          ? "rgba(204,0,0,0.85)"
          : "rgba(80,0,0,0.7)",
        border: isHome
          ? "1px solid rgba(255,255,255,0.1)"
          : `1px solid ${hovered ? "#FF4444" : "#CC0000"}`,
        color: isHome ? "rgba(255,255,255,0.35)" : hovered ? "#fff" : "rgba(255,200,200,0.7)",
        cursor: isHome ? "default" : "pointer",
        backdropFilter: "blur(8px)",
        boxShadow: isHome
          ? "none"
          : hovered
          ? "0 4px 20px rgba(204,0,0,0.5)"
          : "0 2px 10px rgba(0,0,0,0.4)",
        transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        fontFamily: "inherit",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.12em",
        whiteSpace: "nowrap",
        pointerEvents: isHome ? "none" : "auto",
        overflow: "hidden",
      }}
    >
      {/* Rotating icon */}
      <svg
        width="14" height="14" viewBox="0 0 14 14" fill="none"
        style={{ transition: "transform 0.4s", transform: hovered ? "rotate(-180deg)" : "rotate(0deg)" }}
      >
        <path
          d="M2 7A5 5 0 1 0 7 2v2"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        />
        <path d="M7 2L5 4.5L7 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {hovered ? "RESTART DEMO" : "↩ RESTART"}
    </button>
  );
}
