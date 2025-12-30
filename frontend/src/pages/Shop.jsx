import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const products = [
    { id: 1, name: "Neural Chipset v2.0", price: 500 },
    { id: 2, name: "Bio-Link Neural Implant", price: 1200 },
    { id: 3, name: "Quantum Firewall", price: 850 },
    { id: 4, name: "AI Threat Scanner", price: 999 }
  ];

  return (
    <>
      <NavBar />
      <div className="pt-20 pb-16 px-4 min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl lg:text-7xl font-black text-center mb-24 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
            Tech Sandbox
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
