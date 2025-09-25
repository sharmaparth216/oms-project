import React from "react";
import CreateOrder from "./components/CreateOrder";
import OrdersList from "./components/OrdersList";

const App: React.FC = () => {
  return (
    <div style={{
      maxWidth: "800px",
      margin: "40px auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "0 20px"
    }}>
      <h1 style={{ textAlign: "center", color: "#1E40AF" }}>Order Dashboard</h1>
      <CreateOrder />
      <OrdersList />
    </div>
  );
};

export default App;
