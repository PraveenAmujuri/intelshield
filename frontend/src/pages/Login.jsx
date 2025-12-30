import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom"; // Added Link

export default function Login() {
  const [email, setEmail] = useState(""); // Using email as the input value
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // FIX: Change 'email' to 'username' to match Backend Pydantic model
      const { data } = await api.post("/auth/register", {
  username: username.trim(),
  password: password.normalize("NFKC").trim()
});

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", email); // Store username for AI tracking
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
          type="text" // Changed from email to text for flexibility
          placeholder="Username / Email" 
          value={email}
          onChange={e => setEmail(e.target.value)} 
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