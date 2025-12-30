"use client"

import React, { useState, useCallback, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // --- Magic Card Logic ---
  const gradientSize = 300;
  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);

  const handlePointerMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  const reset = useCallback(() => {
    mouseX.set(-gradientSize);
    mouseY.set(-gradientSize);
  }, [gradientSize, mouseX, mouseY]);

  // --- Auth Logic ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", {
        username: username.trim(),
        password: password.normalize("NFKC").trim()
      });
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", username);
      navigate("/shop");
    } catch (err) {
      alert("Login Failed: Check credentials or block status");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[#030303]">
      <div className="max-w-md w-full mx-auto">
        
        {/* MAGIC SPOTLIGHT CARD START */}
        <div
          className="group relative rounded-3xl bg-[#171717] border border-white/10 p-10 overflow-hidden"
          onPointerMove={handlePointerMove}
          onPointerLeave={reset}
        >
          {/* Spotlight Gradient Layer */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-500 opacity-0 group-hover:opacity-100"
            style={{
              background: useMotionTemplate`
                radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, 
                rgba(158, 122, 255, 0.15), 
                transparent 80%)
              `,
            }}
          />

          {/* Border Spotlight Layer */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: useMotionTemplate`
                radial-gradient(${gradientSize / 2}px circle at ${mouseX}px ${mouseY}px, 
                #9E7AFF, 
                #FE8BBB, 
                transparent 100%)
              `,
              padding: '1px',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
            }}
          />

          <div className="relative z-10 text-center mb-10">
            <div className="w-20 h-20 bg-[#1f1f1f] border border-white/10 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-inner">
              <span className="text-3xl">🔐</span>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
              IntelShield Login
            </h2>
            <p className="text-gray-500">Secure Behavioral Sandbox</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 bg-[#0a0a0a] border border-white/5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-[#0a0a0a] border border-white/5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              required
            />
            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors duration-200"
            >
              Access System →
            </button>
          </form>

          <p className="text-center mt-8 text-gray-500 relative z-10">
            Need access?{" "}
            <Link to="/register" className="text-white hover:underline">
              Request credentials
            </Link>
          </p>
        </div>
        {/* MAGIC SPOTLIGHT CARD END */}
        
      </div>
    </div>
  );
}