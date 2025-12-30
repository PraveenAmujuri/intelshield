import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { socket } from "../socket/socket";
import api from "../api/axios";

export default function Admin() {
  const [alerts, setAlerts] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    socket.on("security_alert", (data) => {
      setAlerts(prev => [data, ...prev.slice(0, 9)]);  // Keep latest 10
    });

    return () => socket.off("security_alert");
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
      alert("Admin access denied");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-8">
        <div className="max-w-md w-full bg-black/50 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
            Admin Console
          </h2>
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <input
              type="text"
              placeholder="Admin ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 bg-black/30 border border-white/20 rounded-2xl text-white focus:border-red-400"
              required
            />
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-black/30 border border-white/20 rounded-2xl text-white focus:border-red-400"
              required
            />
            <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-black py-4 rounded-2xl shadow-2xl hover:shadow-red-500/50">
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="pt-20 pb-16 px-4 min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-red-400 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
            🛡️ IntelShield Admin Console
          </h1>

          {/* LIVE ALERTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-black/50 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-3">
                🚨 High-Risk Alerts ({alerts.length})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {alerts.map((alert, i) => (
                  <div key={i} className="group bg-red-500/20 border border-red-500/50 rounded-2xl p-6 hover:bg-red-500/30 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-sm text-red-300">SID: {alert.sid || 'unknown'}</span>
                      <span className="text-xs bg-red-600/50 px-3 py-1 rounded-full font-bold">
                        {alert.risk_level || 'HIGH'}
                      </span>
                    </div>
                    <h4 className="font-bold text-white mb-2">{alert.reason}</h4>
                    <div className="text-sm space-y-1 text-red-200">
                      <div>Score: {alert.score}</div>
                      <div>Mouse Risk: {alert.mouse_risk}</div>
                      <div>Phishing Risk: {alert.phishing_risk}</div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-red-500/30">
                      <button className="flex-1 bg-orange-600/80 hover:bg-orange-600 text-white py-2 px-4 rounded-xl font-bold text-sm transition-all">
                        ⚠️ Mark Fraud
                      </button>
                      <button className="flex-1 bg-gray-600/80 hover:bg-gray-500 text-white py-2 px-4 rounded-xl font-bold text-sm transition-all">
                        ✅ Whitelist
                      </button>
                      <button className="flex-1 bg-red-600/80 hover:bg-red-600 text-white py-2 px-4 rounded-xl font-bold text-sm transition-all">
                        🚫 Block User
                      </button>
                    </div>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No high-risk alerts. System monitoring...
                  </div>
                )}
              </div>
            </div>

            <div className="bg-black/50 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 shadow-2xl space-y-6">
              <h3 className="text-2xl font-bold text-blue-400 flex items-center gap-3">
                📊 System Status
              </h3>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="bg-blue-500/20 p-6 rounded-2xl border border-blue-500/50">
                  <div className="text-3xl font-black text-blue-400">0</div>
                  <div className="text-sm text-blue-300 mt-1">Active Sessions</div>
                </div>
                <div className="bg-green-500/20 p-6 rounded-2xl border border-green-500/50">
                  <div className="text-3xl font-black text-green-400">{alerts.filter(a => a.action === 'BLOCKED').length}</div>
                  <div className="text-sm text-green-300 mt-1">Blocked Today</div>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-2xl font-bold shadow-xl hover:shadow-blue-500/50 transition-all">
                Refresh Stats
              </button>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={() => {localStorage.removeItem("admin_token"); setIsAuthenticated(false);}}
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Logout Admin
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
