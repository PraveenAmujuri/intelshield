"use client"
import React, { useState, useEffect, useCallback } from "react";
import NavBar from "../components/NavBar";
import { socket } from "../socket/socket";
import api from "../api/axios";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ShieldAlert, Activity, Users, Lock } from "lucide-react";

export default function Admin() {
  const [alerts, setAlerts] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // ✅ Differentiates between the login UI and the Dashboard UI
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("admin_token"));
  const [stats, setStats] = useState({});

  // --- Magic Card Logic ---
  const gradientSize = 300;
  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);
  
  const handlePointerMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  // --- Dashboard Data Fetching ---
  useEffect(() => {
    if (!isAuthenticated) return;
    
    socket.on("security_alert", (data) => {
      setAlerts(prev => [data, ...prev.slice(0, 9)]);
    });

    const fetchStats = async () => {
      try {
        const { data } = await api.get("/auth/admin/stats");
        setStats(data);
      } catch (err) { 
        console.log("Stats fetch error - potentially unauthorized"); 
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => {
      socket.off("security_alert");
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  // --- Admin Login Action ---
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/admin-login", { 
        username: username.trim(), 
        password: password.trim() 
      });
      
      localStorage.setItem("admin_token", data.access_token);
      localStorage.setItem("username", "SYS_ADMIN");
      
      // ✅ Refresh to let App.jsx and NavBar.jsx recognize the new session
      window.location.href = "/admin"; 
    } catch (err) {
      alert("❌ Admin access denied: Incorrect credentials.");
    }
  };

  // --- VIEW 1: RED MAGIC LOGIN CARD ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-[#030303]">
        <div className="max-w-md w-full mx-auto" onPointerMove={handlePointerMove}>
          <div className="group relative rounded-3xl bg-[#171717] border border-red-500/20 p-10 overflow-hidden text-left">
            <motion.div 
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: useMotionTemplate`radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, rgba(220, 38, 38, 0.15), transparent 80%)` }}
            />
            <div className="relative z-10 text-center mb-10">
              <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-inner text-red-500">
                <Lock size={40} />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2 text-red-500 uppercase">Admin Terminal</h2>
              <p className="text-gray-500 text-sm">Restricted Access - IntelShield Core</p>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-5 relative z-10">
              <input type="text" placeholder="admin" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-4 bg-[#0a0a0a] border border-white/5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all" required />
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-[#0a0a0a] border border-white/5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all" required />
              <button type="submit" className="w-full h-14 bg-red-600 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-red-500 transition-all shadow-lg shadow-red-600/20">
                Unlock Console →
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: SYSTEM OVERWATCH DASHBOARD ---
  return (
    <div className="pt-32 px-6 min-h-screen bg-[#030303] text-white text-left">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase">System <span className="text-red-500">Overwatch</span></h1>
            <p className="text-gray-500 mt-2">Real-time behavioral threat intelligence enabled.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-2xl text-center min-w-[120px]">
              <div className="text-xs text-gray-500 uppercase font-bold mb-1 font-mono">Live Nodes</div>
              <div className="text-2xl font-black text-blue-400">{stats.active_sessions || 0}</div>
            </div>
            <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-2xl text-center min-w-[120px]">
              <div className="text-xs text-gray-500 uppercase font-bold mb-1 font-mono">Interdicted</div>
              <div className="text-2xl font-black text-red-500">{stats.blocked_users || 0}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Alerts Feed */}
          <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 overflow-hidden relative">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-400 uppercase tracking-tighter">
              <ShieldAlert size={20} /> Neural Breach Alerts
            </h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {alerts.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-gray-700 border-2 border-dashed border-white/5 rounded-2xl">
                  <Activity size={40} className="mb-4 opacity-10" />
                  Monitoring neural pathways...
                </div>
              ) : (
                alerts.map((alert, i) => (
                  <div key={i} className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 hover:bg-red-500/10 transition-all">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono text-gray-600 uppercase">Packet_ID: {alert.sid?.slice(0,12)}</span>
                      <span className="px-2 py-0.5 bg-red-600 text-[10px] rounded font-black uppercase">Anomaly Detected</span>
                    </div>
                    <h4 className="font-bold text-white mt-3 text-lg">{alert.reason}</h4>
                    <div className="mt-4 flex gap-6 text-[10px] font-mono text-gray-500 uppercase">
                      <div>Confidence: <span className="text-red-400">{(alert.score * -100).toFixed(2)}%</span></div>
                      <div>Vector: <span className="text-blue-400">External Node</span></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 text-left">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-400 uppercase tracking-tighter">
                <Users size={20} /> Identity Metrics
              </h3>
              <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-white/5">
                      <span className="text-gray-500 text-xs uppercase font-bold">Total Assets</span>
                      <span className="font-bold text-lg font-mono">{stats.total_users || 0}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/5">
                      <span className="text-gray-500 text-xs uppercase font-bold">Verified Entities</span>
                      <span className="font-bold text-lg text-green-500 font-mono">{stats.active_users || 0}</span>
                  </div>
              </div>
            </div>
            <button 
              onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
              className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-500 font-bold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all uppercase tracking-widest text-[10px]"
            >
              Terminate Admin Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}