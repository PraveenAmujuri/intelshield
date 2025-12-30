import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const products = [
    { id: 1, name: "Neural Chipset v2.0", price: "42,000", icon: "🧠", desc: "Next-gen synaptic processor for localized AI." },
    { id: 2, name: "Bio-Link Neural Implant", price: "1,15,000", icon: "🔗", desc: "Low-latency direct neural-to-cloud interface." },
    { id: 3, name: "Quantum Firewall Node", price: "72,500", icon: "🛡️", desc: "Military-grade packet isolation for home networks." },
    { id: 4, name: "AI Threat Scanner", price: "84,999", icon: "📡", desc: "Real-time behavioral analysis and threat detection." }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-purple-500/30">
      <NavBar />
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-16 border-b border-white/5 pb-10">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            Security <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Marketplace</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl">
            Authorized procurement for enterprise-grade hardware. Prices inclusive of GST.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}