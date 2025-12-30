import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useEffect, useState } from "react";

export default function NavBar() {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("admin_token");
    const username = localStorage.getItem("username");
    
    setIsLoggedIn(!!token && !!username);
    setIsAdmin(!!adminToken);
  }, []);

  const cartItemCount = cartItems.length;
  const currentPath = window.location.pathname;

  // ✅ HIDE NAVBAR ON LOGIN/REGISTER PAGES
  if (currentPath === "/" || currentPath === "/login" || currentPath === "/register") {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link to="/shop" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all">
            <span className="text-2xl font-bold">🛡️</span>
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
              IntelShield
            </h1>
            <p className="text-xs text-gray-400">Secure Shopping</p>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/shop" 
            className="px-6 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl transition-all font-semibold text-lg"
          >
            🛒 Shop
          </Link>
          <Link 
            to="/cart" 
            className="relative px-6 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl transition-all font-semibold text-lg"
          >
            Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white text-sm rounded-full flex items-center justify-center font-bold animate-pulse shadow-lg">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>

        {/* AUTH + ADMIN BUTTONS */}
        <div className="flex items-center gap-4">
          {/* ADMIN BUTTON */}
          {isAdmin && (
            <Link 
              to="/admin" 
              className="p-3 bg-red-600/30 hover:bg-red-600/50 border-2 border-red-500/50 rounded-2xl transition-all group shadow-xl hover:shadow-red-500/50 hover:scale-105"
            >
              <span className="text-xl">🔴</span>
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse shadow-md">
                !
              </span>
            </Link>
          )}
          
          {!isLoggedIn ? (
            <Link 
              to="/login" 
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-orange-600 hover:to-red-600 text-white font-black rounded-2xl border-2 border-white/20 transition-all shadow-2xl hover:shadow-red-500/50 hover:scale-[1.02]"
            >
              🔐 Login
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              {/* MOBILE CART */}
              <Link 
                to="/cart" 
                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all relative shadow-lg hover:shadow-xl"
              >
                🛒
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse shadow-md">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              
              {/* LOGOUT */}
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("username");
                  localStorage.removeItem("admin_token");
                  window.location.href = "/login";
                }}
                className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-black rounded-2xl border border-gray-600/50 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02]"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
