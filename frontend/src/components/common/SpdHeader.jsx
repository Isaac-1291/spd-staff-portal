import spdLogo from "../../assets/spd-logo.jpg";

export default function SpdHeader({ title, onMenuClick, onLogout }) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px 30px",
        background: "#654321",
        color: "white",
      }}
    >
      {/* MENU */}
      <button
        onClick={onMenuClick}
        style={{
          fontSize: "22px",
          background: "transparent",
          border: "none",
          color: "white",
          cursor: "pointer",
        }}
      >
        ☰
      </button>

      {/* TITLE */}
      <h2 style={{ margin: 0 }}>{title}</h2>

      {/* LOGO + LOGOUT */}
      <div style={{ position: "relative" }}>
        <img
          src={spdLogo}
          alt="SPD Logo"
          style={{ width: 45, borderRadius: "50%", cursor: "pointer" }}
        />
        <button
          onClick={onLogout}
          style={{
            position: "absolute",
            top: 50,
            right: 0,
            background: "#A52A2A",
            color: "white",
            border: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}