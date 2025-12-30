import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { ShieldCheck, LogOut, ShoppingCart, LayoutDashboard } from "lucide-react";

export default function NavBar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const username = localStorage.getItem("username");
  const isAdmin = !!localStorage.getItem("admin_token");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
      <div className="flex items-center justify-between w-full max-w-7xl px-8 py-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <Link to="/shop" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
          <ShieldCheck className="text-purple-500" />
          INTEL<span className="text-purple-500">SHIELD</span>
        </Link>
        
        <div className="flex items-center gap-6">
          {/* Admin Link - Only visible to logged-in Admins */}
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
              <LayoutDashboard size={16} />
              Admin Console
            </Link>
          )}

          <Link to="/cart" className="relative p-2 hover:bg-white/10 rounded-xl transition-all group">
            <ShoppingCart className="text-white" size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] w-5 h-5 rounded-full flex items-center justify-center text-white font-bold animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>

          <div className="hidden md:flex flex-col items-end border-l border-white/10 pl-6">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
              {isAdmin ? "System Administrator" : "Authorized Agent"}
            </span>
            <span className="text-sm text-white font-mono">{username}</span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
            title="Terminate Session"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}