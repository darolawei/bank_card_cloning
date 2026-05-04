import { useEffect, useState } from "react";

interface HomeScreenProps { onTap: () => void; }

export default function HomeScreen({ onTap }: HomeScreenProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const hh = time.getHours().toString().padStart(2, "0");
  const mm = time.getMinutes().toString().padStart(2, "0");
  const ss = time.getSeconds().toString().padStart(2, "0");
  const dateStr = `${dayNames[time.getDay()]}, ${monthNames[time.getMonth()]} ${time.getDate()}, ${time.getFullYear()}`;

  return (
    <div
      className="flex flex-col items-center justify-between cursor-pointer screen-slide-in"
      style={{
        minHeight: 260, padding: "18px 20px",
        background: "linear-gradient(180deg, #CC0000 0%, #990000 30%, #0a0a0a 100%)",
      }}
      onClick={onTap}
    >
      {/* Top BSP branding */}
      <div className="flex flex-col items-center">
        {/* Logo circle */}
        <div
          className="flex items-center justify-center rounded-full mb-2"
          style={{
            width: 64, height: 64,
            background: "radial-gradient(circle, #ffffff 0%, #f0e8d0 100%)",
            border: "3px solid rgba(255,255,255,0.5)",
            boxShadow: "0 4px 18px rgba(0,0,0,0.5)",
          }}
        >
          <span style={{ color: "#CC0000", fontSize: 18, fontWeight: 900, letterSpacing: "-0.04em" }}>BSP</span>
        </div>
        <div className="text-white font-black" style={{ fontSize: 16, letterSpacing: "0.12em", textShadow: "0 2px 6px rgba(0,0,0,0.5)" }}>
          BANK SOUTH PACIFIC
        </div>
        <div style={{ height: 1.5, width: 200, background: "linear-gradient(90deg, transparent, #F5A323, transparent)", margin: "6px 0" }} />
        <div className="text-red-200" style={{ fontSize: 8, letterSpacing: "0.14em" }}>
          AUTOMATED TELLER MACHINE
        </div>
      </div>

      {/* Clock */}
      <div className="flex flex-col items-center my-2">
        <div
          className="font-mono font-bold"
          style={{ fontSize: 34, color: "#ffffff", textShadow: "0 0 20px rgba(255,255,255,0.25)", letterSpacing: "0.06em" }}
        >
          {hh}:{mm}<span className="cursor-blink" style={{ fontSize: 28, color: "#ffcc88" }}>:{ss}</span>
        </div>
        <div style={{ color: "#ffcc88", fontSize: 9, letterSpacing: "0.12em", marginTop: 2 }}>{dateStr}</div>
      </div>

      {/* Welcome message */}
      <div
        className="flex flex-col items-center py-3 px-4 rounded-xl"
        style={{
          background: "rgba(0,0,0,0.45)",
          border: "1px solid rgba(245,163,35,0.4)",
          width: "100%",
        }}
      >
        <div className="text-white font-bold mb-1" style={{ fontSize: 13, letterSpacing: "0.06em" }}>
          Welcome to BSP ATM
        </div>
        <div style={{ color: "#ffcc88", fontSize: 10, letterSpacing: "0.08em", textAlign: "center" }}>
          Please insert your card to begin
        </div>
        {/* Pulsing touch indicator */}
        <div className="flex items-center gap-2 mt-2" style={{ color: "#aaa", fontSize: 9, letterSpacing: "0.1em" }}>
          <div className="arrow-bounce" style={{ color: "#F5A323", fontSize: 12 }}>▶</div>
          <span>TAP SCREEN TO CONTINUE</span>
          <div className="arrow-bounce" style={{ color: "#F5A323", fontSize: 12 }}>◀</div>
        </div>
      </div>
    </div>
  );
}
