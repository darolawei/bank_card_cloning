interface ProcessingScreenProps { showSuccess: boolean; }

export default function ProcessingScreen({ showSuccess }: ProcessingScreenProps) {
  return (
    <div
      className="flex flex-col items-center justify-center screen-slide-in"
      style={{
        minHeight: 260, padding: "20px",
        background: "linear-gradient(180deg, #0a0a0a 0%, #050505 100%)",
        position: "relative",
      }}
    >
      {/* Spinner */}
      <svg width="72" height="72" viewBox="0 0 72 72" style={{ marginBottom: 16 }}>
        <circle cx="36" cy="36" r="30" fill="none" stroke="#1a1a1a" strokeWidth="5" />
        <circle
          cx="36" cy="36" r="30" fill="none" stroke="#CC0000" strokeWidth="5"
          strokeDasharray="188" strokeDashoffset="140" strokeLinecap="round"
          style={{ transformOrigin: "center", animation: "spin 1s linear infinite" }}
        />
      </svg>
      <div className="font-bold text-white mb-1" style={{ fontSize: 13, letterSpacing: "0.1em" }}>
        PROCESSING...
      </div>
      <div style={{ color: "#555", fontSize: 9, letterSpacing: "0.12em" }}>Please wait. Do not remove card.</div>

      {showSuccess && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center success-flash"
          style={{ background: "rgba(0,15,0,0.94)", zIndex: 20, borderRadius: 6 }}
        >
          <div
            className="flex items-center justify-center rounded-full mb-3"
            style={{ width: 64, height: 64, background: "rgba(0,200,80,0.12)", border: "2px solid #00c850", boxShadow: "0 0 28px #00c85088" }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M8 19L15 26L28 11" stroke="#00c850" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="font-bold" style={{ color: "#00c850", fontSize: 16, letterSpacing: "0.08em" }}>TRANSACTION SUCCESSFUL</div>
          <div style={{ color: "#00aa40", fontSize: 10, marginTop: 4 }}>Thank you for banking with BSP.</div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
