import React, { useCallback } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export default function ProductCard({ product }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((e) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }, [mouseX, mouseY]);

  return (
    <div
      onMouseMove={handleMouseMove}
      className="group relative rounded-2xl border border-white/10 bg-[#121212] p-8 transition-all hover:bg-[#1a1a1a]"
    >
      {/* Magic Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              250px circle at ${mouseX}px ${mouseY}px,
              rgba(158, 122, 255, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10">
        <div className="text-4xl mb-4">{product.icon}</div>
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        <p className="text-purple-400 font-mono text-lg mb-6">${product.price}</p>
        
        <button className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-purple-500 hover:text-white transition-all duration-300">
          Acquire Asset
        </button>
      </div>
    </div>
  );
}