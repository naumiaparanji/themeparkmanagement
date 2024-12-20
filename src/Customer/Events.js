import React, {useEffect, useState} from 'react';
import {api} from '../App';
import CustomerAccount from './CustomerAccount';
import {useNavigate} from 'react-router-dom';
import Navbar from './Navbar';
import './Events.css';

function displayEventDate(startDate, duration) {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000);
    const options = {
        timeZone: "America/Chicago",
        hour: "numeric",
        minute: "numeric"
    };
    const formatter = new Intl.DateTimeFormat([], options);
    const fromTime = formatter.format(startDateTime).toLowerCase().replace(/\s+/g, '');
    const toTime = formatter.format(endDateTime).toLowerCase().replace(/\s+/g, '');
    return `${fromTime} - ${toTime} CST`;
}

const Events = () => {
    const navigate = useNavigate();
    const [eventsData, setEventsData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [userTickets, setUserTickets] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Fetch events data
        api.get("/events")
            .then((response) => {
                setEventsData(response.data.events);
                setCategories([...new Set(response.data.events.map(events => events.EventType))]);
            })
            .catch((e) => console.error(e));

        // Check login status and fetch user tickets
        api.get("/customer/info", {withCredentials: true})
            .then((res) => {
                if (res.data.success) {
                    setIsLoggedIn(true);
                    api.get("/customer/tickets")
                        .then((response) => setUserTickets(response?.data?.tickets.map(ticket => ticket.EventID) || []))
                        .catch((e) => console.log(e));
                }
            })
            .catch(() => setIsLoggedIn(false)); // Handle not logged in
    }, []);

    const handleRegister = (eventId) => {
        api.post("/customer/registerEvent", {eventId})
            .then((res) => {
                alert("Successfully registered for the event!");
                setUserTickets((prevTickets) => [...prevTickets, eventId]); // Update local tickets state
            })
            .catch((e) => {
                if (e.response?.data?.error !== "SQLError") {
                    alert(e.response.data.error);
                } else {
                    console.error("Error registering for event:", e);
                }
            });
    };

    const handleUnregister = (eventId) => {
        api.post("/customer/unregisterEvent", {eventId})
            .then((res) => {
                if (res.data.success) {
                    alert("Successfully unregistered from the event!");
                    setUserTickets((prevTickets) => prevTickets.filter(id => id !== eventId)); // Update local tickets state
                } else {
                    alert("Unregister failed. Please try again.");
                }
            })
            .catch((e) => {
                const errorMsg = e.response?.data?.error || "An unexpected error occurred.";
                alert(errorMsg);
                console.error("Error unregistering from event:", e);
            });
    };


    return (
        <div>
            <div className="notificationbar">
                <h1 className="notificationtext">**WINTER SEASON PASSES AVAILABLE! LOGIN OR CREATE AN ACCOUNT FOR MORE
                    INFORMATION.</h1>
                <section className="loginbutton">
                    <a href="/login" id="logintext">
                        <CustomerAccount text="Log In"/>
                    </a>
                </section>
            </div>
            <Navbar/>
            <div className="events-container">
                <button className="back-button" onClick={() => navigate('/')}>
                    Back to Home
                </button>
                <br/><br/>
                <div className="banner-image3">
                    <p className="h4">Events And Promotions</p>
                </div>
                <br/>
                <block id="topquote_one"><p><b>Check out our Daily Attractions and Promotions!</b></p></block>
                {categories.map(category => (
                    <div className="events-category" key={category}>
                        <h2>{category}</h2>
                        <div className="events-list">
                            {eventsData.filter(events => events.EventType === category).map(events => (
                                <div className="events-card" key={events.EventID}>
                                    <h3>{events.EventName}</h3>
                                    <p><strong><u>Description:</u></strong> {events.EventDesc}</p>
                                    <p><strong>Location:</strong> {events.Location}</p>
                                    <p>
                                        <strong>Time:</strong> {displayEventDate(events.EventDateTime, events.EventDuration)}
                                    </p>
                                    <p><strong>Age Limit:</strong> {events.EventAgeLimit}+</p>
                                    <p><strong>Restrictions:</strong> {events.EventRestrictions}</p>
                                    {isLoggedIn ? (
                                        userTickets.includes(events.EventID) ? (
                                            <>
                                                <p>Already Registered</p>
                                                <button onClick={() => handleUnregister(events.EventID)}>Unregister
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => handleRegister(events.EventID)}>Register for
                                                Event</button>
                                        )
                                    ) : (
                                        <p>Please log in to register</p>
                                    )}

                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;
