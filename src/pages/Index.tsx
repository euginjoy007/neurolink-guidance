import StatusBar from "@/components/StatusBar";
import HeroSection from "@/components/HeroSection";
import NarrativeSection from "@/components/NarrativeSection";
import DashboardSection from "@/components/DashboardSection";
import GlitchText from "@/components/GlitchText";

const narrativePage1 = {
  title: "THE COLLAPSE",
  subtitle: "Chapter I — Into the Unknown",
  paragraphs: [
    { text: "The moment the gate closed, silence followed.", type: "quote" as const },
    { text: "The Upside Down was not just a place — it was a living system of decay. The air was heavier, filled with toxic particles that blurred vision and slowed movement. Time moved differently here. Sounds echoed long after they were made, and memories faded faster than reality itself." },
    { text: "Eleven stood alone." },
    { text: "ALERT: Biological readings weakening. Communication signals fractured.", type: "alert" as const },
    { text: "Back in the real world, Mission Control detected the collapse instantly. Traditional rescue methods failed; no stable connection could be maintained between worlds. They had only one option left." },
    { text: "NEUROLINK RESCUE SYSTEM — ACTIVATED", type: "system" as const },
    { text: "A new interface appeared across the command screens — a fusion of artificial intelligence and human survival intelligence designed for impossible environments. Instead of searching blindly for Eleven, the system would guide her step by step, rebuilding the path home from fragments of data." },
  ],
};

const narrativeMemory = {
  title: "MEMORY NAVIGATOR",
  subtitle: "Module 01 — Restoring Direction",
  paragraphs: [
    { text: "The Upside Down attacked cognition itself. Fear distorted perception, and memories dissolved into confusion. Eleven began forgetting safe paths she had already discovered." },
    { text: "Neurolink analyzed her past movements and reconstructed her decision history." },
    { text: '"You previously escaped danger through Corridor B."', type: "system" as const },
    { text: '"Safe zone identified near electromagnetic disturbance."', type: "system" as const },
    { text: "The system rebuilt her memory map — not by guessing, but by learning from her own past actions. Each reminder anchored her to reality, preventing panic from taking control." },
    { text: "For the first time since being trapped, Eleven remembered where to go." },
    { text: "But remembering was not enough. Mission Control still could not reach her clearly. The signal was breaking.", type: "alert" as const },
  ],
};

const narrativeSignal = {
  title: "SIGNAL RECOVERY",
  subtitle: "Module 02 — Rebuilding Connection",
  paragraphs: [
    { text: "Static filled the communication channels. Messages sent from the real world arrived as broken pulses, scattered across dimensions. Without communication, guidance would fail." },
    { text: "SIGNAL RECOVERY PLATFORM — INITIATED", type: "signal" as const },
    { text: "Instead of transmitting full data streams, the system compressed critical instructions into micro-signals capable of surviving dimensional interference. Damaged packets were reconstructed using predictive algorithms." },
    { text: "12%… 27%… SIGNAL PARTIALLY RESTORED", type: "system" as const },
    { text: '"Atmosphere unstable. Move slowly."', type: "system" as const },
    { text: '"Gate energy detected ahead."', type: "system" as const },
    { text: "Even weak signals became meaningful again. Now Neurolink turned to survival itself." },
  ],
};

const narrativeSurvival = {
  title: "THE PATH HOME",
  subtitle: "Module 03 — Predicting Escape",
  paragraphs: [
    { text: "ENVIRONMENT SURVIVAL AI — ONLINE", type: "system" as const },
    { text: "Sensors analyzed environmental conditions surrounding her:" },
    { text: "⚠ Toxicity rising | ⚠ Oxygen decreasing | ⚠ Entity movement detected", type: "alert" as const },
    { text: "The AI calculated thousands of survival scenarios every second, selecting the safest possible path." },
    { text: '"Energy conservation required. Avoid confrontation. Proceed toward electromagnetic anomaly — probability of escape: 78%."', type: "system" as const },
    { text: "The interface transformed into a living mission guide — alerts pulsed, pathways illuminated, and risk levels adjusted dynamically as Eleven moved." },
    { text: "Memory guided her decisions. Signals connected her to hope. Environmental intelligence protected every step." },
  ],
};

const narrativeEscape = {
  title: "ESCAPE",
  subtitle: "Final Sequence",
  paragraphs: [
    { text: "As she approached the anomaly, energy readings surged. The Gate began to reopen." },
    { text: "ESCAPE PROBABILITY: 92% — GATE ENERGY RISING", type: "system" as const },
    { text: "With one final surge of strength, Eleven crossed the boundary between worlds." },
    { text: "SIGNAL STABILIZED ✓ | BIOMETRICS RESTORED ✓ | UPSIDE DOWN — DISCONNECTED ✓", type: "signal" as const },
    { text: "Neurolink completed its mission — not by rescuing her directly, but by giving her the intelligence to find her own way home." },
    { text: "In a world where rescue is impossible, intelligent guidance becomes the bridge between fear and freedom. The system did not fight for her. It empowered her to fight for herself — with memory, connection, and the will to survive.", type: "quote" as const },
  ],
};

const Index = () => {
  return (
    <div className="relative bg-background min-h-screen noise-bg scanline">
      <StatusBar />

      <HeroSection />

      <NarrativeSection id="chapter1" {...narrativePage1} />
      <NarrativeSection id="memory" {...narrativeMemory} />
      <NarrativeSection id="signal" {...narrativeSignal} />
      <NarrativeSection id="survival" {...narrativeSurvival} />
      <NarrativeSection id="escape" {...narrativeEscape} />

      <DashboardSection />

      {/* Footer */}
      <footer className="relative z-10 py-16 px-6 text-center border-t border-border/30">
        <GlitchText text="NEUROLINK" as="h3" className="text-xl tracking-[0.3em] neon-text mb-2" />
        <p className="font-mono text-xs text-muted-foreground tracking-widest">
          RESCUE SYSTEM v2.1.0 — ALL MODULES OPERATIONAL
        </p>
        <p className="font-mono text-[10px] text-muted-foreground/50 mt-4">
          "Intelligence is the bridge between fear and freedom."
        </p>
      </footer>
    </div>
  );
};

export default Index;
