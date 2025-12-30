import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";  // ✅ ADD THIS

export default function NavBar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "GUEST/USER";
  const { totalItems } = useCart();  // ✅ ADD THIS

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
      <div className="flex items-center justify-between w-full max-w-7xl px-8 py-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <Link to="/shop" className="text-2xl font-black tracking-tighter text-white">
          INTEL<span className="text-purple-500">SHIELD</span>
        </Link>
        
        <div className="flex items-center gap-6">
          {/* 🛒 CART BADGE */}
          <Link to="/cart" className="relative p-2 hover:bg-white/10 rounded-xl transition-all group">
            <span className="text-2xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-xs w-5 h-5 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>
{localStorage.getItem("admin_token") ? (
  <Link to="/admin" className="p-2 relative hover:bg-red-600/50 rounded-xl transition-all">
    <span className="text-xl">🔴</span>
  </Link>
) : (
  <Link to="/admin" className="p-2 hover:bg-white/10 rounded-xl transition-all">
    <span className="text-lg">👮</span>
  </Link>
)}

          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Authorized Agent</span>
            <span className="text-sm text-white font-mono">{username}</span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-400 border border-red-400/20 rounded-lg hover:bg-red-400 hover:text-white transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
