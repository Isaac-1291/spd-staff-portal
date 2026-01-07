import React, { useState, useEffect } from "react";
import StaffLogin from "./components/StaffLogin";

import StaffDashboard from "./components/dashboards/StaffDashboard";
import HrOfficerDashboard from "./components/dashboards/HrOfficerDashboard";
import HrManagerDashboard from "./components/dashboards/HrManagerDashboard";

export default function App() {
  const [staff, setStaff] = useState(null);

  // ✅ On app load, check localStorage for saved staff info
  useEffect(() => {
    const savedStaff = localStorage.getItem("staff");
    if (savedStaff) {
      setStaff(JSON.parse(savedStaff));
    }
  }, []);

  // 🔐 Not logged in
  if (!staff) {
    return (
      <StaffLogin
        onLogin={(loggedInStaff) => {
          setStaff(loggedInStaff);
          localStorage.setItem("staff", JSON.stringify(loggedInStaff));
        }}
      />
    );
  }

  // 🧠 Role-based dashboard rendering
  const handleLogout = () => {
    setStaff(null);
    localStorage.removeItem("staff");
  };

  switch (staff.role) {
    case "hr_officer":
      return <HrOfficerDashboard staff={staff} onLogout={handleLogout} />;

    case "hr_manager":
      return <HrManagerDashboard staff={staff} onLogout={handleLogout} />;

    default:
      return <StaffDashboard staff={staff} onLogout={handleLogout} />;
  }
}