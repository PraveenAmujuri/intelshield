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
      className="group relative rounded-2xl border border-white/10 bg-[#0a0a0a] p-1 transition-all"
    >
      {/* Magic Spotlight Border */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              rgba(168, 85, 247, 0.3),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative bg-[#0d0d0d] rounded-[15px] p-8 h-full flex flex-col">
        <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500 origin-left">
          {product.icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-6 flex-grow">{product.desc}</p>
        
        <div className="flex items-center justify-between mt-4 pt-6 border-t border-white/5">
          <span className="text-2xl font-bold text-white">₹{product.price}</span>
          <button className="px-4 py-2 rounded-lg bg-white text-black text-sm font-bold hover:bg-purple-500 hover:text-white transition-all active:scale-95">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}