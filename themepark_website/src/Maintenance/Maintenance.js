import "../Auth/Auth.css";
import React, { useState } from "react";
import MainLogo from "../images/flagslogo.png";
import {
  RandomBGImg,
  MessageBox,
  InputField,
  FancyButton,
  defaultButtonStyle,
} from "../Auth/AuthComponents";
import { apiPost } from "../CRUDApi";

export function MaintenanceInfoBox(props) {
  const [rideName, setRideName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  // Change when Rides table is setup
  const rideOptions = [
    "Adventure River",
    "Alien Invasion",
    "Bumper Cars",
    "Dino Safari",
    "Dragon Coaster",
    "Dragon Roller Coaster",
    "Flight Simulator",
    "Haunted Mansion",
    "Kiddie Carousel",
    "Kiddie Coaster",
    "Lazy River",
    "Mini Bumper Cars",
    "Pirate's Adventure",
    "Race Car Challenge",
    "River Rapids",
    "Rock Climbing Wall",
    "Scenic Train Ride",
    "Sky Dive",
    "Sky Drop",
    "Splash Water Ride",
    "Super Splash",
    "Thunder Mountain",
    "Tiny Teacups",
    "Tornado Twister",
    "Virtual Space Mission",
    "Wave Pool",
    "Zipline Adventure",
  ];

  const maintenanceSubmit = async () => {
    if (!rideName || !date || !description || !status) {
      setMessage("All fields are required");
      return;
    }

    const response = await apiPost(props.apiPath || "/maintenance/input", {
      rideName: rideName,
      date: date,
      description: description,
      status: status,
    }).catch((error) => console.log(error));

    if (!response) {
      setMessage("Failed to connect to server");
    } else if (response.code === 500) {
      setMessage("Server error");
    } else if (!response.body) {
      setMessage("Unknown error");
    } else if (!response.body.success) {
      setMessage("Submission failed");
    } else {
      setMessage("Maintenance info submitted successfully");
    }
  };

  return (
    <div className="loginbox">
      <a href="/">
        <img src={MainLogo} alt="Main Logo" />
      </a>
      <div
        style={{
          fontSize: "20px",
          margin: "-18px 0px 14px 0px",
        }}
      >
        {props.title}
      </div>
      <hr
        style={{
          color: "lightgrey",
          margin: "0px 8px 16px 8px",
        }}
      />
      <MessageBox message={message} />

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
        name="Date"
        type="date"
        containerStyle={{ margin: "12px 12px" }}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <InputField
        name="Description"
        containerStyle={{ margin: "12px 12px" }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div style={{ margin: "12px 12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginTop: "8px",
          }}
        >
          <label>Status</label>
          <label>
            <input
              type="radio"
              value="Operational"
              checked={status === "Operational"}
              onChange={(e) => setStatus(e.target.value)}
              style={{ marginRight: "8px" }}
            />
            Operational
          </label>
          <label>
            <input
              type="radio"
              value="Out of Order"
              checked={status === "Out of Order"}
              onChange={(e) => setStatus(e.target.value)}
              style={{ marginRight: "8px" }} 
            />
            Out of Order
          </label>
        </div>
      </div>

      <FancyButton text="Submit" action={maintenanceSubmit} />
    </div>
  );
}

export function MaintenanceInfo(props) {
  return (
    <div className="container">
      <RandomBGImg />
      <MaintenanceInfoBox
        title={props.title || "Maintenance Info Submission"}
        apiPath={props.apiPath || "/maintenance/input"}
      />
    </div>
  );
}
