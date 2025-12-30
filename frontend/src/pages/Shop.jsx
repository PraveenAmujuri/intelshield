// Add this import at the top
import { ShieldAlert, Zap, Globe } from "lucide-react";

// Add this component inside your Shop function, above the products grid
const SecurityTestPanel = () => {
  const triggerPhishingTest = () => {
    // Simulates a URL structure that triggers your phishing_engine.py
    window.history.pushState({}, '', '/shop?verify_account=true&redirect=@external-node');
    alert("Phishing Signal Sent: Check backend logs for risk score.");
  };

  const triggerBotVelocity = () => {
    // Rapidly emits mouse movements to bypass throttle and test Isolation Forest
    for (let i = 0; i < 50; i++) {
      socket.emit("mouse_move", { x: Math.random(), y: Math.random() });
    }
    alert("Bot Velocity Test: If your AI threshold is tight, you may be blocked.");
  };

  return (
    <div className="mb-12 p-6 rounded-2xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4 text-purple-400">
        <ShieldAlert size={20} />
        <h2 className="text-sm font-bold uppercase tracking-widest">Security Stress Testing</h2>
      </div>
      <div className="flex flex-wrap gap-4">
        <button 
          onClick={triggerBotVelocity}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-red-500/20 hover:border-red-500/50 transition-all text-sm font-medium"
        >
          <Zap size={16} className="text-yellow-500" /> Simulate Bot Velocity
        </button>
        <button 
          onClick={triggerPhishingTest}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-blue-500/20 hover:border-blue-500/50 transition-all text-sm font-medium"
        >
          <Globe size={16} className="text-blue-500" /> Simulate Phishing URL
        </button>
      </div>
    </div>
  );
};