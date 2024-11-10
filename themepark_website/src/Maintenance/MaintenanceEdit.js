import "./Maintenance.css";
import React, { useState, useEffect } from "react";
import MainLogo from "../images/flagslogo.png";
import { RandomBGImg, MessageBox, FancyButton } from "../Auth/AuthComponents";
import { api } from "../App";

export function MaintenanceDataBox(props) {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [message, setMessage] = useState("");
  const [searchRideName, setSearchRideName] = useState("");
  const [searchDateFrom, setSearchDateFrom] = useState("");
  const [searchDateTo, setSearchDateTo] = useState("");
  const [searchMaintenanceId, setSearchMaintenanceId] = useState("");
  const [searchRideId, setSearchRideId] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        let categoryItems = [];
        let data = await api.get("/maintenance/data/all/0");
        console.log("made past request")
        for (let i = 0; i <= this.props.maxValue; i++) {
          categoryItems.push(
            <option key={data[i]} value={data[i]}>
              {data[i]}
            </option>
          );
        }

        setCategories([{key: "Select category", value:''}, ...categoryItems])

        // const response = await api.get(props.apiPath || "/maintenance/data");
        // setMaintenanceData(response.data);
        // setFilteredData(response.data);
      } catch (error) {
        if (error.response) {
          setMessage("Failed to load data: Server error");
        } else if (error.request) {
          setMessage("Failed to connect to server");
        } else {
          console.log(error);
          setMessage("Unknown error");
        }
      }
    }
    fetchData();
  }, [props.apiPath]);

  const handleSearch = () => {
    const filtered = maintenanceData.filter((item) => {
      const matchesMaintenanceId = searchMaintenanceId
        ? item.maintenanceId.toString().includes(searchMaintenanceId)
        : true;
      const matchesRideId = searchRideId
        ? item.rideId.toString().includes(searchRideId)
        : true;
      const matchesRideName = searchRideName
        ? item.rideName.toLowerCase().includes(searchRideName.toLowerCase())
        : true;
      const matchesCategory = searchCategory
        ? item.category === searchCategory
        : true;
      const matchesDateFrom = searchDateFrom
        ? new Date(item.date) >= new Date(searchDateFrom)
        : true;
      const matchesDateTo = searchDateTo
        ? new Date(item.date) <= new Date(searchDateTo)
        : true;

      return (
        matchesMaintenanceId &&
        matchesRideId &&
        matchesRideName &&
        matchesCategory &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
    setFilteredData(filtered);
  };

  const handleEdit = (item) => {
    alert(`Editing record for Maintenance ID: ${item.maintenanceId}`);
  };

  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete Maintenance ID: ${item.maintenanceId}?`
    );
    if (confirmDelete) {
      try {
        await api.delete(`/maintenance/delete/${item.maintenanceId}`);
        setMessage("Record deleted successfully");
        setMaintenanceData(
          maintenanceData.filter(
            (data) => data.maintenanceId !== item.maintenanceId
          )
        );
        setFilteredData(
          filteredData.filter(
            (data) => data.maintenanceId !== item.maintenanceId
          )
        );
      } catch (error) {
        setMessage("Failed to delete record");
      }
    }
  };

  return (
    <div
      className="loginbox"
      style={{
        width: "80%",
        padding: "20px",
        maxWidth: "1000px",
        margin: "0 auto",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
      }}
    >
      <a href="/">
        <img src={MainLogo} alt="Main Logo" />
      </a>
      <div style={{ fontSize: "20px", margin: "-18px 0px 14px 0px" }}>
        {props.title}
      </div>
      <hr style={{ color: "lightgrey", margin: "0px 8px 16px 8px" }} />
      <MessageBox message={message} />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1px",
          marginBottom: "3px",
        }}
      >
        <label style={{ flex: "1 1 100px" }}>
          Maintenance ID:
          <input
            type="text"
            value={searchMaintenanceId}
            onChange={(e) => setSearchMaintenanceId(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          />
        </label>

        <label style={{ flex: "1 1 100px" }}>
          Ride ID:
          <input
            type="text"
            value={searchRideId}
            onChange={(e) => setSearchRideId(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          />
        </label>

        <label style={{ flex: "1 1 100px" }}>
          Ride Name:
          <input
            type="text"
            value={searchRideName}
            onChange={(e) => setSearchRideName(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          />
        </label>

        <label style={{ flex: "1 1 100px" }}>
          Category:
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
              marginTop: "4px",
            }}
          >
            {categories.map((option) => {return (<option key={option.value} value={option.value}>{option.key}</option>)})}
          </select>
        </label>
      </div>
      <div>
        <label style={{ flex: "1 1 100px" }}>
          From:
          <input
            type="date"
            value={searchDateFrom}
            onChange={(e) => setSearchDateFrom(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
              marginTop: "4px",
            }}
          />
        </label>

        <label style={{ flex: "1 1 100px" }}>
          To:
          <input
            type="date"
            value={searchDateTo}
            onChange={(e) => setSearchDateTo(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
              marginTop: "4px",
            }}
          />
        </label>
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          className="btn btn-primary"
          onClick={handleSearch}
          style={{ padding: "10px 30px" }}
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
            <th>Category</th>
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
                <td>{item.category}</td>
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
              <td colSpan="8" style={{ textAlign: "center" }}>
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

async function createCategoryItems() {}

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
