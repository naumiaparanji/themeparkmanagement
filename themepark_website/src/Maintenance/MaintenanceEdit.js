import styles from "./Maintenance.css";
import React, { useState, useEffect } from "react";
import MainLogo from "../images/flagslogo.png";
import { RandomBGImg, MessageBox, FancyButton } from "../Auth/AuthComponents";
import { api } from "../App";
import MaintenanceModal, { MaintenanceEditBox } from "./MaintenanceTicketEdit";
import { MaintenanceInfoBox } from "./Maintenance";

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
  const [rideNames, setRideNames] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        let maintenanceData = await api
          .get("/maintenance/data/searchReturn")
          .then((maintenanceData) => {
            let maintenanceTicketItems = [];
            let maintenanceArray = maintenanceData["data"]["data"];
            console.log(maintenanceArray);

            for (let i = 0; i < maintenanceArray.length; i++) {
              let ticket = {
                maintenanceId: maintenanceArray[i].MaintenanceID,
                rideId: maintenanceArray[i].RideID,
                rideName: maintenanceArray[i].RideName,
                category: maintenanceArray[i].Category,
                date: maintenanceArray[i].Date,
                description: maintenanceArray[i].Description,
                status: maintenanceArray[i].Status,
              };
              maintenanceTicketItems.push(ticket);
            }
            setMaintenanceData(maintenanceTicketItems);

            setFilteredData(maintenanceTicketItems);
          });

        let rideNameItems = [];
        let nameData = await api
          .get("/maintenance/data/allRideNames")
          .then((nameData) => {
            console.log(nameData["data"]["data"].length);
            let nameArrayData = nameData["data"]["data"];
            console.log(nameArrayData);
            for (let i = 0; i < nameArrayData.length; i++) {
              rideNameItems.push(
                <option
                  key={nameArrayData[i].RideName}
                  value={nameArrayData[i].RideName}
                >
                  {nameArrayData[i].RideName}
                </option>
              );
            }
            setRideNames([
              { key: "Select Ride Name", value: "Select Ride Name" },
              ...rideNameItems,
            ]);
          });

        let categoryItems = [];
        let categoryData = await api
          .get("/maintenance/data/allCategories")
          .then((categoryData) => {
            let categoryArrayData = categoryData["data"]["data"];
            for (let i = 0; i < categoryArrayData.length; i++) {
              categoryItems.push(
                <option
                  key={categoryArrayData[i].Category}
                  value={categoryArrayData[i].Category}
                >
                  {categoryArrayData[i].Category}
                </option>
              );
            }
            setCategories([
              { key: "Select Category", value: "Select Category" },
              ...categoryItems,
            ]);
          });
      } catch (error) {
        console.log(error);
        if (error.response) {
          setMessage("Failed to load data: Server error");
        } else if (error.request) {
          console.log(error.request);
          setMessage("Failed to connect to server");
        } else {
          console.log(error);
          setMessage("Unknown error");
        }
      }
    }
    fetchData();
  }, [props.apiPath]);

  useEffect(() => {
    handleSearch();
  }, [
    searchMaintenanceId,
    searchRideName,
    searchCategory,
    searchDateFrom,
    searchDateTo,
  ]);

  const handleSearch = () => {
    const filtered = maintenanceData.filter((item) => {
      const matchesMaintenanceId =
        searchMaintenanceId === "" ||
        item.maintenanceId.toString().includes(searchMaintenanceId);
      const matchesRideId =
        searchRideId === "" || item.rideId.toString() === searchRideId;

      let fixedSearchRideName =
        searchRideName === "Select Ride Name" ? "" : searchRideName;
      const matchesRideName =
        fixedSearchRideName === "" || item.rideName === fixedSearchRideName;

      let fixedSearchCategory =
        searchCategory === "Select Category" ? "" : searchCategory;
      const matchesCategory =
        fixedSearchCategory === "" || item.category === fixedSearchCategory;
      const matchesDateFrom =
        searchDateFrom === "" ||
        new Date(item.date) >= new Date(searchDateFrom);
      const matchesDateTo =
        searchDateTo === "" || new Date(item.date) <= new Date(searchDateTo);

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

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const handleEdit = (item) => {
    // alert(`Editing record for Maintenance ID: ${item.maintenanceId}`);
    setOpen(true);
    setSelectedItem(item);
  };

  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete Maintenance ID: ${item.maintenanceId}?`
    );
    if (confirmDelete) {
      try {
        await api.delete(`/maintenance/data/delete/${item.maintenanceId}`);
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
        width: "100%",
        height: "70%",
        padding: "20px",
        maxWidth: "1000px",
        margin: "0 auto",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
        overflowY: "auto",
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
        {!props.isReport ? (
          <>
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
          </>
        ) : null}

        <label style={{ flex: "1 1 100px" }}>
          Ride Name:
          <select
            value={searchRideName}
            onChange={(e) => setSearchRideName(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
              marginTop: "4px",
            }}
          >
            {rideNames.map((option) => {
              return (
                <option key={option.value} value={option.value}>
                  {option.key}
                </option>
              );
            })}
          </select>
        </label>

        {props.isReport ? (
          <>
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
                {categories.map((option) => {
                  return (
                    <option key={option.value} value={option.value}>
                      {option.key}
                    </option>
                  );
                })}
              </select>
            </label>
          </>
        ) : null}
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

      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th style={{ width: "12%" }}>Maintenance ID</th>
              <th style={{ width: "15%" }}>Ride Name</th>
              <th style={{ width: "10%" }}>Category</th>
              <th style={{ width: "17%" }}>Date</th>
              <th style={{ width: "17%" }}>Ride Status</th>
              {!props.isReport ? (
                <>
                  <th
                    style={{
                      width: "18%",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    Description
                  </th>
                  <th style={{ width: "8%" }}>Modify</th>
                  <th style={{ width: "10%" }}>Delete</th>
                </>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.maintenanceId}</td>
                  <td>{item.rideName}</td>
                  <td>{item.category}</td>
                  <td>{new Date(item.date).toLocaleString()}</td>
                  <td>{item.status === 1 ? "Operational" : "Out of Order"}</td>
                  {!props.isReport ? (
                    <>
                      <td>{item.description}</td>
                      <td>
                        <div>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>
                          {open && selectedItem && (
                            <MaintenanceModal
                              isOpen={open}
                              onClose={handleClose}
                            >
                              <MaintenanceEditBox
                                maintenanceData={selectedItem}
                              />
                            </MaintenanceModal>
                          )}
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(item)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  ) : null}
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
      </div>

      {!props.isReport ? (
        <>
          <FancyButton text="Refresh" action={() => window.location.reload()} />
        </>
      ) : null}
    </div>
  );
}

export function MaintenanceData(props) {
  return (
    <div className="container">
      <RandomBGImg />
      <MaintenanceDataBox
        title={props.title || "Maintenance Update"}
        apiPath={props.apiPath || "/maintenance/data"}
      />
    </div>
  );
}
