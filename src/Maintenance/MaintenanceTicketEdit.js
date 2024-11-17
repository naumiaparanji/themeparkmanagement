import "./Maintenance.css";
import React, { useState, useEffect } from "react";
import MainLogo from "../images/flagslogo.png";
import {
  RandomBGImg,
  MessageBox,
  InputField,
  FancyButton,
} from "../Auth/AuthComponents";
import { api } from "../App";

export const MaintenanceModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          margin: "auto",
          padding: "2%",
          border: "2px solid #000",
          borderRadius: "10px",
          boxShadow: "2px solid black",
          maxHeight: "calc(100vh - 40px)",
          width: "90%",
          maxWidth: "600px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MaintenanceModal;

export function MaintenanceEditBox(props) {
  const [rideName, setRideName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [rideOptions, setRideOptions] = useState([]);
  const [resolveTicket, setResolveTicket] = useState(false);

  useEffect(() => {
    if (props.maintenanceData) {
      setRideName(props.maintenanceData.rideName, "");
      setDate(formatDate(props.maintenanceData.date) || "");
      setDescription(props.maintenanceData.description, "");
      setStatus(props.maintenanceData.status, "");
      setResolveTicket(props.maintenanceData.resolveTicket, "");
    }
  }, [props.maintenanceData]);

  useEffect(() => {
    api
      .get("/rides/names")
      .then((res) => setRideOptions(res.data.rideNames))
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 500) setMessage("Database error");
          else if (e.response.status === 501)
            setMessage("No rides in database");
          else if (e.response.data && !e.response.data.success)
            setMessage("Submission failed. Error Code: " + e.response.status);
          else setMessage("Unknown error");
        } else if (e.request) setMessage("Failed to connect to server");
      });
  }, []);

  useEffect(() => {}, [message]);

  function formatDate(inputDate) {
    if (!inputDate) return "";
    const dateObj = new Date(inputDate);
    if (isNaN(dateObj.getTime())) {
      return "";
    }
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${year}-${month}-${day}`;
  }

  const maintenanceEdit = async () => {
    if (
      !rideName ||
      !date ||
      !description ||
      status === undefined ||
      status === null
    ) {
      setMessage("All fields are required");
      return;
    }
    try {
      setMessage(
        "Maintenance ticket updated successfully.\n Click grey area to close the update form"
      );

      let test = await api.put(
        props.apiPath ||
          `/maintenance/edit/${props.maintenanceData.maintenanceId}`,
        {
          fields: {
            maintenanceID: props.maintenanceData.maintenanceId,
            rideName: rideName,
            date: date,
            description: description,
            status: status === "Operational" ? 1 : 0,
            resolveTicket: resolveTicket,
          },
        }
      );
    } catch (e) {
      if (e.response) {
        if (e.response.status === 500) setMessage("Server error");
        else if (e.response.status === 503)
          setMessage("Ride not found in database");
        else if (e.response.data && !e.response.data.success)
          setMessage("Submission failed");
        else setMessage("Unknown error");
      } else if (e.request) setMessage("Failed to connect to server");
    }
  };

  return (
    <div
      className="loginbox"
      style={{
        width: "100%",
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
      }}
    >
      <a>
        <img src={MainLogo} alt="Main Logo" />
      </a>
      <div style={{ fontSize: "20px", margin: "-18px 0px 14px 0px" }}>
        {props.title}
      </div>
      <hr style={{ color: "lightgrey", margin: "0px 8px 16px 8px" }} />
      <div style={{ whiteSpace: "pre-line" }}>
        <MessageBox message={message} />
      </div>

      <div style={{ margin: "12px 12px" }}>
        <select
          value={rideName}
          onChange={(e) => setRideName(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            margin: "8px 0",
            borderRadius: "4px",
          }}
        >
          <option value="">-- Select Ride --</option>
          {rideOptions.map((ride) => (
            <option key={ride} value={ride}>
              {ride}
            </option>
          ))}
        </select>
      </div>

      <InputField
        name={props.maintenanceData.date}
        type="date"
        containerStyle={{ margin: "12px 12px" }}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <InputField
        name={props.maintenanceData.description}
        containerStyle={{ margin: "12px 12px" }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div style={{ margin: "12px 12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "8px",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <label style={{ minWidth: "80px" }}>Status:</label>
          <div style={{ display: "flex", gap: "20px", flex: 1 }}>
            <label style={{ minWidth: "120px" }}>
              <input
                type="radio"
                value="Operational"
                checked={
                  status === 1 || status === "Operational" ? true : false
                }
                onChange={(e) => setStatus(e.target.value)}
                style={{ marginRight: "8px" }}
              />
              Operational
            </label>
            <label style={{ minWidth: "120px" }}>
              <input
                type="radio"
                value="Out of Order"
                checked={
                  status === 0 || status === "Out of Order" ? true : false
                }
                onChange={(e) => setStatus(e.target.value)}
                style={{ marginRight: "8px" }}
              />
              Out of Order
            </label>
          </div>
        </div>
      </div>

      <div style={{ margin: "12px 12px" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            minWidth: "150px",
          }}
        >
          <input
            type="checkbox"
            checked={resolveTicket === 1 || resolveTicket ? true : false}
            onChange={(e) => setResolveTicket(e.target.checked)}
            style={{ marginRight: "8px" }}
          />
          Resolve Ticket
        </label>
      </div>

      <FancyButton text="Submit" action={maintenanceEdit} />
    </div>
  );
}

// export function MaintenanceEdit(props) {
//   return (
//     <div className="container">
//       <RandomBGImg />
//       <MaintenanceEditBox
//         title={props.title || "Maintenance Info Submission"} //Edit to display maintenanceID
//         apiPath={props.apiPath || "/maintenance/edit"}
//       />
//     </div>
//   );
// }
