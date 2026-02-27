import { useEffect, useState } from "react";

const StatusBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-2 bg-background/90 backdrop-blur-md neon-border border-t-0 border-x-0">
      <div className="flex items-center gap-4">
        <span className="font-display text-xs tracking-[0.3em] text-primary neon-text">
          NEUROLINK
        </span>
        <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
        <span className="font-mono text-[10px] text-muted-foreground">SYSTEM ACTIVE</span>
      </div>
      <div className="flex items-center gap-6">
        <span className="font-mono text-[10px] text-muted-foreground">
          SIGNAL: <span className="text-neon-cyan">MONITORING</span>
        </span>
        <span className="font-mono text-[10px] text-primary">
          {time.toLocaleTimeString("en-US", { hour12: false })}
        </span>
      </div>
    </div>
  );
};

export default StatusBar;
