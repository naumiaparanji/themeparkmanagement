import "./Maintenance/Maintenance.css";
import React, {useEffect, useState} from "react";
import MainLogo from "../images/flagslogo.png";
import {FancyButton, InputField, MessageBox, RandomBGImg,} from "../Auth/AuthComponents";
import {api} from "../App";

export function RunsInfoBox(props) {
    const [rideName, setRideName] = useState("");
    const [numRiders, setNumRiders] = useState("");
    const [message, setMessage] = useState("");
    const [rideOptions, setRideOptions] = useState([]);

    useEffect(() => {
        api.get("/rides/available")
            .then((res) => setRideOptions(res.data.rideNames))
            .catch((e) => {
                if (e.response) {
                    if (e.response.status === 500)
                        setMessage("Database error");
                    else if (e.response.status === 501)
                        setMessage("No functioning rides available");
                    else
                        setMessage(`Unexpected error. Code: ${e.response.status}`);
                } else if (e.request) {
                    setMessage("Failed to connect to server");
                }
            });
    }, []);
    

    //trigger 
    const runsSubmit = async () => {
        if (!rideName || !numRiders) {
            setMessage("All fields are required");
            return;
        }

        api.post(props.apiPath || "/runs/input", {
            rideName,
            numRiders,
        })
            .then(() => {
                setMessage("Run submitted successfully");
                setRideName("");
                setNumRiders("");
            })
            .catch((e) => {
                if (e.response) {
                    if (e.response.status === 400 && e.response.data.error === "RideUnderMaintenance") {
                        setMessage(e.response.data.message); // Custom trigger message
                    } else if (e.response.status === 500) {
                        setMessage("Database error");
                    } else if (e.response.status === 501) {
                        setMessage("Ride name does not exist in database");
                    } else if (e.response.status === 502) {
                        setMessage("Number of riders exceeds specified ride's capacity of " + e.response.data.capacity);
                    } else if (e.response.status === 503) {
                        setMessage("Number of riders must be a non-negative whole number (e.g., 0, 1, 2)");
                    } else {
                        setMessage("Submission failed. Error Code: " + e.response.status);
                    }
                } else if (e.request) {
                    setMessage("Failed to connect to server");
                }
            });
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
            <a href="/public">
                <img src={MainLogo} alt="Main Logo"/>
            </a>
            <div style={{fontSize: "20px", margin: "-18px 0px 14px 0px"}}>
                {props.title}
            </div>
            <hr style={{color: "lightgrey", margin: "0px 8px 16px 8px"}}/>
            <MessageBox message={message}/>

            <div style={{margin: "12px 12px"}}>
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
                name="Number of Riders"
                type="number"
                containerStyle={{margin: "12px 12px"}}
                value={numRiders}
                onChange={(e) => setNumRiders(e.target.value)}
            />

            <FancyButton text="Submit" action={runsSubmit}/>
        </div>
    );
}

export default function Runs(props) {
    return (
        <div className="container">
            <RandomBGImg/>
            <RunsInfoBox
                title={props.title || "Ride Operator Portal"}
                apiPath={props.apiPath || "/runs/input"}
            />
        </div>
    );
}
