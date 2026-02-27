import { useEffect, useState } from "react";
import GlitchText from "./GlitchText";

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  const [signalPercent, setSignalPercent] = useState(0);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 300);
    const interval = setInterval(() => {
      setSignalPercent((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.random() * 3;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden scanline">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg" />
      
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(190_100%_50%_/_0.05)_0%,_transparent_70%)]" />

      <div className={`relative z-10 text-center transition-all duration-1000 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        {/* System init text */}
        <div className="font-mono text-xs tracking-[0.5em] text-muted-foreground mb-6 uppercase">
          Initializing rescue protocol...
        </div>

        <GlitchText
          text="NEUROLINK"
          as="h1"
          className="text-6xl md:text-8xl lg:text-9xl tracking-[0.2em] neon-text mb-2"
        />
        <h2 className="font-display text-xl md:text-3xl tracking-[0.3em] text-foreground/60 mb-8">
          RESCUE SYSTEM
        </h2>

        {/* Signal loading bar */}
        <div className="w-64 mx-auto mb-8">
          <div className="flex justify-between font-mono text-[10px] text-muted-foreground mb-1">
            <span>SIGNAL ACQUISITION</span>
            <span className="text-primary">{Math.min(100, Math.floor(signalPercent))}%</span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-100 rounded-full"
              style={{
                width: `${Math.min(100, signalPercent)}%`,
                boxShadow: "0 0 10px hsl(190 100% 50% / 0.5)",
              }}
            />
          </div>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap justify-center gap-4 font-mono text-[10px] tracking-widest">
          {["MEMORY NAVIGATOR", "SIGNAL RECOVERY", "SURVIVAL AI"].map((module, i) => (
            <div
              key={module}
              className={`px-4 py-2 neon-border transition-all duration-500 ${
                signalPercent > 30 + i * 25 ? "text-primary bg-primary/5" : "text-muted-foreground"
              }`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              {signalPercent > 30 + i * 25 ? "● " : "○ "}
              {module}
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 animate-bounce">
          <div className="w-5 h-8 rounded-full border border-primary/30 mx-auto flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-primary animate-pulse" />
          </div>
          <span className="font-mono text-[10px] text-muted-foreground mt-2 block">SCROLL TO BEGIN</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
