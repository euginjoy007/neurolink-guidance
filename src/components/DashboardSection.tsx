import { useEffect, useRef, useState } from "react";
import GlitchText from "./GlitchText";
import MemoryNavigator from "./MemoryNavigator";
import SignalRecovery from "./SignalRecovery";
import EnvironmentAI from "./EnvironmentAI";

const DashboardSection = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="dashboard" ref={ref} className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="font-mono text-xs tracking-[0.3em] text-neon-cyan uppercase mb-3 block">
            Interactive System
          </span>
          <GlitchText text="MISSION CONTROL" as="h2" className="text-3xl md:text-5xl neon-text tracking-wider mb-4" />
          <p className="font-mono text-sm text-muted-foreground max-w-xl mx-auto">
            Access the Neurolink modules. Each system operates independently to maximize survival probability.
          </p>
        </div>

        <div className={`grid gap-6 lg:grid-cols-2 transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="lg:col-span-2">
            <MemoryNavigator />
          </div>
          <SignalRecovery />
          <EnvironmentAI />
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
