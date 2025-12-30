import { socket } from "../socket/socket";
import NavBar from "../components/NavBar";

export default function Checkout() {
  const handleFinalPurchase = () => {
    // Trigger high-risk intent packet
    socket.emit("behavior_packet", {
      action: "FINAL_CHECKOUT_ATTEMPT",
      timestamp: Date.now(),
      metadata: {
        location: "Unknown", // Simulated metadata
        device: navigator.userAgent
      }
    });
    alert("🛡️ IntelShield analyzing transaction...\nFraud models active!");
  };

  return (
    <>
      <NavBar />
      <div className="pt-20 pb-16 px-4 min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="max-w-md mx-auto bg-black/50 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl">
            Review Order
          </h2>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-2xl text-gray-300 mb-2">Total Items</div>
              <div className="text-4xl font-bold text-white">1</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-gray-300 mb-2">Total Amount</div>
              <div className="text-5xl font-black bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl">
                $1,200
              </div>
            </div>
            <button
              onClick={handleFinalPurchase}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-orange-600 hover:to-red-600 text-white font-black py-6 px-8 rounded-2xl shadow-2xl hover:shadow-red-500/50 hover:scale-105 transform transition-all duration-300 text-xl border-2 border-red-500/50 hover:border-white/50"
            >
              🚨 Confirm High-Risk Payment
            </button>
          </div>
          <div className="mt-8 p-4 bg-blue-500/20 border border-blue-500/30 rounded-2xl text-center">
            <p className="text-blue-300 font-medium">🛡️ IntelShield ML models analyzing...</p>
            <p className="text-sm text-blue-400 mt-1">Behavioral + Fraud + Identity checks</p>
          </div>
        </div>
      </div>
    </>
  );
}
