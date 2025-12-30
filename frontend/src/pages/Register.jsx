import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // ✅ FIX 1: Use /auth/register (was /auth/login)
      // ✅ FIX 2: Send 'username' (was sending 'email' which was undefined)
      await api.post("/auth/register", {
        username: username.trim(),
        password: password.normalize("NFKC").trim()
      });

      alert("Account created in Cloud! Now Login.");
      navigate("/login");
    } catch (err) {
      alert("Registration Failed: Username might be taken.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <form onSubmit={handleRegister}>
        <h2>Sign Up | IntelShield</h2>
        <input 
          type="text" 
          placeholder="Create Username" 
          value={username}
          onChange={e => setUsername(e.target.value)} 
          style={{ display: "block", margin: "10px 0", width: "100%" }}
          required 
        />
        <input 
          type="password" 
          placeholder="Create Password" 
          value={password}
          onChange={e => setPassword(e.target.value)} 
          style={{ display: "block", margin: "10px 0", width: "100%" }}
          required 
        />
        <button type="submit" style={{ width: "100%", padding: "10px", background: "#4CAF50", color: "white" }}>
          Register to Cloud
        </button>
      </form>
    </div>
  );
}