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
    <div 
      className="group bg-black/30 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/10 hover:border-blue-400/50 shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-3 transition-all duration-500 h-[420px] flex flex-col justify-between cursor-pointer"
      onClick={handleAddToCart}
    >
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-2xl">
          <span className="text-xl font-bold drop-shadow-lg">🛠️</span>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4 group-hover:from-blue-400">
          {product.name}
        </h3>
      </div>
      <div className="space-y-6">
        <div className="text-4xl font-black text-blue-400 drop-shadow-2xl text-center">
          ${product.price}
        </div>
        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 border border-blue-500/50 hover:border-white/50">
          Add to Cart →
        </button>
      </div>
    </div>
  );
}
