import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const products = [
    { id: 1, name: "Neural Chipset v2.0", price: 500, icon: "🧠" },
    { id: 2, name: "Bio-Link Neural Implant", price: 1200, icon: "🔗" },
    { id: 3, name: "Quantum Firewall", price: 850, icon: "🛡️" },
    { id: 4, name: "AI Threat Scanner", price: 999, icon: "📡" }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <NavBar />
      
      {/* Subtle Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
            Tech <span className="text-purple-500">Sandbox</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Authorized hardware for behavioral security testing. All interactions are monitored by AI Sentinel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}