import { useState, useEffect } from "react";

interface Memory {
  id: number;
  text: string;
  timestamp: string;
}

const MemoryNavigator = () => {
  const [input, setInput] = useState("");
  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = localStorage.getItem("neurolink-memories");
    return saved ? JSON.parse(saved) : [];
  });
  const [showAnchor, setShowAnchor] = useState(false);

  useEffect(() => {
    localStorage.setItem("neurolink-memories", JSON.stringify(memories));
  }, [memories]);

  const storeMemory = () => {
    if (!input.trim()) return;
    const newMemory: Memory = {
      id: Date.now(),
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
    };
    setMemories((prev) => [newMemory, ...prev]);
    setInput("");
    setShowAnchor(true);
    setTimeout(() => setShowAnchor(false), 2000);
  };

  return (
    <div className="neon-border bg-card/50 p-6 rounded-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
        <h3 className="font-display text-sm tracking-[0.2em] text-primary">MEMORY NAVIGATOR</h3>
      </div>
      <p className="font-mono text-xs text-muted-foreground mb-4">
        Record safe decisions and critical actions for future reference.
      </p>

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && storeMemory()}
          placeholder="Describe action or safe decision..."
          className="flex-1 bg-input border border-border px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 rounded-sm"
        />
        <button
          onClick={storeMemory}
          className="px-4 py-2 bg-primary/10 border border-primary/30 text-primary font-mono text-xs tracking-wider hover:bg-primary/20 transition-colors rounded-sm"
        >
          STORE MEMORY
        </button>
      </div>

      {/* Anchor animation */}
      {showAnchor && (
        <div className="neon-border bg-primary/5 px-3 py-2 mb-4 font-mono text-xs text-primary animate-fade-in">
          ◆ Memory Anchor Stored — Decision logged to cognitive map.
        </div>
      )}

      {/* Memory log */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {memories.length === 0 ? (
          <div className="font-mono text-xs text-muted-foreground text-center py-6 opacity-50">
            No memories stored. Begin recording.
          </div>
        ) : (
          memories.map((m) => (
            <div key={m.id} className="flex gap-3 px-3 py-2 bg-muted/30 border border-border/50 rounded-sm">
              <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">
                {m.timestamp}
              </span>
              <span className="font-mono text-xs text-foreground/80">{m.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemoryNavigator;
