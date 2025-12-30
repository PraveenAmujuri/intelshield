import React, { useCallback } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Cpu, Link as LinkIcon, ShieldCheck, Radar } from "lucide-react";
import { socket } from "../socket/socket";
import { useCart } from "../contexts/CartContext";  // ✅ CART INTEGRATION

// Icon mapping
const icons = {
  "Neural Chipset v2.0": <Cpu className="w-10 h-10 text-purple-400" />,
  "Bio-Link Neural Implant": <LinkIcon className="w-10 h-10 text-blue-400" />,
  "Quantum Firewall Node": <ShieldCheck className="w-10 h-10 text-emerald-400" />,
  "AI Threat Scanner": <Radar className="w-10 h-10 text-red-400" />,
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();  // ✅ CART HOOK
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((e) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }, [mouseX, mouseY]);

  const handleAddToCart = async (e) => {
    e.stopPropagation();  // Prevent card hover effects
    
    // 🧪 Send IntelShield behavior packet
    if (socket.connected) {
      socket.emit("behavior_packet", {
        action: "ADD_TO_CART",
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      });
    }

    // Add to cart
    addToCart(product);

    // 🎨 Visual feedback
    const button = e.currentTarget;
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="flex items-center gap-2">✓ Added!</span>';
    button.className = button.className.replace('bg-white', 'bg-emerald-500') 
      .replace('text-black', 'text-white') 
      + ' animate-pulse';

    setTimeout(() => {
      button.innerHTML = originalText;
      button.className = button.className.replace(/bg-emerald-500 animate-pulse/g, 'bg-white')
        .replace(/text-white/g, 'text-black');
    }, 1500);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col h-full rounded-2xl border border-white/5 bg-[#0a0a0a] p-1 transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-2 cursor-pointer"
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

      <div className="relative flex flex-col flex-1 bg-black/50 backdrop-blur-sm rounded-[15px] p-8 h-full">
        {/* Header: Icon */}
        <div className="h-16 mb-6 flex items-center justify-center">
          {icons[product.name] || <Cpu className="w-12 h-12 text-gray-400" />}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-purple-300 transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6">
              {product.desc || "Authorized IntelShield component"}
            </p>
          </div>

          {/* Footer: Price + Button */}
          <div className="border-t border-white/10 pt-6 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
                Price
              </span>
              <span className="text-2xl font-black text-white drop-shadow-lg">
                ₹{product.price.toLocaleString()}
              </span>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="w-full whitespace-nowrap px-6 py-3 rounded-xl bg-white text-black text-sm font-bold hover:bg-purple-500 hover:text-white transition-all active:scale-95 shadow-lg hover:shadow-purple-500/50 group/button flex items-center justify-center gap-2"
            >
              <span>Add to Cart</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1 3h10l-1-3m0 0v4a1 1 0 01-1 1H6a1 1 0 01-1-1v-4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
