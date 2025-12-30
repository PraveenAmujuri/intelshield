import React, { useCallback } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Cpu, Link, ShieldCheck, Radar } from "lucide-react"; // Pro Icons

// Icon mapping to replace emojis with clean CSS-based icons
const icons = {
  "Neural Chipset v2.0": <Cpu className="w-10 h-10 text-purple-400" />,
  "Bio-Link Neural Implant": <Link className="w-10 h-10 text-blue-400" />,
  "Quantum Firewall Node": <ShieldCheck className="w-10 h-10 text-emerald-400" />,
  "AI Threat Scanner": <Radar className="w-10 h-10 text-red-400" />,
};

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
      className="group relative flex flex-col h-full rounded-2xl border border-white/5 bg-[#0a0a0a] transition-all duration-300 hover:border-white/20"
    >
      {/* Magic Spotlight Border */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              rgba(139, 92, 246, 0.25),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative flex flex-col flex-1 p-8">
        {/* Header Section: Fixed Height for Icons */}
        <div className="h-12 mb-6 flex items-center">
          {icons[product.name] || <Cpu className="w-10 h-10 text-gray-400" />}
        </div>

        {/* Content Section: Flex-1 pushes the footer down */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2 leading-tight">
            {product.name}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
            {product.desc}
          </p>
        </div>
        
        {/* Action Section: Fixed Height/Alignment */}
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Price</span>
            <span className="text-xl font-bold text-white">₹{product.price}</span>
          </div>
          <button className="whitespace-nowrap px-6 py-2.5 rounded-lg bg-white text-black text-sm font-bold hover:bg-purple-500 hover:text-white transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}