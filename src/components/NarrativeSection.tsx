import { useEffect, useRef, useState } from "react";
import GlitchText from "./GlitchText";
import TypewriterText from "./TypewriterText";

interface NarrativeParagraph {
  text: string;
  type?: "normal" | "system" | "quote" | "alert" | "signal";
}

interface NarrativeSectionProps {
  title: string;
  subtitle?: string;
  paragraphs: NarrativeParagraph[];
  id: string;
}

const NarrativeSection = ({ title, subtitle, paragraphs, id }: NarrativeSectionProps) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getStyle = (type: string) => {
    switch (type) {
      case "system":
        return "neon-border bg-card/50 px-4 py-3 font-mono text-sm text-primary";
      case "quote":
        return "border-l-2 border-primary pl-4 italic text-foreground/80";
      case "alert":
        return "neon-border-red bg-neon-red/5 px-4 py-3 font-mono text-sm text-neon-red alert-pulse";
      case "signal":
        return "neon-border-purple bg-neon-purple/5 px-4 py-3 font-mono text-sm text-neon-purple";
      default:
        return "text-foreground/70 leading-relaxed text-lg";
    }
  };

  return (
    <section id={id} ref={ref} className="relative min-h-screen flex items-center py-24 px-6">
      <div className="max-w-4xl mx-auto w-full">
        <div
          className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {subtitle && (
            <span className="font-mono text-xs tracking-[0.3em] text-neon-purple uppercase mb-4 block">
              {subtitle}
            </span>
          )}
          <GlitchText text={title} className="text-3xl md:text-5xl mb-8 neon-text tracking-wider" />
        </div>

        <div className="space-y-6">
          {paragraphs.map((p, i) => (
            <div
              key={i}
              className={`transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${300 + i * 150}ms` }}
            >
              {p.type === "system" || p.type === "alert" || p.type === "signal" ? (
                <div className={getStyle(p.type || "normal")}>
                  {p.type === "system" && <span className="text-muted-foreground mr-2">&gt;</span>}
                  {p.text}
                </div>
              ) : p.type === "quote" ? (
                <blockquote className={getStyle("quote")}>{p.text}</blockquote>
              ) : (
                <p className={getStyle("normal")}>{p.text}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NarrativeSection;
