
import React from "react";

/** Glassy, minimal card with soft border and shadow—decoupled for reuse. */
export default function AuthGlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-lg mx-auto px-2 section-padding relative z-10">
      <div className="
        bg-white/75 bg-gradient-to-br from-white/80 via-glassBg/95 to-[#efefff88]
        border border-glassBorder/80 shadow-2xl backdrop-blur-2xl rounded-3xl
        px-6 sm:px-10 py-9 sm:py-11
        flex flex-col items-center
        animate-fade-in
      ">
        {children}
      </div>
    </div>
  );
}
