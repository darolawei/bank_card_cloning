interface Particle {
  id: number;
  x: number;
  y: number;
  text: string;
  endX: number;
  endY: number;
}

interface ParticleCanvasProps {
  particles: Particle[];
}

export default function ParticleCanvas({ particles }: ParticleCanvasProps) {
  return (
    <>
      {particles.map((p) => {
        const dx = p.endX - p.x;
        const dy = p.endY - p.y;
        return (
          <span
            key={p.id}
            className="particle"
            style={{
              left: p.x,
              top: p.y,
              "--particle-end": `translate(${dx}px, ${dy}px)`,
              animationDelay: `${Math.random() * 0.2}s`,
              animationDuration: `${0.9 + Math.random() * 0.6}s`,
            } as React.CSSProperties}
          >
            {p.text}
          </span>
        );
      })}
    </>
  );
}
