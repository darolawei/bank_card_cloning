interface WarningBannerProps {
  onClose: () => void;
}

export default function WarningBanner({ onClose }: WarningBannerProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 warning-banner"
      style={{
        background: "rgba(220,38,38,0.9)",
        backdropFilter: "blur(8px)",
        borderBottom: "2px solid rgba(255,100,100,0.6)",
        boxShadow: "0 4px 24px rgba(220,38,38,0.5)",
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚠️</span>
        <div>
          <div
            className="font-black text-white text-sm tracking-wider uppercase"
            style={{ letterSpacing: "0.12em" }}
          >
            SECURITY AWARENESS DEMONSTRATION — BSP ATM SKIMMING SIMULATION
          </div>
          <div className="text-red-100 text-xs mt-0.5">
            This is a controlled security awareness prototype. No real data was captured.
            Skimming devices steal your card details and PIN — always inspect ATMs before use.
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="ml-4 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex-shrink-0"
        style={{
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "white",
          letterSpacing: "0.14em",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.15)";
        }}
      >
        Restart Demo
      </button>
    </div>
  );
}
