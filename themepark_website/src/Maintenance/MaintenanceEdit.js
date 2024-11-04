import "./Maintenance.css";
import React, { useState, useEffect } from "react";
import MainLogo from "../images/flagslogo.png";
import {
  RandomBGImg,
  MessageBox,
  FancyButton,
} from "../Auth/AuthComponents";
import { api } from "../App";

export function MaintenanceDataBox(props) {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [message, setMessage] = useState("");
  const [searchRideName, setSearchRideName] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(props.apiPath || "/maintenance/data"); 
        setMaintenanceData(response.data);
        setFilteredData(response.data); 
      } catch (error) {
        if (error.response) {
          setMessage("Failed to load data: Server error");
        } else if (error.request) {
          setMessage("Failed to connect to server");
        } else {
          setMessage("Unknown error");
        }
      }
    }
    fetchData();
  }, [props.apiPath]);

  const handleSearch = () => {
    const filtered = maintenanceData.filter((item) => {
      const matchesRideName = searchRideName
        ? item.rideName.toLowerCase().includes(searchRideName.toLowerCase())
        : true;
      const matchesDate = searchDate ? item.date === searchDate : true;
      return matchesRideName && matchesDate;
    });
    setFilteredData(filtered);
  };

  const handleEdit = (item) => {
    alert(`Editing record for Maintenance ID: ${item.maintenanceId}`);
  };

  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete Maintenance ID: ${item.maintenanceId}?`);
    if (confirmDelete) {
      try {
        await api.delete(`/maintenance/delete/${item.maintenanceId}`);
        setMessage("Record deleted successfully");
        setMaintenanceData(maintenanceData.filter((data) => data.maintenanceId !== item.maintenanceId));
        setFilteredData(filteredData.filter((data) => data.maintenanceId !== item.maintenanceId));
      } catch (error) {
        setMessage("Failed to delete record");
      }
    }
  };

  return (
    <div className="loginbox" style={{
      width: "80%", 
      padding: "20px", 
      maxWidth: "1000px", 
      margin: "0 auto", 
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
      borderRadius: "10px", 
    }}>
      <a href="/">
        <img src={MainLogo} alt="Main Logo" />
      </a>
      <div style={{ fontSize: "20px", margin: "-18px 0px 14px 0px" }}>
        {props.title}
      </div>
      <hr style={{ color: "lightgrey", margin: "0px 8px 16px 8px" }} />
      <MessageBox message={message} />

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by Ride Name"
          value={searchRideName}
          onChange={(e) => setSearchRideName(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            flex: 1,
          }}
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            flex: 1,
          }}
        />
        <button
          className="btn btn-primary"
          onClick={handleSearch}
          style={{ padding: "8px 20px" }}
        >
          Search
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Maintenance ID</th>
            <th>Ride ID</th>
            <th>Ride Name</th>
            <th>Date</th>
            <th>Description</th>
            <th>Modify</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.maintenanceId}</td>
                <td>{item.rideId}</td>
                <td>{item.rideName}</td>
                <td>{item.date}</td>
                <td>{item.description}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(item)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No maintenance records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <FancyButton text="Refresh" action={() => window.location.reload()} />
    </div>
  );
}

export function MaintenanceData(props) {
  return (
    <div className="container">
      <RandomBGImg />
      <MaintenanceDataBox
        title={props.title || "Maintenance Records"}
        apiPath={props.apiPath || "/maintenance/data"}
      />
    </div>
  );
}
