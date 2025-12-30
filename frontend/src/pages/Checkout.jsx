import { ShieldCheck, AlertTriangle, CreditCard, ChevronLeft } from "lucide-react";
import NavBar from "../components/NavBar";
import { useCart } from "../contexts/CartContext";
import { socket } from "../socket/socket";
import { Link } from "react-router-dom";

export default function Checkout() {
  const { totalPrice, totalItems } = useCart();

  const handleHighRiskPurchase = () => {
    socket.emit("behavior_packet", {
      action: "FINAL_CHECKOUT_ATTEMPT",
      amount: totalPrice,
      timestamp: Date.now(),
    });
    alert(`🚨 IntelShield: Transaction ₹${totalPrice.toLocaleString()} under review.`);
  };

  return (
    <>
      <NavBar />
      <div className="pt-32 pb-16 px-6 min-h-screen bg-[#030303] text-white">
        <div className="max-w-xl mx-auto">
          <Link to="/cart" className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors text-sm font-bold">
            <ChevronLeft size={16} /> BACK TO CART
          </Link>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-12 shadow-2xl relative overflow-hidden">
            {/* Security Pulse Decor */}
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck size={120} />
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-2 tracking-tighter">Finalize <span className="text-purple-500">Node</span></h2>
              <p className="text-gray-500 mb-10">All transactions are monitored by behavioral AI.</p>

              <div className="space-y-6 mb-10 bg-white/5 p-8 rounded-3xl border border-white/5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Batch Quantity</span>
                  <span className="font-bold">{totalItems} Units</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-gray-400">Total Credits</span>
                  <span className="text-4xl font-black text-white">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleHighRiskPurchase} 
                className="w-full bg-red-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-500 transition-all active:scale-95 shadow-lg shadow-red-900/20"
              >
                <AlertTriangle size={20} />
                AUTHORIZE PAYMENT
              </button>

              <div className="mt-8 flex items-center gap-4 justify-center text-xs font-bold text-gray-600 uppercase tracking-widest">
                <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-green-500"/> AES-256</span>
                <span className="flex items-center gap-1"><CreditCard size={14} className="text-purple-500"/> SSL SECURE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}