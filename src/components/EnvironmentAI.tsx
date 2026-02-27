import { useState, useMemo } from "react";

const EnvironmentAI = () => {
  const [oxygen, setOxygen] = useState(65);
  const [toxicity, setToxicity] = useState(40);
  const [temperature, setTemperature] = useState(50);
  const [threat, setThreat] = useState(20);

  const analysis = useMemo(() => {
    const score = (100 - oxygen) * 0.3 + toxicity * 0.3 + Math.abs(temperature - 50) * 0.2 + threat * 0.2;
    const level = score > 60 ? "CRITICAL" : score > 35 ? "MEDIUM" : "LOW";

    const recommendations: string[] = [];
    if (oxygen < 40) recommendations.push("Critically low oxygen. Locate ventilation source immediately.");
    else if (oxygen < 60) recommendations.push("Oxygen declining. Conserve energy and reduce movement.");

    if (toxicity > 70) recommendations.push("Severe toxicity. Seal breathing apparatus. Evacuate zone.");
    else if (toxicity > 40) recommendations.push("High toxicity detected. Reduce movement and move toward safe zone.");

    if (temperature > 75) recommendations.push("Extreme heat. Risk of thermal damage. Seek shielded area.");
    else if (temperature < 25) recommendations.push("Hypothermia risk. Generate body heat. Avoid static positions.");

    if (threat > 70) recommendations.push("Entity proximity critical. Avoid confrontation. Find concealment.");
    else if (threat > 40) recommendations.push("Threat detected nearby. Proceed with caution. Minimize noise.");

    if (recommendations.length === 0) recommendations.push("Environment stable. Continue on current trajectory.");

    const escapeProb = Math.max(5, Math.min(98, Math.floor(100 - score)));

    return { score, level, recommendations, escapeProb };
  }, [oxygen, toxicity, temperature, threat]);

  const levelColor = analysis.level === "CRITICAL" ? "text-neon-red" : analysis.level === "MEDIUM" ? "text-neon-amber" : "text-neon-green";
  const levelBorder = analysis.level === "CRITICAL" ? "neon-border-red" : analysis.level === "MEDIUM" ? "neon-border" : "neon-border";

  const Slider = ({ label, value, onChange, unit, color }: {
    label: string; value: number; onChange: (v: number) => void; unit: string; color: string;
  }) => (
    <div className="mb-4">
      <div className="flex justify-between font-mono text-[10px] text-muted-foreground mb-1">
        <span>{label}</span>
        <span className={color}>{value}{unit}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_0_8px_hsl(190_100%_50%_/_0.5)]"
      />
    </div>
  );

  return (
    <div className="neon-border-red bg-card/50 p-6 rounded-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-2 h-2 rounded-full ${analysis.level === "CRITICAL" ? "bg-neon-red alert-pulse" : "bg-neon-amber"} animate-pulse`} />
        <h3 className="font-display text-sm tracking-[0.2em] text-neon-red">ENVIRONMENT SURVIVAL AI</h3>
      </div>
      <p className="font-mono text-xs text-muted-foreground mb-4">
        Analyze environmental conditions and receive survival directives.
      </p>

      {/* Sliders */}
      <Slider label="OXYGEN LEVEL" value={oxygen} onChange={setOxygen} unit="%" color="text-neon-cyan" />
      <Slider label="TOXICITY LEVEL" value={toxicity} onChange={setToxicity} unit="%" color="text-neon-red" />
      <Slider label="TEMPERATURE" value={temperature} onChange={setTemperature} unit="°C" color="text-neon-amber" />
      <Slider label="THREAT PROXIMITY" value={threat} onChange={setThreat} unit="m" color="text-neon-purple" />

      {/* Risk Meter */}
      <div className={`${levelBorder} bg-card/80 px-4 py-3 mb-4 rounded-sm`}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] text-muted-foreground">RISK ASSESSMENT</span>
          <span className={`font-display text-sm tracking-wider ${levelColor} ${analysis.level === "CRITICAL" ? "animate-pulse" : ""}`}>
            {analysis.level}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${analysis.score}%`,
              backgroundColor:
                analysis.level === "CRITICAL" ? "hsl(0 90% 55%)" :
                analysis.level === "MEDIUM" ? "hsl(40 100% 55%)" :
                "hsl(140 80% 50%)",
            }}
          />
        </div>
      </div>

      {/* Escape probability */}
      <div className="flex items-center justify-between neon-border bg-card/80 px-4 py-2 mb-4 rounded-sm">
        <span className="font-mono text-[10px] text-muted-foreground">ESCAPE PROBABILITY</span>
        <span className={`font-display text-lg tracking-wider ${
          analysis.escapeProb > 70 ? "text-neon-green" : analysis.escapeProb > 40 ? "text-neon-amber" : "text-neon-red"
        }`}>
          {analysis.escapeProb}%
        </span>
      </div>

      {/* Recommendations */}
      <div className="space-y-2">
        <span className="font-mono text-[10px] text-muted-foreground">SURVIVAL DIRECTIVES</span>
        {analysis.recommendations.map((r, i) => (
          <div key={i} className="flex gap-2 px-3 py-2 bg-muted/20 border border-border/30 rounded-sm">
            <span className="text-neon-amber font-mono text-xs">▸</span>
            <span className="font-mono text-xs text-foreground/80">{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnvironmentAI;
