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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      <div className="max-w-md w-full bg-black/50 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl mb-4">
            Login to Sandbox
          </h2>
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl">
            <span className="text-3xl">🔐</span>
          </div>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 bg-black/30 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 transition-all text-lg"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-black/30 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 transition-all text-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 text-xl border border-blue-500/50 hover:border-white/50"
          >
            Enter Sandbox →
          </button>
        </form>
        <p className="text-center mt-8 text-gray-400">
          New user?{" "}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
