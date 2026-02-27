import { useEffect, useState } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
}

const GlitchText = ({ text, className = "", as: Tag = "h2" }: GlitchTextProps) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tag className={`relative font-display ${className}`}>
      <span className={isGlitching ? "glitch-text" : ""}>{text}</span>
      {isGlitching && (
        <>
          <span
            className="absolute inset-0 text-neon-cyan opacity-70"
            style={{ clipPath: "inset(20% 0 50% 0)", transform: "translate(-2px, 0)" }}
          >
            {text}
          </span>
          <span
            className="absolute inset-0 text-neon-red opacity-70"
            style={{ clipPath: "inset(50% 0 20% 0)", transform: "translate(2px, 0)" }}
          >
            {text}
          </span>
        </>
      )}
    </Tag>
  );
};

export default GlitchText;
