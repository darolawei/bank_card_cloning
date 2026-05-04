interface SkimmerTerminalProps {
  logs: string[];
}

export default function SkimmerTerminal({ logs }: SkimmerTerminalProps) {
  return (
    <div
      className="fixed skimmer-reveal danger-pulse"
      style={{
        top: "2.5%",
        right: "2%",
        width: "340px",
        zIndex: 1000,
        background: "linear-gradient(160deg, #030a03 0%, #050f05 100%)",
        border: "2px solid #ff3300",
        borderRadius: "8px",
        boxShadow:
          "0 0 40px rgba(255,51,0,0.35), 0 8px 32px rgba(0,0,0,0.8), inset 0 0 24px rgba(0,255,60,0.03)",
        fontFamily: "'Courier New', monospace",
        overflow: "hidden",
      }}
    >
      {/* Terminal header */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{
          background: "linear-gradient(90deg, #0d0d0d 0%, #1a0000 100%)",
          borderBottom: "1px solid #ff330033",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="rounded-full"
            style={{
              width: 8,
              height: 8,
              background: "#ff3300",
              boxShadow: "0 0 6px #ff3300",
            }}
          />
          <span
            className="font-bold text-xs tracking-widest uppercase"
            style={{ color: "#ff4400", letterSpacing: "0.2em" }}
          >
            SKIMMER TERMINAL
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="rounded-full"
            style={{
              width: 6,
              height: 6,
              background: "#ff0000",
              boxShadow: "0 0 4px #ff0000",
              animation: "cursor-blink 0.8s steps(1) infinite",
            }}
          />
          <span style={{ color: "#ff0000", fontSize: 9 }}>LIVE</span>
        </div>
      </div>

      {/* Terminal body */}
      <div
        className="p-3"
        style={{
          minHeight: "200px",
          background: "radial-gradient(ellipse at top left, #001a00 0%, #000500 100%)",
        }}
      >
        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
            zIndex: 1,
          }}
        />

        <div className="relative" style={{ zIndex: 2 }}>
          {logs.map((line, i) => (
            <div
              key={i}
              className="log-line"
              style={{
                color:
                  line.includes("CLONED") || line.includes("EXFILTRATED")
                    ? "#ff4400"
                    : line.includes("INTERCEPTED") || line.includes("CAPTURED")
                    ? "#ffaa00"
                    : line.includes("SKIMMER") || line.includes("━")
                    ? "#ff6600"
                    : "#00ee55",
                fontSize: 11,
                lineHeight: "1.7",
                textShadow:
                  line.includes("CLONED") || line.includes("EXFILTRATED")
                    ? "0 0 8px #ff4400"
                    : "0 0 6px #00ee5588",
                fontFamily: "'Courier New', monospace",
                whiteSpace: "pre",
                animationDelay: `${i * 0.05}s`,
              }}
            >
              {line}
            </div>
          ))}

          {/* Blinking cursor */}
          {logs.length > 0 && (
            <div
              className="cursor-blink mt-1"
              style={{
                color: "#00ee55",
                fontSize: 12,
                textShadow: "0 0 6px #00ee55",
              }}
            >
              ▌
            </div>
          )}
        </div>
      </div>

      {/* Warning footer */}
      <div
        className="px-3 py-2 text-center"
        style={{
          background: "rgba(255,0,0,0.08)",
          borderTop: "1px solid #ff330022",
          color: "#ff4400",
          fontSize: 9,
          letterSpacing: "0.1em",
          textShadow: "0 0 8px #ff4400",
        }}
      >
        ⚠ DATA TRANSMITTED TO REMOTE SERVER ⚠
      </div>
    </div>
  );
}
