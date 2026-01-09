import React, { useState, useEffect } from "react";
import spdLogo from "../../assets/spd-logo.jpg";
import Leave from "./Leave";

export default function StaffDashboard({ staff, onLogout }) {
  const [showLogout, setShowLogout] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("welcome");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  const spdColors = {
    champagne: "#F7E7CE",
    auburn: "#A52A2A",
    beaver: "#9F8170",
    darkBrown: "#654321",
  };

  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        fontSize: "11px",
        backgroundColor: spdColors.champagne,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 10px",
          backgroundColor: spdColors.darkBrown,
          color: "#fff",
          borderBottom: "2px solid #4a2f1a",
          position: "relative",
        }}
      >
        {/* Left */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            minWidth: "0",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              fontSize: "11px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "120px",
            }}
          >
            {staff.fullName}
          </span>

          <div
            style={{
              height: "6px",
              width: "6px",
              backgroundColor: "green",
              borderRadius: "50%",
            }}
          />

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: spdColors.champagne,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ☰
          </button>
        </div>

        {/* Center title (hide on mobile) */}
        {!isMobile && (
          <h1
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "14px",
              fontWeight: "bold",
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            SPD Staff Portal
          </h1>
        )}

        {/* Right */}
        <div style={{ position: "relative" }}>
          <img
            src={spdLogo}
            alt="SPD Logo"
            style={{
              height: 32,
              width: 32,
              borderRadius: "50%",
              cursor: "pointer",
              backgroundColor: spdColors.champagne,
              padding: "2px",
            }}
            onClick={() => setShowLogout(!showLogout)}
          />
          {showLogout && (
            <div
              style={{
                position: "absolute",
                top: "38px",
                right: 0,
                backgroundColor: spdColors.beaver,
                borderRadius: "4px",
                padding: "4px",
                zIndex: 10,
              }}
            >
              <button
                onClick={onLogout}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "42px",
            left: "8px",
            backgroundColor: spdColors.beaver,
            color: "white",
            borderRadius: "5px",
            padding: "10px",
            zIndex: 1000,
            fontSize: "11px",
          }}
        >
          <h4 style={{ marginBottom: "6px" }}>Staff Matters</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li
              style={{ padding: "5px 0", cursor: "pointer" }}
              onClick={() => {
                setActivePage("leave");
                setMenuOpen(false);
              }}
            >
              Leave
            </li>
            <li
              style={{ padding: "5px 0", cursor: "pointer" }}
              onClick={() => {
                setActivePage("welcome");
                setMenuOpen(false);
              }}
            >
              Payslip
            </li>
            <li style={{ padding: "5px 0" }}>Appraisal</li>
            <li style={{ padding: "5px 0" }}>Circulars</li>
            <li style={{ padding: "5px 0" }}>COCOBOD Policy</li>
          </ul>
        </div>
      )}

      {/* Main */}
      <main style={{ width: "100%", padding: "12px" }}>
        {activePage === "welcome" && (
          <div
            className="welcome-message"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "18px",
              fontWeight: "bold",
              color: "white",
              height: "65vh",
              borderRadius: "10px",
              textAlign: "center",
              background: `linear-gradient(to bottom right, ${spdColors.champagne}, ${spdColors.auburn}, ${spdColors.beaver}, ${spdColors.darkBrown})`,
              animation: "fadeInScale 1.5s ease-out forwards, shimmer 10s linear infinite",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Welcome to SPD Staff Portal
          </div>
        )}

        {activePage === "leave" && <Leave staff={staff} />}
      </main>

      {/* Animation CSS */}
      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 0.6; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes shimmer {
          0% { background-position: -500px 0; }
          100% { background-position: 500px 0; }
        }

        .welcome-message {
          background: linear-gradient(90deg, #F7E7CE, #A52A2A, #9F8170, #654321);
          background-size: 1000px 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}