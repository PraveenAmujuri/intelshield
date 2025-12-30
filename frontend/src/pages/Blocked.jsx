export default function Blocked({ reason }) {
  return (
    <div style={{ textAlign: "center", color: "red", padding: "5rem" }}>
      <h1>⚠️ Access Restricted</h1>
      <p>IntelShield detected abnormal behavioral patterns.</p>
      <div style={{ background: "#eee", padding: "1.5rem", borderRadius: "8px", margin: "2rem auto", maxWidth: "400px" }}>
        <h3>AI Explanation (SHAP):</h3>
        <p style={{ color: "#333" }}>{reason || "Suspicious session activity detected."}</p>
      </div>
      <p>Manual review requested. Please wait for Admin intervention.</p>
    </div>
  );
}