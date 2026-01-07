import React, { useState, useEffect } from "react";
import axios from "axios";
import spdLogo from "../../assets/spd-logo.jpg";

export default function HrOfficerDashboard({ staff, onLogout }) {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showLogout, setShowLogout] = useState(false);

  // ========================
  // Fetch all leaves
  // ========================
  const fetchLeaves = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:5000/api/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedLeaves = [...res.data].sort(
        (a, b) => new Date(a.leaveStartDate) - new Date(b.leaveStartDate)
      );

      setLeaveRequests(sortedLeaves);
    } catch (err) {
      console.error("Fetch leaves error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // ========================
  // Submit leave to manager
  // ========================
  const handleUpdate = async (id, updatedFields) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLeaveRequests((prev) =>
        prev.map((req) =>
          req._id === id
            ? { ...req, ...updatedFields, status: "SubmittedToManager" }
            : req
        )
      );

      await axios.put(
        `http://localhost:5000/api/leaves/hr-officer/${id}`,
        updatedFields,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchLeaves();
    } catch (err) {
      console.error("Update leave error:", err.response?.data || err.message);
    }
  };

  const formatMonth = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleString("default", { month: "short", year: "numeric" });
  };

  const isLocked = (status) =>
    status === "SubmittedToManager" || status === "Approved";

  // ========================
  // View Leave Advice
  // ========================
  const handleViewLeaveAdvice = async (leaveId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `http://localhost:5000/api/leaves/view/${leaveId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newWindow = window.open("", "_blank");
      newWindow.document.write(res.data);
      newWindow.document.close();
    } catch {
      alert("Leave advice not available yet.");
    }
  };

  return (
    <div
      style={{
        padding: "10px",
        minHeight: "100vh",
        fontSize: "11px",
        overflowX: "hidden",
        background: "#F7E7CE", // Champagne
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "6px",
          padding: "6px 10px",
          background: "#654321", // Dark Brown
          color: "#fff",
          borderRadius: "4px",
        }}
      >
        <h2 style={{ fontSize: "15px", margin: 0 }}>
          HR Officer Dashboard
        </h2>

        <div style={{ position: "relative" }}>
          <img
            src={spdLogo}
            alt="SPD Logo"
            style={{
              height: "34px",
              cursor: "pointer",
              background: "#F7E7CE",
              padding: "3px",
              borderRadius: "3px",
            }}
            onClick={() => setShowLogout(!showLogout)}
          />
          {showLogout && (
            <button
              onClick={onLogout}
              style={{
                fontSize: "10px",
                padding: "3px 6px",
                marginTop: "4px",
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <h3 style={{ fontSize: "13px", marginBottom: "6px", color: "#654321" }}>
        All Leave Requests
      </h3>

      {/* TABLE WRAPPER */}
      <div
        style={{
          width: "100%",
          overflowX: "auto",
          border: "1px solid #654321",
          background: "#fff",
          borderRadius: "4px",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "10.5px",
            minWidth: "1200px",
          }}
        >
          <thead>
            <tr style={{ background: "#F7E7CE" }}>
              {[
                "S/N",
                "Month",
                "Staff Name",
                "Staff No.",
                "Dept",
                "Station",
                "Outstanding",
                "Leave Type",
                "Start Date",
                "Year",
                "Status",
                "Days",
                "Travelling Days",
                "Xmas Holidays",
                "Days Taken",
                "Resumption",
                "Action",
                "Advice",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    border: "1px solid #654321",
                    padding: "3px",
                    whiteSpace: "nowrap",
                    textAlign: "left",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {leaveRequests.map((req, idx) => (
              <tr key={req._id}>
                <td>{idx + 1}</td>
                <td>{formatMonth(req.leaveStartDate)}</td>
                <td>{req.staffName}</td>
                <td>{req.staffNumber}</td>
                <td>{req.department}</td>
                <td>{req.station}</td>

                <td>
                  <input
                    type="number"
                    value={req.outstandingDays || 0}
                    disabled={isLocked(req.status)}
                    style={{ width: "50px", fontSize: "10px" }}
                    onChange={(e) =>
                      setLeaveRequests((prev) =>
                        prev.map((l) =>
                          l._id === req._id
                            ? { ...l, outstandingDays: e.target.value }
                            : l
                        )
                      )
                    }
                  />
                </td>

                <td>{req.leaveType}</td>
                <td>{req.leaveStartDate?.slice(0, 10)}</td>
                <td>{req.year}</td>
                <td>{req.status}</td>

                {["noOfDays", "travellingDays", "christmasBreak", "daysTaken"].map(
                  (field) => (
                    <td key={field}>
                      <input
                        type="number"
                        value={req[field] || ""}
                        disabled={isLocked(req.status)}
                        style={{ width: "48px", fontSize: "10px" }}
                        onChange={(e) =>
                          setLeaveRequests((prev) =>
                            prev.map((l) =>
                              l._id === req._id
                                ? { ...l, [field]: e.target.value }
                                : l
                            )
                          )
                        }
                      />
                    </td>
                  )
                )}

                <td>
                  <input
                    type="date"
                    value={req.dateOfResumption?.slice(0, 10) || ""}
                    disabled={isLocked(req.status)}
                    style={{ fontSize: "10px" }}
                    onChange={(e) =>
                      setLeaveRequests((prev) =>
                        prev.map((l) =>
                          l._id === req._id
                            ? { ...l, dateOfResumption: e.target.value }
                            : l
                        )
                      )
                    }
                  />
                </td>

                <td>
                  <button
                    disabled={isLocked(req.status)}
                    style={{ fontSize: "10px", padding: "2px 5px" }}
                    onClick={() =>
                      handleUpdate(req._id, {
                        noOfDays: req.noOfDays,
                        travellingDays: req.travellingDays,
                        outstandingDays: req.outstandingDays,
                        christmasBreak: req.christmasBreak,
                        daysTaken: req.daysTaken,
                        dateOfResumption: req.dateOfResumption,
                      })
                    }
                  >
                    {isLocked(req.status) ? "Submitted" : "Submit"}
                  </button>
                </td>

                <td>
                  {req.status === "Approved" ? (
                    <button
                      style={{ fontSize: "10px", padding: "2px 5px" }}
                      onClick={() => handleViewLeaveAdvice(req._id)}
                    >
                      View
                    </button>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}