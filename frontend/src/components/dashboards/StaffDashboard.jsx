import React, { useState } from "react";
import spdLogo from "../../assets/spd-logo.jpg";
import Leave from "./Leave";

export default function StaffDashboard({ staff, onLogout }) {
  const [showLogout, setShowLogout] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("welcome"); // "welcome" | "leave"

  const spdColors = {
    champagne: "#F7E7CE",
    auburn: "#A52A2A",
    beaver: "#9F8170",
    darkBrown: "#654321",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        fontSize: "12px", // reduced font size
        backgroundColor: spdColors.champagne,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 16px",
          backgroundColor: spdColors.darkBrown,
          color: "#fff",
          borderBottom: "3px solid #4a2f1a",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontWeight: "bold", fontSize: "12px" }}>
            {staff.fullName}
          </span>
          <div
            style={{
              height: "8px",
              width: "8px",
              backgroundColor: "green",
              borderRadius: "50%",
            }}
          ></div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: spdColors.champagne,
              cursor: "pointer",
              background: "none",
              border: "none",
            }}
          >
            ☰
          </button>
        </div>

        <h1
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "18px", // smaller than original
            fontWeight: "bold",
            color: spdColors.champagne,
            margin: 0,
          }}
        >
          SPD Staff Portal
        </h1>

        <div style={{ position: "relative" }}>
          <img
            src={spdLogo}
            alt="SPD Logo"
            style={{
              height: 40,
              width: 40,
              borderRadius: "50%",
              cursor: "pointer",
              backgroundColor: spdColors.champagne,
              padding: "3px",
            }}
            onClick={() => setShowLogout(!showLogout)}
          />
          {showLogout && (
            <div
              style={{
                position: "absolute",
                top: "50px",
                right: 0,
                backgroundColor: spdColors.beaver,
                borderRadius: "5px",
                padding: "5px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                zIndex: 10,
              }}
            >
              <button
                onClick={onLogout}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "5px",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Menu Dropdown */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "16px",
            backgroundColor: spdColors.beaver,
            color: "white",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
            padding: "12px",
            zIndex: 1000,
            fontSize: "12px",
          }}
        >
          <h4 style={{ marginBottom: "8px" }}>Staff Matters</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li
              style={{ padding: "6px 0", cursor: "pointer" }}
              onClick={() => {
                setActivePage("leave");
                setMenuOpen(false);
              }}
            >
              Leave
            </li>
            <li
              style={{ padding: "6px 0", cursor: "pointer" }}
              onClick={() => {
                setActivePage("welcome");
                setMenuOpen(false);
              }}
            >
              Payslip
            </li>
            <li style={{ padding: "6px 0", cursor: "pointer" }}>Appraisal</li>
            <li style={{ padding: "6px 0", cursor: "pointer" }}>Circulars</li>
            <li style={{ padding: "6px 0", cursor: "pointer" }}>
              COCOBOD Policy
            </li>
          </ul>
        </div>
      )}

      {/* Main Section */}
      <main style={{ flex: 1, width: "100%", padding: "16px" }}>
        {activePage === "welcome" && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "24px", // reduced font size
              fontWeight: "bold",
              color: "white",
              background: `linear-gradient(to bottom right, ${spdColors.champagne}, ${spdColors.auburn}, ${spdColors.beaver}, ${spdColors.darkBrown})`,
              height: "65vh",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            Welcome to SPD Staff Portal
          </div>
        )}
        {activePage === "leave" && <Leave staff={staff} />}
      </main>
    </div>
  );
}