import { useState, useEffect, useRef, useCallback } from "react";

interface Memory {
  id: number;
  text: string;
  timestamp: string;
  image?: string; // base64 data URL
}

interface GraphNode {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  timestamp: string;
  image?: string;
}

const MemoryNavigator = () => {
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = localStorage.getItem("neurolink-memories");
    return saved ? JSON.parse(saved) : [];
  });
  const [showAnchor, setShowAnchor] = useState(false);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [dragNode, setDragNode] = useState<number | null>(null);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 350 });

  useEffect(() => {
    localStorage.setItem("neurolink-memories", JSON.stringify(memories));
  }, [memories]);

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDimensions({ width, height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Sync nodes with memories
  useEffect(() => {
    setNodes((prev) => {
      const cx = dimensions.width / 2;
      const cy = dimensions.height / 2;
      return memories.map((m, i) => {
        const existing = prev.find((n) => n.id === m.id);
        if (existing) return { ...existing, text: m.text, timestamp: m.timestamp, image: m.image };
        const angle = (i / Math.max(memories.length, 1)) * Math.PI * 2 + Math.random() * 0.5;
        const radius = 60 + Math.random() * Math.min(cx, cy) * 0.5;
        return {
          id: m.id,
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          vx: 0,
          vy: 0,
          text: m.text,
          timestamp: m.timestamp,
          image: m.image,
        };
      });
    });
  }, [memories, dimensions]);

  // Simple force simulation
  useEffect(() => {
    if (nodes.length < 2) return;
    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;

    const tick = () => {
      setNodes((prev) => {
        const next = prev.map((n) => ({ ...n }));
        const padding = 30;

        for (let i = 0; i < next.length; i++) {
          if (next[i].id === dragNode) continue;

          next[i].vx += (cx - next[i].x) * 0.002;
          next[i].vy += (cy - next[i].y) * 0.002;

          for (let j = 0; j < next.length; j++) {
            if (i === j) continue;
            const dx = next[i].x - next[j].x;
            const dy = next[i].y - next[j].y;
            const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
            const force = 800 / (dist * dist);
            next[i].vx += (dx / dist) * force;
            next[i].vy += (dy / dist) * force;
          }

          if (i > 0) {
            const dx = next[i].x - next[i - 1].x;
            const dy = next[i].y - next[i - 1].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const ideal = 100;
            const force = (dist - ideal) * 0.01;
            next[i].vx -= (dx / dist) * force;
            next[i].vy -= (dy / dist) * force;
          }

          next[i].vx *= 0.85;
          next[i].vy *= 0.85;
          next[i].x += next[i].vx;
          next[i].y += next[i].vy;

          next[i].x = Math.max(padding, Math.min(dimensions.width - padding, next[i].x));
          next[i].y = Math.max(padding, Math.min(dimensions.height - padding, next[i].y));
        }
        return next;
      });
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [nodes.length, dragNode, dimensions]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500_000) {
      // Resize large images
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const max = 200;
        let w = img.width, h = img.height;
        if (w > h) { h = (h / w) * max; w = max; } else { w = (w / h) * max; h = max; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        setImagePreview(canvas.toDataURL("image/jpeg", 0.7));
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } else {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const storeMemory = () => {
    if (!input.trim()) return;
    const newMemory: Memory = {
      id: Date.now(),
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      image: imagePreview || undefined,
    };
    setMemories((prev) => [...prev, newMemory]);
    setInput("");
    clearImage();
    setShowAnchor(true);
    setTimeout(() => setShowAnchor(false), 2000);
  };

  const deleteMemory = (id: number) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    if (selectedNode === id) setSelectedNode(null);
  };

  const handleMouseDown = useCallback((id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setDragNode(id);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (dragNode === null || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setNodes((prev) =>
        prev.map((n) => (n.id === dragNode ? { ...n, x, y, vx: 0, vy: 0 } : n))
      );
    },
    [dragNode]
  );

  const handleMouseUp = useCallback(() => setDragNode(null), []);

  const selectedMemory = nodes.find((n) => n.id === selectedNode);

  return (
    <div className="neon-border bg-card/50 p-6 rounded-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
        <h3 className="font-display text-sm tracking-[0.2em] text-primary">MEMORY NAVIGATOR</h3>
        <span className="ml-auto font-mono text-[10px] text-muted-foreground">
          {memories.length} NODE{memories.length !== 1 ? "S" : ""}
        </span>
      </div>
      <p className="font-mono text-xs text-muted-foreground mb-4">
        Record decisions. Attach photos. Nodes connect chronologically in the cognitive map.
      </p>

      {/* Input */}
      <div className="flex gap-2 mb-2">
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
          STORE
        </button>
      </div>

      {/* Photo attach row */}
      <div className="flex items-center gap-3 mb-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-border/60 text-muted-foreground font-mono text-[10px] tracking-wider hover:border-primary/50 hover:text-primary transition-colors rounded-sm"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          ATTACH PHOTO
        </button>
        {imagePreview && (
          <div className="flex items-center gap-2 animate-fade-in">
            <img src={imagePreview} alt="preview" className="w-8 h-8 rounded-sm border border-primary/40 object-cover" />
            <button onClick={clearImage} className="font-mono text-[10px] text-destructive/70 hover:text-destructive transition-colors">[×]</button>
          </div>
        )}
      </div>

      {showAnchor && (
        <div className="neon-border bg-primary/5 px-3 py-2 mb-4 font-mono text-xs text-primary animate-fade-in">
          ◆ Memory Anchor Stored — Node added to cognitive map.
        </div>
      )}

      {/* Graph */}
      <div
        ref={containerRef}
        className="relative w-full border border-border/50 rounded-sm bg-background/30 overflow-hidden"
        style={{ height: 350 }}
      >
        {nodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-muted-foreground/50">
            No nodes. Store a memory to begin mapping.
          </div>
        ) : (
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full h-full"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="hsl(var(--border))" strokeWidth="0.3" opacity="0.3" />
              </pattern>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-strong">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Clip paths for node images */}
              {nodes.map((n) =>
                n.image ? (
                  <clipPath key={`clip-${n.id}`} id={`clip-${n.id}`}>
                    <circle cx={n.x} cy={n.y} r={selectedNode === n.id || hoveredNode === n.id ? 14 : 10} />
                  </clipPath>
                ) : null
              )}
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Edges */}
            {nodes.map((n, i) => {
              if (i === 0) return null;
              const prev = nodes[i - 1];
              const isActive = selectedNode === n.id || selectedNode === prev.id;
              return (
                <g key={`edge-${n.id}`}>
                  <line
                    x1={prev.x}
                    y1={prev.y}
                    x2={n.x}
                    y2={n.y}
                    stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.25)"}
                    strokeWidth={isActive ? 2 : 1}
                    filter={isActive ? "url(#glow)" : undefined}
                    strokeDasharray={isActive ? undefined : "4 4"}
                  />
                  <circle
                    cx={(prev.x + n.x) / 2}
                    cy={(prev.y + n.y) / 2}
                    r={2}
                    fill={isActive ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.3)"}
                  />
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((n, i) => {
              const isSelected = selectedNode === n.id;
              const isHovered = hoveredNode === n.id;
              const active = isSelected || isHovered;
              const r = active ? 14 : 10;
              const hasImage = !!n.image;
              return (
                <g
                  key={n.id}
                  onMouseDown={(e) => handleMouseDown(n.id, e)}
                  onClick={() => setSelectedNode(isSelected ? null : n.id)}
                  onMouseEnter={() => setHoveredNode(n.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer"
                >
                  {/* Outer ring pulse */}
                  {active && (
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={22}
                      fill="none"
                      stroke="hsl(var(--primary) / 0.3)"
                      strokeWidth={1}
                      filter="url(#glow-strong)"
                    >
                      <animate attributeName="r" values="18;24;18" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Image indicator ring for nodes with photos */}
                  {hasImage && (
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={r + 3}
                      fill="none"
                      stroke="hsl(var(--primary) / 0.6)"
                      strokeWidth={1.5}
                      strokeDasharray="3 2"
                    />
                  )}
                  {/* Node circle / image */}
                  {hasImage ? (
                    <>
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={r}
                        fill="hsl(var(--card))"
                        stroke={active ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.5)"}
                        strokeWidth={active ? 2 : 1}
                        filter={active ? "url(#glow)" : undefined}
                      />
                      <image
                        href={n.image}
                        x={n.x - r}
                        y={n.y - r}
                        width={r * 2}
                        height={r * 2}
                        clipPath={`circle(${r}px at ${r}px ${r}px)`}
                        style={{ clipPath: `circle(${r}px at ${r}px ${r}px)` }}
                        preserveAspectRatio="xMidYMid slice"
                        opacity={active ? 1 : 0.8}
                      />
                      {/* Overlay border */}
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={r}
                        fill="none"
                        stroke={active ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.5)"}
                        strokeWidth={active ? 2 : 1}
                        filter={active ? "url(#glow)" : undefined}
                      />
                    </>
                  ) : (
                    <>
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={r}
                        fill={isSelected ? "hsl(var(--primary) / 0.3)" : "hsl(var(--card))"}
                        stroke={active ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.5)"}
                        strokeWidth={active ? 2 : 1}
                        filter={active ? "url(#glow)" : undefined}
                        className="transition-all duration-200"
                      />
                      <text
                        x={n.x}
                        y={n.y + 1}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={active ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.7)"}
                        fontSize={active ? 10 : 8}
                        fontFamily="'Rajdhani', monospace"
                        fontWeight="bold"
                      >
                        {i + 1}
                      </text>
                    </>
                  )}
                  {/* Hover label */}
                  {isHovered && !isSelected && (
                    <g>
                      <rect
                        x={n.x + 16}
                        y={n.y - 12}
                        width={Math.min(n.text.length * 6 + 16, 180)}
                        height={22}
                        rx={2}
                        fill="hsl(var(--card))"
                        stroke="hsl(var(--primary) / 0.4)"
                        strokeWidth={1}
                      />
                      <text
                        x={n.x + 24}
                        y={n.y + 1}
                        fill="hsl(var(--foreground) / 0.8)"
                        fontSize={9}
                        fontFamily="'Rajdhani', monospace"
                      >
                        {n.text.length > 26 ? n.text.slice(0, 26) + "…" : n.text}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Selected node detail */}
      {selectedMemory && (
        <div className="mt-3 neon-border bg-card/80 p-4 rounded-sm animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-primary tracking-widest">
              NODE {nodes.findIndex((n) => n.id === selectedMemory.id) + 1} — {selectedMemory.timestamp}
            </span>
            <button
              onClick={() => deleteMemory(selectedMemory.id)}
              className="font-mono text-[10px] text-destructive/70 hover:text-destructive transition-colors"
            >
              [DELETE]
            </button>
          </div>
          {selectedMemory.image && (
            <div className="mb-3">
              <img
                src={selectedMemory.image}
                alt="Memory attachment"
                className="w-full max-h-48 object-contain rounded-sm border border-primary/20"
              />
            </div>
          )}
          <p className="font-mono text-xs text-foreground/80">{selectedMemory.text}</p>
        </div>
      )}

      {/* Memory list (compact) */}
      {memories.length > 0 && (
        <div className="mt-3 space-y-1 max-h-32 overflow-y-auto">
          {memories.map((m, i) => (
            <div
              key={m.id}
              onClick={() => setSelectedNode(selectedNode === m.id ? null : m.id)}
              className={`flex items-center gap-3 px-3 py-1.5 rounded-sm cursor-pointer transition-colors text-[10px] font-mono ${
                selectedNode === m.id
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-muted/20 border border-transparent hover:bg-muted/40"
              }`}
            >
              <span className="text-primary/60 w-4">{i + 1}</span>
              {m.image && (
                <img src={m.image} alt="" className="w-4 h-4 rounded-sm object-cover border border-primary/30 flex-shrink-0" />
              )}
              <span className="text-muted-foreground whitespace-nowrap">{m.timestamp}</span>
              <span className="text-foreground/70 truncate">{m.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryNavigator;
