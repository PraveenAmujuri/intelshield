import { ShieldAlert, Zap, Globe, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import NavBar from "../components/NavBar";
import { useCart } from "../contexts/CartContext";
import { socket } from "../socket/socket";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  const testPhishingAttack = () => {
    socket.emit("phishing_signal", {
      url: "http://fake-bank.com/login?verify=true",
      hostname: "fake-bank.com",
      has_at: true,
    });
    alert("Phishing Signal Injected.");
  };

  if (cartItems.length === 0) {
    return (
      <>
        <NavBar />
        <div className="pt-20 min-h-screen bg-[#030303] flex flex-col items-center justify-center px-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="text-gray-500" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Cart is empty</h1>
            <p className="text-gray-500 mb-8">No authorized components detected in current session.</p>
            <Link to="/shop" className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-purple-500 hover:text-white transition-all">
              Return to Marketplace
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="pt-32 pb-20 px-6 min-h-screen bg-[#030303]">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-black mb-12 flex items-center gap-4">
            Shopping <span className="text-purple-500">Cart</span>
            <span className="text-sm font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-full">{totalItems} Units</span>
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* List Section */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex items-center gap-6 transition-all hover:border-white/20">
                  <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center text-purple-400">
                    <Zap size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-white">{item.name}</h3>
                    <p className="text-purple-500 font-mono text-sm">₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-black rounded-lg p-1 border border-white/5">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:text-purple-400 transition-colors"><Minus size={16}/></button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:text-purple-400 transition-colors"><Plus size={16}/></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className="space-y-6">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 sticky top-32">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-6">Order Summary</h3>
                <div className="flex justify-between items-end mb-8">
                  <span className="text-gray-400">Total Amount</span>
                  <span className="text-3xl font-black text-white">₹{totalPrice.toLocaleString()}</span>
                </div>
                <Link to="/checkout" className="block w-full bg-white text-black py-4 rounded-xl font-bold text-center hover:bg-purple-600 hover:text-white transition-all shadow-xl">
                  Proceed to Checkout →
                </Link>
                
                {/* Embedded Test Panel */}
                <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
                  <p className="text-[10px] uppercase text-gray-600 font-bold tracking-tighter">Security Sandbox</p>
                  <button onClick={testPhishingAttack} className="w-full py-2 bg-red-500/10 text-red-500 rounded-lg text-xs font-bold border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
                    Trigger Phishing Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}