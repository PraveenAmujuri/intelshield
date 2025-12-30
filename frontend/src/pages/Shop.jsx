import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const products = [
    { id: 1, name: "Neural Chipset", price: 500 },
    { id: 2, name: "Bio-Link v3", price: 1200 }
  ];

  return (
    <div>
      <NavBar />
      <div style={{ padding: "2rem" }}>
        <h1>Tech Sandbox</h1>
        <div style={{ display: "flex" }}>
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}