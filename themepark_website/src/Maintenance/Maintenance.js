import "./Maintenance.css";
import React, { useEffect, useState } from "react";
import MainLogo from "../images/flagslogo.png";
import {
    RandomBGImg,
    MessageBox,
    InputField,
    FancyButton,
} from "../Auth/AuthComponents";
import { api } from "../App";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

export function MaintenanceInfoBox(props) {
    const [rideName, setRideName] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");
    const [rideOptions, setRideOptions] = useState([]);

    useEffect(() => {
        api.get("/rides/names")
            .then((res) => setRideOptions(res.data.rideNames))
            .catch((e) => {
                if (e.response) {
                    if (e.response.status === 500)
                        setMessage("Database error");
                    else if (e.response.status === 501)
                        setMessage("No rides in database");
                    else if (e.response.data && !e.response.data.success)
                        setMessage("Submission failed. Error Code: " + e.response.status);
                    else
                        setMessage("Unknown error");
                } else if (e.request)
                    setMessage("Failed to connect to server");
            });
    }, []);

    const maintenanceSubmit = async () => {
        if (!rideName || !date || !description || !status) {
            setMessage("All fields are required");
            return;
        }
        api.post(props.apiPath || "/maintenance/input", {
            rideName,
            date,
            description,
            status,
        })
            .then(() => {
                setMessage("Maintenance info submitted successfully");
                setDate("");
                setDescription("");
                setStatus("");
                setRideName("");
            })
            .catch((e) => {
                if (e.response) {
                    if (e.response.status === 500) setMessage("Server error");
                    else if (e.response.status === 503) setMessage("Ride not found in database");
                    else if (e.response.data && !e.response.data.success) setMessage("Submission failed");
                    else setMessage("Unknown error");
                } else if (e.request) setMessage("Failed to connect to server");
            });
    };

    return (
        <div className="loginbox" style={{
            width: "80%",
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
                                checked={status === "Operational"}
                                onChange={(e) => setStatus(e.target.value)}
                                style={{ marginRight: "8px" }}
                            />
                            Operational
                        </label>
                        <label style={{ minWidth: "120px" }}>
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
            </div>

            <FancyButton text="Submit" action={maintenanceSubmit} />
        </div>
    );
}

export function MaintenanceInfo(props) {
    return (
        <div className="container">
            
            <Tabs>
                <TabList>
                    <Tab>Maintenance Request</Tab>
                    <Tab>Maintenance Update</Tab>
                </TabList>

                <TabPanel>
                    <MaintenanceInfoBox
                        title={props.title || "Maintenance Info Submission"}
                        apiPath={props.apiPath || "/maintenance/input"}
                    />
                </TabPanel>
            </Tabs>
        </div>
    );
}
