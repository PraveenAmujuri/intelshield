import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const products = [
    { id: 1, name: "Neural Chipset v2.0", price: "42,000", desc: "High-performance processing unit for edge computing and localized neural tasks." },
    { id: 2, name: "Bio-Link Neural Implant", price: "1,15,000", desc: "Enterprise-grade neural interface designed for seamless hardware-to-cloud data transmission." },
    { id: 3, name: "Quantum Firewall Node", price: "72,500", desc: "Hardware-level encryption node providing multi-layer packet filtering for secure networks." },
    { id: 4, name: "AI Threat Scanner", price: "84,999", desc: "Advanced behavioral analysis unit for real-time identification of system anomalies." }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <NavBar />
      
      <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Authorized <span className="text-purple-500">Hardware</span>
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl font-medium">
            Procure validated components for your secure infrastructure. All units are shipped with pre-installed biometric verification.
          </p>
        </header>

        {/* Grid uses grid-stretch to ensure all cards match height */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}