import NavBar from "../components/NavBar";
import { useCart } from "../contexts/CartContext";
import { socket } from "../socket/socket";
import { Link } from "react-router-dom";

export default function Checkout() {
  const { cartItems, totalPrice, totalItems } = useCart();

  const handleHighRiskPurchase = () => {
    socket.emit("behavior_packet", {
      action: "FINAL_CHECKOUT_ATTEMPT",
      amount: totalPrice,
      items: cartItems.length,
      timestamp: Date.now(),
      metadata: { location: "checkout", device: navigator.userAgent }
    });
    alert(`🛡️ IntelShield: HIGH-RISK ₹${totalPrice.toLocaleString()} DETECTED!`);
  };

  return (
    <>
      <NavBar />
      <div className="pt-20 pb-16 px-4 min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl font-black text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl">
            Secure Checkout
          </h1>
          <div className="bg-black/50 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl space-y-8">
            <div className="grid grid-cols-2 gap-8 text-center">
              <div>
                <div className="text-2xl text-gray-300 mb-2">Total Items</div>
                <div className="text-4xl font-bold text-white">{totalItems}</div>
              </div>
              <div>
                <div className="text-2xl text-gray-300 mb-2">Total Amount</div>
                <div className="text-5xl font-black bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl">
                  ₹{totalPrice.toLocaleString()}
                </div>
              </div>
            </div>
            <button onClick={handleHighRiskPurchase} className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-orange-600 hover:to-red-600 text-white font-black py-6 px-8 rounded-2xl shadow-2xl hover:shadow-red-500/50 hover:scale-105 transition-all duration-300 text-xl">
              🚨 Confirm High-Risk Payment
            </button>
            <div className="p-6 bg-blue-500/20 border border-blue-500/30 rounded-2xl text-center">
              <p className="text-blue-300 font-bold mb-2">🛡️ IntelShield Active</p>
              <p className="text-blue-400 text-sm">Real-time ML threat detection</p>
            </div>
            <Link to="/cart" className="block w-full text-center bg-gray-700 hover:bg-gray-600 text-white py-4 px-8 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all">
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
