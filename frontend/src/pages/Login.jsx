import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState(""); // Renamed from email for clarity
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // ✅ FIX 1: Use /auth/login (was /auth/register)
      // ✅ FIX 2: Use 'username' key (was 'username: username' with missing var)
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
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <form onSubmit={handleLogin}>
        <h2>Login to Sandbox</h2>
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={e => setUsername(e.target.value)} 
          style={{ display: "block", margin: "10px 0", width: "100%" }}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={e => setPassword(e.target.value)} 
          style={{ display: "block", margin: "10px 0", width: "100%" }}
          required 
        />
        <button type="submit" style={{ width: "100%", padding: "10px" }}>Enter</button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        New user? <Link to="/register">Create an Account</Link>
      </p>
    </div>
  );
}