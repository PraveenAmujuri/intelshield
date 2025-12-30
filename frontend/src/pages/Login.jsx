import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
      console.error(err.response?.data);
      alert("Login Failed: Check credentials or block status");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
      <div className="max-w-md w-full mx-auto">
        {/* MAGIC SPOTLIGHT CARD */}
        <div className="group relative bg-black/60 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl overflow-hidden
          hover:before:absolute hover:before:inset-0 
          hover:before:bg-gradient-to-r hover:before:from-blue-500/30 hover:before:to-purple-500/30 
          hover:before:animate-pulse hover:before:rounded-3xl 
          transition-all duration-500">
          
          {/* Glow border */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
            rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
          
          <div className="relative z-10 text-center mb-10">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl mb-6 
              group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <span className="text-3xl drop-shadow-lg">🔐</span>
            </div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
              bg-clip-text text-transparent drop-shadow-2xl mb-2">
              Login to Sandbox
            </h2>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 bg-black/50 backdrop-blur-sm border border-white/30 rounded-2xl 
                  text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-4 
                  focus:ring-blue-500/20 transition-all duration-300 text-lg shadow-lg hover:shadow-blue-500/25"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-black/50 backdrop-blur-sm border border-white/30 rounded-2xl 
                  text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-4 
                  focus:ring-purple-500/20 transition-all duration-300 text-lg shadow-lg hover:shadow-purple-500/25"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-purple-600 
                hover:to-blue-600 text-white font-black py-5 px-8 rounded-2xl shadow-2xl hover:shadow-purple-500/50 
                hover:scale-[1.02] transform transition-all duration-300 text-xl border border-transparent 
                hover:border-white/50 group relative overflow-hidden"
            >
              <span>Enter Sandbox →</span>
              <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-2xl transition-transform origin-left duration-300" />
            </button>
          </form>
          
          <p className="text-center mt-10 text-gray-400 text-lg">
            New user?{" "}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold underline 
              decoration-2 hover:decoration-purple-400 hover:underline-offset-4 transition-all">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
