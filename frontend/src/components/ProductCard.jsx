import { socket } from "../socket/socket";

export default function ProductCard({ product }) {
const handleAddToCart = (e) => {
    if (!socket.connected) return;

    // Send the specific click location relative to the screen
    socket.emit("behavior_packet", {
      action: "ADD_TO_CART",
      item_id: product.id,
      item_name: product.name,
      x: e.clientX, 
      y: e.clientY,
      timestamp: Date.now()
    });

    alert(`${product.name} added to cart!`);
  };
  return (
    <div style={{ 
      border: "1px solid #444", 
      padding: "1.5rem", 
      margin: "1rem", 
      borderRadius: "8px",
      background: "#1a1a1a",
      color: "white"
    }}>
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <button 
        onClick={handleAddToCart}
        style={{ padding: "8px 16px", cursor: "pointer", background: "#4CAF50", color: "white", border: "none", borderRadius: "4px" }}
      >
        Add to Cart
      </button>
    </div>
  );
}