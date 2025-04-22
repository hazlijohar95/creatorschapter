
import React, { useEffect } from "react";
import { Check } from "lucide-react";

type Props = {
  onDone?: () => void;
};

/**
 * Simple celebratory checkmark + confetti.
 */
export default function ConfettiCheck({ onDone }: Props) {
  useEffect(() => {
    // End celebration after 1.5 seconds
    const timeout = setTimeout(() => {
      if (onDone) onDone();
    }, 1500);
    // Add basic confetti
    const confettiRoot = document.createElement("div");
    confettiRoot.style.position = "fixed";
    confettiRoot.style.inset = "0";
    confettiRoot.style.pointerEvents = "none";
    confettiRoot.style.zIndex = "1000";
    confettiRoot.className = "confetti-root";
    document.body.appendChild(confettiRoot);

    // Generate 30 confetti
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement("div");
      confetti.className =
        "w-2 h-2 rounded-full absolute";
      confetti.style.background = [
        "#E879F9", "#6366F1", "#F472B6", "#FBBF24", "#34D399"
      ][i % 5];
      confetti.style.top = "50%";
      confetti.style.left = `${25 + Math.random() * 50}%`;
      confetti.style.opacity = "0.85";
      confetti.style.transform = `translateY(0)`;
      confetti.style.transition = `transform 900ms cubic-bezier(0.23, 1, 0.32, 1) ${i *
        15}ms, opacity 1.2s`;
      confettiRoot.appendChild(confetti);
      setTimeout(() => {
        confetti.style.transform = `translateY(${100 + Math.random() * 250}px)`;
        confetti.style.opacity = "0";
      }, 30);
    }

    return () => {
      document.body.removeChild(confettiRoot);
      clearTimeout(timeout);
    };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="flex flex-col items-center justify-center bg-white/90 p-10 rounded-xl shadow-xl">
        <div className="rounded-full bg-green-100 p-6 animate-scale-in">
          <Check className="text-green-600" size={60} strokeWidth={2.5} />
        </div>
        <div className="mt-6 text-2xl font-bold text-green-700">Account Created!</div>
        <div className="text-base text-gray-500">Redirecting...</div>
      </div>
    </div>
  );
}
