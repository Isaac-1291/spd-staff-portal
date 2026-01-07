import React, { useState } from "react";
import spdLogo from "../assets/spd-logo.jpg";
import axios from "axios";

export default function StaffLogin({ onLogin }) {
  const [staffNumber, setStaffNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedStaffNumber = staffNumber.trim();
    const trimmedPassword = password.trim();

    if (!trimmedStaffNumber || !trimmedPassword) {
      alert("Please enter Staff Number and Password");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        staffNumber: trimmedStaffNumber,
        password: trimmedPassword,
      });

      // ✅ Store JWT token in localStorage for API requests
      localStorage.setItem("token", res.data.token);

      // Pass staff info to parent component
      onLogin(res.data.staff);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        background:
          "linear-gradient(to bottom right, #F7E7CE, #A52A2A, #9F8170, #654321)",
      }}
    >
      <img
        src={spdLogo}
        alt="SPD Logo"
        style={{
          height: "80px",
          width: "80px",
          marginBottom: "20px",
          borderRadius: "50%",
        }}
      />
      <h2
        style={{
          color: "#654321",
          fontSize: "28px",
          marginBottom: "20px",
        }}
      >
        SPD Staff Login
      </h2>

      <input
        type="text"
        placeholder="Staff Number"
        value={staffNumber}
        onChange={(e) => setStaffNumber(e.target.value)}
        style={{
          padding: "10px",
          margin: "10px 0",
          width: "250px",
          borderRadius: "5px",
          border: "1px solid #654321",
          fontSize: "16px",
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          padding: "10px",
          margin: "10px 0",
          width: "250px",
          borderRadius: "5px",
          border: "1px solid #654321",
          fontSize: "16px",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "250px",
          marginTop: "15px",
        }}
      >
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            padding: "10px 15px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#A52A2A",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontWeight: "bold",
          }}
        >
          ➤ {loading ? "Signing In..." : "Sign In"}
        </button>
        <button
          onClick={() => alert("Forgot Password clicked")}
          style={{
            padding: "10px 15px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#9F8170",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontWeight: "bold",
          }}
        >
          🔑 Forgot?
        </button>
      </div>
    </div>
  );
}