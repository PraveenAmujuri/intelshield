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
      // Sends data to your MongoDB-backed FastAPI route
      await api.post("/auth/login", {
  username: email.trim(),
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
          onChange={e => setUsername(e.target.value)} 
          style={{ display: "block", margin: "10px 0", width: "100%" }}
          required 
        />
        <input 
          type="password" 
          placeholder="Create Password" 
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