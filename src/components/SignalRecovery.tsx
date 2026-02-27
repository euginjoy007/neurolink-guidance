import { useState, useEffect, useCallback } from "react";

type Phase = "idle" | "transmitting" | "loss" | "reconstructing" | "restored";

interface Packet {
  index: number;
  content: string;
  lost: boolean;
  recovered: boolean;
}

const SignalRecovery = () => {
  const [input, setInput] = useState("");
  const [packets, setPackets] = useState<Packet[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [signalStrength, setSignalStrength] = useState(0);
  const [recoveredMessage, setRecoveredMessage] = useState("");

  const simulateTransmission = useCallback(() => {
    if (!input.trim()) return;

    const chunkSize = 3;
    const chunks: Packet[] = [];
    for (let i = 0; i < input.length; i += chunkSize) {
      chunks.push({
        index: Math.floor(i / chunkSize),
        content: input.slice(i, i + chunkSize),
        lost: Math.random() < 0.35,
        recovered: false,
      });
    }

    setPackets(chunks);
    setPhase("transmitting");
    setSignalStrength(0);

    // Phase 1: Transmitting
    setTimeout(() => {
      setPhase("loss");
      setSignalStrength(Math.floor(chunks.filter((c) => !c.lost).length / chunks.length * 100));
    }, 1500);

    // Phase 2: Reconstructing
    setTimeout(() => {
      setPhase("reconstructing");
    }, 3000);

    // Phase 3: Recover lost packets
    setTimeout(() => {
      const recovered = chunks.map((c) => ({
        ...c,
        recovered: c.lost,
        lost: false,
      }));
      setPackets(recovered);
      setRecoveredMessage(recovered.map((p) => p.content).join(""));
      setSignalStrength(100);
      setPhase("restored");
    }, 4500);
  }, [input]);

  const getPhaseLabel = () => {
    switch (phase) {
      case "transmitting": return { text: "Transmitting...", color: "text-neon-cyan" };
      case "loss": return { text: "Packet Loss Detected", color: "text-neon-red" };
      case "reconstructing": return { text: "Reconstructing Signal...", color: "text-neon-amber" };
      case "restored": return { text: "Message Restored", color: "text-neon-green" };
      default: return { text: "Awaiting Input", color: "text-muted-foreground" };
    }
  };

  const phaseInfo = getPhaseLabel();

  return (
    <div className="neon-border-purple bg-card/50 p-6 rounded-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
        <h3 className="font-display text-sm tracking-[0.2em] text-neon-purple">SIGNAL RECOVERY PLATFORM</h3>
      </div>
      <p className="font-mono text-xs text-muted-foreground mb-4">
        Simulate dimensional signal transmission and packet recovery.
      </p>

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && simulateTransmission()}
          placeholder="Enter message to transmit..."
          className="flex-1 bg-input border border-border px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/30 rounded-sm"
          disabled={phase !== "idle" && phase !== "restored"}
        />
        <button
          onClick={simulateTransmission}
          disabled={phase !== "idle" && phase !== "restored"}
          className="px-4 py-2 bg-neon-purple/10 border border-neon-purple/30 text-neon-purple font-mono text-xs tracking-wider hover:bg-neon-purple/20 transition-colors disabled:opacity-40 rounded-sm"
        >
          TRANSMIT
        </button>
      </div>

      {/* Signal strength */}
      <div className="mb-4">
        <div className="flex justify-between font-mono text-[10px] text-muted-foreground mb-1">
          <span>SIGNAL STRENGTH</span>
          <span className={phaseInfo.color}>{signalStrength}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-700 rounded-full"
            style={{
              width: `${signalStrength}%`,
              backgroundColor:
                signalStrength < 30 ? "hsl(0 90% 55%)" :
                signalStrength < 70 ? "hsl(40 100% 55%)" :
                "hsl(140 80% 50%)",
              boxShadow: `0 0 8px ${
                signalStrength < 30 ? "hsl(0 90% 55% / 0.5)" :
                signalStrength < 70 ? "hsl(40 100% 55% / 0.5)" :
                "hsl(140 80% 50% / 0.5)"
              }`,
            }}
          />
        </div>
      </div>

      {/* Status */}
      <div className={`font-mono text-xs mb-4 ${phaseInfo.color}`}>
        ▸ {phaseInfo.text}
      </div>

      {/* Packet grid */}
      {packets.length > 0 && (
        <div className="mb-4">
          <span className="font-mono text-[10px] text-muted-foreground mb-2 block">PACKET VISUALIZATION</span>
          <div className="flex flex-wrap gap-1">
            {packets.map((p) => (
              <div
                key={p.index}
                className={`px-2 py-1 font-mono text-[10px] border rounded-sm transition-all duration-300 ${
                  p.lost
                    ? "border-neon-red/50 bg-neon-red/10 text-neon-red line-through"
                    : p.recovered
                    ? "border-neon-green/50 bg-neon-green/10 text-neon-green"
                    : "border-primary/30 bg-primary/5 text-primary"
                }`}
              >
                {p.lost ? "███" : p.content}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recovered message */}
      {phase === "restored" && (
        <div className="neon-border bg-neon-green/5 px-4 py-3 font-mono text-sm text-neon-green animate-fade-in">
          ◆ Recovered: "{recoveredMessage}"
        </div>
      )}
    </div>
  );
};

export default SignalRecovery;
