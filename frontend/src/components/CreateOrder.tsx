import React, { useState } from "react";

const CreateOrder: React.FC = () => {
  const [item, setItem] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [msg, setMsg] = useState<string>("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg("Creating...");
    try {
      const res = await fetch("http://localhost:8000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_name: item, quantity: Number(qty) })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Order created: " + data.id);
        setItem(""); 
        setQty(1);
      } else { 
        setMsg("Error: " + data.detail); 
      }
    } catch(err: any) { 
      setMsg("Network error: " + err.message); 
    }
    setTimeout(()=>setMsg(""),4000);
  };

  return (
    <div style={{
      background: "#F3F4F6",
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "30px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ color: "#2563EB" }}>Create Order</h2>
      <form onSubmit={submit} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input 
          value={item} 
          onChange={e=>setItem(e.target.value)} 
          placeholder="Item" 
          required 
          style={{
            flex: "1",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #D1D5DB"
          }}
        />
        <input 
          type="number" 
          value={qty} 
          min={1} 
          onChange={e=>setQty(Number(e.target.value))} 
          style={{
            width: "80px",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #D1D5DB"
          }}
        />
        <button type="submit" style={{
          background: "#2563EB",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "0.3s"
        }}
        onMouseOver={e => (e.currentTarget.style.background="#1D4ED8")}
        onMouseOut={e => (e.currentTarget.style.background="#2563EB")}
        >
          Create
        </button>
      </form>
      <p style={{ marginTop: "10px", color: "#1F2937" }}>{msg}</p>
    </div>
  );
};

export default CreateOrder;
