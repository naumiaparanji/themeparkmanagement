import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./CustomerAccount";
import CustomerAccount from "./CustomerAccount";
import Navbar from "./Navbar";
import "./Rides.css";
import {api} from "../App";

const Rides = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [rides, setRides] = useState([]);
    let categories = [...new Set(rides.map((ride) => ride.Category))]; // Unique categories

    useEffect(() => {
        api.get("/rides")
            .then((res) => {
                setRides(res.data.rides);
                console.log("========== Rides ==========");
                console.log(res);
            })
            .catch((e) => {
                console.log(e);
            })
    }, []);

    return (
        <div>
            <div className="notificationbar">
                {/* Edit Notification Text */}
                <h1 className="notificationtext">
                    **WINTER SEASON PASSES AVAILABLE! LOGIN OR CREATE AN ACCOUNT FOR MORE
                    INFORMATION.
                </h1>
                <section className="loginbutton">
                    <a href="login" id="logintext">
                        <CustomerAccount text="Log In"/> {/* Looks ugly but works */}
                    </a>
                </section>
            </div>
            <Navbar/>
            <div className="rides-container">
                <button className="back-button" onClick={() => navigate("/")}>
                    Back to Home
                </button>
                <br></br>
                {categories.map((category) => (
                    <div className="ride-category" key={category}>
                        <p className="h4">{category} Rides</p>
                        <div className="ride-list">
                            {rides
                                .filter((ride) => ride.Category === category)
                                .map((ride) => (
                                    <div className="ride-card" key={ride.RideID}>
                                        <h3>{ride.RideName}</h3>
                                        <p>
                                            <strong>Age Limit:</strong> {ride.RideAgeLimit}+
                                        </p>
                                        <p>
                                            <strong>Capacity:</strong> {ride.Capacity}
                                        </p>
                                        <p>
                                            <strong>Serving park visitors
                                                since:</strong> {new Date(ride.Created).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rides;
