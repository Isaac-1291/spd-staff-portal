import React, { useState, useEffect } from "react";
import axios from "axios";
import spdLogo from "../../assets/spd-logo.jpg";

// ✅ Use Vite env variable for backend URL
const API_BASE = import.meta.env.VITE_API_URL;

export default function HrManagerDashboard({ staff, onLogout }) {
  const [showLogout, setShowLogout] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const spdColors = {
    champagne: "#F7E7CE",
    auburn: "#A52A2A",
    beaver: "#9F8170",
    darkBrown: "#654321",
  };

  // ========================
  // Fetch leaves submitted to HR Manager
  // ========================
  const fetchLeaves = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`${API_BASE}/api/leaves/hr-manager`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaveRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch leaves:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // ========================
  // Approve / Reject Leave
  // ========================
  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.put(
        `${API_BASE}/api/leaves/hr-manager/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedLeave(null);
      fetchLeaves();
    } catch (err) {
      console.error("Action failed:", err.response?.data || err.message);
    }
  };

  // ========================
  // View Leave Advice HTML
  // ========================
  const handleViewAdvice = async (leaveId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`${API_BASE}/api/leaves/view/${leaveId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newWindow = window.open("", "_blank");
      newWindow.document.write(res.data);
      newWindow.document.close();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Leave advice not available yet.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
        background: spdColors.champagne,
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
        }}
      >
        <strong style={{ fontSize: "12px" }}>{staff.fullName}</strong>

        <h1 style={{ margin: 0, fontSize: "15px" }}>
          SPD HR Manager Dashboard
        </h1>

        <div style={{ position: "relative" }}>
          <img
            src={spdLogo}
            alt="SPD Logo"
            style={{
              height: 42,
              cursor: "pointer",
              background: spdColors.champagne,
              padding: "3px",
              borderRadius: "4px",
            }}
            onClick={() => setShowLogout(!showLogout)}
          />
          {showLogout && (
            <button
              onClick={onLogout}
              style={{
                marginTop: 4,
                fontSize: "10px",
                padding: "2px 6px",
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Main */}
      <main style={{ padding: "14px" }}>
        <h2
          style={{
            color: spdColors.darkBrown,
            fontSize: "13px",
            marginBottom: "8px",
          }}
        >
          Leave Requests Pending Approval
        </h2>

        <table
          width="100%"
          border="1"
          cellPadding="6"
          style={{
            background: "#fff",
            borderColor: spdColors.darkBrown,
            fontSize: "11px",
          }}
        >
          <thead
            style={{
              background: spdColors.champagne,
              color: spdColors.darkBrown,
            }}
          >
            <tr>
              <th>S/N</th>
              <th>Staff</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {leaveRequests.map((leave, idx) => (
              <tr key={leave._id}>
                <td>{idx + 1}</td>
                <td>{leave.staffName}</td>
                <td>{leave.leaveType}</td>
                <td>{leave.leaveStartDate?.slice(0, 10)}</td>
                <td>{leave.status}</td>
                <td>
                  {leave.status === "SubmittedToManager" && (
                    <>
                      <button
                        onClick={() => handleViewAdvice(leave._id)}
                        style={{
                          marginRight: 4,
                          fontSize: "10px",
                        }}
                      >
                        View Advice
                      </button>
                      <button
                        onClick={() => updateStatus(leave._id, "Approved")}
                        style={{
                          marginRight: 4,
                          fontSize: "10px",
                          background: "green",
                          color: "white",
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(leave._id, "Rejected")}
                        style={{
                          fontSize: "10px",
                          background: "red",
                          color: "white",
                        }}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {leave.status === "Approved" && (
                    <button
                      onClick={() => handleViewAdvice(leave._id)}
                      style={{ fontSize: "10px" }}
                    >
                      View Approved Advice
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}