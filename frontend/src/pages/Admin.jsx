import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { socket } from "../socket/socket";
import api from "../api/axios";

export default function Admin() {
  const [alerts, setAlerts] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (!isAuthenticated) return;
    
    socket.on("security_alert", (data) => {
      setAlerts(prev => [data, ...prev.slice(0, 9)]);
    });

    // Fetch stats
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/auth/admin/stats");
        setStats(data);
      } catch (err) {
        console.log("Stats fetch error");
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);

    return () => {
      socket.off("security_alert");
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/admin-login", {
        username,
        password
      });
      localStorage.setItem("admin_token", data.access_token);
      setIsAuthenticated(true);
    } catch (err) {
      alert("❌ Admin access denied");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-8">
        <div className="max-w-md w-full bg-black/50 backdrop-blur-xl border border-red-500/30 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
            🔴 IntelShield Admin
          </h2>
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <input
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 bg-black/30 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:border-red-400 focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="intelshield2025"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-black/30 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:border-red-400 focus:outline-none"
              required
            />
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-orange-600 hover:to-red-600 text-white font-black py-4 rounded-2xl shadow-2xl hover:shadow-red-500/50 hover:scale-[1.02] transition-all"
            >
              🔐 Access Admin Panel
            </button>
          </form>
          <div className="text-center mt-6 text-xs text-gray-400">
            Username: admin | Password: intelshield2025
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="pt-20 px-4 min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-red-400 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
            🛡️ IntelShield Admin Console
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* ALERTS */}
            <div className="bg-black/60 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-3">
                🚨 High-Risk Alerts ({alerts.length})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 italic">
                    No high-risk alerts. System monitoring...
                  </div>
                ) : (
                  alerts.map((alert, i) => (
                    <div key={i} className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6 hover:bg-red-500/30 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-mono text-red-300">SID: {alert.sid?.slice(0,8)}...</span>
                        <span className="px-3 py-1 bg-red-600/70 text-xs rounded-full font-bold text-white">
                          {alert.risk_level || 'HIGH'}
                        </span>
                      </div>
                      <h4 className="font-bold text-lg text-white mb-2">{alert.reason}</h4>
                      <div className="text-sm text-red-200 space-y-1">
                        <div>Score: {alert.score?.toFixed(4)}</div>
                        <div>Mouse: {alert.mouse_risk} | Phishing: {alert.phishing_risk}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* STATS */}
            <div className="bg-black/60 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 shadow-2xl space-y-6">
              <h3 className="text-2xl font-bold text-blue-400 flex items-center gap-3">
                📊 System Status
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-500/20 p-6 rounded-2xl border border-blue-500/50 text-center">
                  <div className="text-3xl font-black text-blue-400">{stats.active_sessions || 0}</div>
                  <div className="text-sm text-blue-300 mt-1">Active Sessions</div>
                </div>
                <div className="bg-orange-500/20 p-6 rounded-2xl border border-orange-500/50 text-center">
                  <div className="text-3xl font-black text-orange-400">{stats.blocked_users || 0}</div>
                  <div className="text-sm text-orange-300 mt-1">Blocked Users</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={() => {
                localStorage.removeItem("admin_token");
                setIsAuthenticated(false);
                setAlerts([]);
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-12 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all text-lg"
            >
              🚪 Logout Admin
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
