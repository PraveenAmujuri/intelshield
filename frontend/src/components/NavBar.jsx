import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "1rem", background: "#333", color: "#fff", display: "flex", justifyContent: "space-between" }}>
      <Link to="/shop" style={{ color: "#fff", textDecoration: "none" }}>🛡️ IntelShield</Link>
      <div>
        {isLoggedIn ? <button onClick={logout}>Logout</button> : <Link to="/login" style={{ color: "#fff" }}>Login</Link>}
      </div>
    </nav>
  );
}