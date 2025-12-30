import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-black/50 backdrop-blur-xl shadow-2xl border-b border-blue-500/30 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:scale-105 transition-all">
            🛡️ IntelShield
          </Link>
          <div className="flex space-x-6">
            <Link 
              to="/shop" 
              className="px-4 py-2 rounded-xl font-semibold transition-all hover:bg-blue-600/50"
            >
              🛒 Shop
            </Link>
            {isLoggedIn ? (
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                🚪 Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                🔐 Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
