import React, { useState, useEffect } from "react";
import axios from "axios";

const departments = [
  "ACCOUNT",
  "AUDIT",
  "INFORMATION SYSTEM",
  "HUMAN RESOURCE",
  "TECHNICAL",
  "TRANSPORT",
  "SPECIAL SERVICES",
  "ESTATE",
  "PROCUREMENT",
];

const leaveTypes = [
  "Annual Leave",
  "Part Leave",
  "Casual Leave",
  "Compassionate Leave",
];

export default function Leave({ staff }) {
  const [formData, setFormData] = useState({
    department: "",
    station: "",
    rank: "",
    region: "",
    outstandingDays: "",
    leaveType: "",
    leaveStartDate: "",
    year: new Date().getFullYear(),
  });

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===============================
  // FETCH LOGGED-IN STAFF LEAVES
  // ===============================
  const fetchMyLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        "http://localhost:5000/api/leaves/my",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLeaveRequests(res.data);
    } catch (err) {
      console.error("Fetch leaves error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  // ===============================
  // FORM HANDLERS
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in.");

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/leaves",
        {
          staffName: staff.fullName,
          staffNumber: staff.staffNumber,
          ...formData,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Leave request submitted successfully");

      setFormData({
        department: "",
        station: "",
        rank: "",
        region: "",
        outstandingDays: "",
        leaveType: "",
        leaveStartDate: "",
        year: new Date().getFullYear(),
      });

      fetchMyLeaves();
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // VIEW APPROVED LEAVE ADVICE HTML
  // ===============================
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
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Leave advice not available yet.");
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div style={{ padding: "15px", fontFamily: "Arial", fontSize: "11px" }}>
      <h2 style={{ fontSize: "16px" }}>Staff Leave Request</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "6px", // tighter spacing
          fontSize: "11px",
        }}
      >
        <input value={staff.fullName} readOnly style={{ fontSize: "11px" }} />
        <input value={staff.staffNumber} readOnly style={{ fontSize: "11px" }} />

        <input
          name="rank"
          placeholder="Rank"
          value={formData.rank}
          onChange={handleChange}
          required
          style={{ fontSize: "11px" }}
        />

        <input
          name="region"
          placeholder="Region"
          value={formData.region}
          onChange={handleChange}
          required
          style={{ fontSize: "11px" }}
        />

        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          style={{ fontSize: "11px" }}
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <input
          name="station"
          placeholder="Station"
          value={formData.station}
          onChange={handleChange}
          required
          style={{ fontSize: "11px" }}
        />

        <input
          type="number"
          name="outstandingDays"
          placeholder="Outstanding Days"
          value={formData.outstandingDays}
          onChange={handleChange}
          required
          style={{ fontSize: "11px" }}
        />

        <select
          name="leaveType"
          value={formData.leaveType}
          onChange={handleChange}
          required
          style={{ fontSize: "11px" }}
        >
          <option value="">Select Leave Type</option>
          {leaveTypes.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="leaveStartDate"
          value={formData.leaveStartDate}
          onChange={handleChange}
          required
          style={{ fontSize: "11px" }}
        />

        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          required
          style={{ fontSize: "11px" }}
        />

        <button
          disabled={loading}
          style={{ fontSize: "11px", padding: "4px" }}
        >
          {loading ? "Submitting..." : "Submit Leave"}
        </button>
      </form>

      <hr />

      <h3 style={{ fontSize: "14px" }}>My Leave Requests</h3>

      <table
        border="1"
        width="100%"
        cellPadding="4"
        style={{ fontSize: "11px", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Start</th>
            <th>Year</th>
            <th>Status</th>
            <th>Advice</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((leave, index) => (
            <tr key={leave._id}>
              <td>{index + 1}</td>
              <td>{leave.leaveType}</td>
              <td>{leave.leaveStartDate?.slice(0, 10)}</td>
              <td>{leave.year}</td>
              <td>{leave.status}</td>
              <td>
                {leave.status === "Approved" ? (
                  <button
                    onClick={() => handleViewLeaveAdvice(leave._id)}
                    style={{ fontSize: "11px", padding: "2px 4px" }}
                  >
                    View / Print
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
  );
}