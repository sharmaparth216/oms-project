import React, { useEffect, useState } from "react";

interface Order {
  id: string;
  item_name: string;
  quantity: number;
  status: string;
}

const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const r = await fetch("http://localhost:8000/orders");
      const data: Order[] = await r.json();
      setOrders(data);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: "#F9FAFB",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
    }}>
      <h2 style={{ color: "#2563EB", marginBottom: "15px" }}>Orders</h2>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "left"
      }}>
        <thead>
          <tr style={{ background: "#E0E7FF" }}>
            <th style={{ padding: "10px" }}>ID</th>
            <th style={{ padding: "10px" }}>Item</th>
            <th style={{ padding: "10px" }}>Qty</th>
            <th style={{ padding: "10px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} style={{ borderBottom: "1px solid #D1D5DB" }}>
              <td style={{ padding: "10px", wordBreak: "break-word" }}>{o.id}</td>
              <td style={{ padding: "10px" }}>{o.item_name}</td>
              <td style={{ padding: "10px" }}>{o.quantity}</td>
              <td style={{
                padding: "10px",
                color: o.status === "completed" ? "green" : o.status === "processing" ? "orange" : "blue",
                fontWeight: "bold"
              }}>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersList;
