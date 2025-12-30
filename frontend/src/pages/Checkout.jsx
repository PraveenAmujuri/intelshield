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
  };

  return (
    <div>
      <NavBar />
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <h2>Review Order</h2>
        <div style={{ border: "1px solid #ccc", padding: "2rem", display: "inline-block" }}>
          <p>Total Items: 1</p>
          <p><strong>Total Amount: $1200</strong></p>
          <button 
            onClick={handleFinalPurchase}
            style={{ padding: "12px 24px", fontSize: "1.1rem", background: "#ff4757", color: "white", border: "none", cursor: "pointer" }}
          >
            Confirm & Pay
          </button>
        </div>
      </div>
    </div>
  );
}