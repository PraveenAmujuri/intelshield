import NavBar from "../components/NavBar";
import { useCart } from "../contexts/CartContext";
import { socket } from "../socket/socket";
import { Link } from "react-router-dom";

export default function CartPage() {  // ✅ PROPER EXPORT
  const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  const testPhishingAttack = () => {
    socket.emit("phishing_signal", {
      url: "http://fake-bank.com/login?redirect=evil.com/steal",
      hostname: "fake-bank.com",
      path_length: 50,
      has_at: true,
      is_https: false
    });
  };

  if (cartItems.length === 0) {
    return (
      <>
        <NavBar />
        <div className="pt-20 min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <span className="text-4xl">🛒</span>
            </div>
            <h1 className="text-4xl font-black text-white mb-4">Cart Empty</h1>
            <p className="text-gray-400 mb-8 text-lg">Add authorized components to continue</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={testPhishingAttack}
                className="px-8 py-4 bg-red-600/80 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-red-500/50 transition-all text-lg"
              >
                🧪 Test Phishing
              </button>
              <Link to="/shop" className="px-8 py-4 bg-blue-600/80 hover:bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-blue-500/50 transition-all text-lg">
                🛒 Shop Now
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="pt-20 pb-16 px-4 min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-center mb-16 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent drop-shadow-2xl">
            🛒 Shopping Cart ({totalItems})
          </h1>
          
          <div className="space-y-6 mb-12">
            {cartItems.map(item => (
              <div key={item.id} className="bg-black/40 backdrop-blur-md border border-white/20 rounded-3xl p-8 flex items-center gap-6 group hover:bg-white/10 hover:border-blue-400/50 hover:shadow-blue-500/25 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <span className="text-xl font-bold drop-shadow-lg">🛠️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-white truncate">{item.name}</h3>
                  <p className="text-gray-400 text-lg">${(item.price * item.quantity).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4 bg-black/50 rounded-2xl p-4">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center text-xl font-bold transition-all hover:scale-110"
                  >
                    −
                  </button>
                  <span className="text-2xl font-black text-white w-12 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center text-xl font-bold transition-all hover:scale-110"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="px-6 py-2 ml-4 bg-red-600/80 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-red-500/50 transition-all text-sm whitespace-nowrap"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl">
            <div className="flex justify-between items-center text-2xl mb-8">
              <span className="text-gray-300 font-semibold">Subtotal:</span>
              <span className="font-black text-4xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl">
                ${totalPrice.toLocaleString()}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Link to="/shop" className="block w-full bg-gray-700/80 hover:bg-gray-600 text-white py-4 px-8 rounded-2xl font-bold text-center shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-lg">
                ← Continue Shopping
              </Link>
              <Link to="/checkout" className="block w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-orange-600 hover:to-red-600 text-white py-4 px-8 rounded-2xl font-black shadow-2xl hover:shadow-red-500/50 hover:scale-[1.02] transition-all text-xl border border-red-500/50 hover:border-white/50">
                🚨 Secure Checkout →
              </Link>
            </div>

            {/* 🧪 THREAT TESTING */}
            <div className="pt-8 border-t border-white/10">
              <h3 className="text-xl font-bold text-gray-300 mb-6 flex items-center gap-2">
                🧪 IntelShield Threat Testing
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                  onClick={testPhishingAttack}
                  className="bg-red-600/70 hover:bg-red-600 text-white py-3 px-6 rounded-xl font-mono font-bold shadow-lg hover:shadow-red-500/50 hover:scale-105 transition-all text-sm border border-red-500/50"
                >
                  🦠 Phishing Attack
                </button>
                <button 
                  onClick={() => socket.emit("behavior_packet", { action: "TEST_FRAUD", amount: 999999 })}
                  className="bg-orange-600/70 hover:bg-orange-600 text-white py-3 px-6 rounded-xl font-mono font-bold shadow-lg hover:shadow-orange-500/50 hover:scale-105 transition-all text-sm border border-orange-500/50"
                >
                  💳 Fraud Transaction
                </button>
                <button 
                  onClick={() => {
                    for(let i=0; i<10; i++) {
                      socket.emit("mouse_move", { x: 0.5, y: 0.5 });
                    }
                  }}
                  className="bg-purple-600/70 hover:bg-purple-600 text-white py-3 px-6 rounded-xl font-mono font-bold shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all text-sm border border-purple-500/50"
                >
                  🤖 Bot Simulation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
