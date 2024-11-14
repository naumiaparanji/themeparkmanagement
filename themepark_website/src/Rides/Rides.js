import "../Maintenance/Maintenance.css";
import React, { useState } from "react";
import MainLogo from "../images/flagslogo.png";
import {
  RandomBGImg,
  MessageBox,
  InputField,
  FancyButton,
  defaultButtonStyle,
} from "../Auth/AuthComponents";
import { api } from "../App";

export function RidesInfoBox(props) {
  const [rideName, setRideName] = useState("");
  const [category, setCategory] = useState("");
  const [capacity, setCapacity] = useState("");
  const [ageLimit, setAgeLimit] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const ridesSubmit = async () => {
    if (!rideName || !category || !capacity || !ageLimit) {
      setMessage("All fields are required");
      return;
    }
    setIsLoading(true);
    api.post(props.apiPath || "/rides/input", {
      rideName,
      category,
      ageLimit,
      capacity
    })
    .then(() => {
      setMessage("Rides info submitted successfully");
      setRideName("");
      setCategory("");
      setCapacity("");
      setAgeLimit("");
    })
    .catch((e) => {
      if (e.response) {
        if (e.response.status === 500) setMessage("Server error");
        else if (e.response.status === 502) setMessage("Age limit must be a non-negative integer");
        else if (e.response.status === 503) setMessage("Capacity must be an positive integer");
        else if (e.response.data && !e.response.data.success) setMessage("Submission failed");
        else setMessage("Unknown error");
      } else if (e.request) setMessage("Failed to connect to server");
    })
    .finally(() => setIsLoading(false));
  };

  return (
    <div className="loginbox" style={{
      width: "60%", 
      padding: "20px", 
      maxWidth: "800px", 
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

      <InputField
        name="Ride Name"
        containerStyle={{ margin: "12px 12px" }}
        value={rideName}
        onChange={(e) => setRideName(e.target.value)}
      />

      <InputField
        name="Category"
        containerStyle={{ margin: "12px 12px" }}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <InputField
        name="Capacity"
        type="number"
        min="1"
        containerStyle={{ margin: "12px 12px" }}
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
      />

      <InputField
        name="Age Limit"
        type="number"
        min="1"
        containerStyle={{ margin: "12px 12px" }}
        value={ageLimit}
        onChange={(e) => setAgeLimit(e.target.value)}
      />

      <FancyButton text={isLoading ? "Submitting..." : "Submit"} action={ridesSubmit} disabled={isLoading} />
    </div>
  );
}

export function RidesInfo(props) {
  return (
    <div className="container">
      <RandomBGImg />
      <RidesInfoBox
        title={props.title || "Rides Info Submission"}
        apiPath={props.apiPath || "/rides/input"}
      />
    </div>
  );
}
