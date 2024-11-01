import React, { useEffect, useState } from 'react';
import { api } from './App';
import CustomerAccount from './CustomerAccount';
import { useNavigate } from 'react-router-dom';
import EventRegistration from './EventRegistration';  // Import the registration component
import Navbar from './Navbar';
import './Events.css';
import './CustomerAccount'

const Events = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [eventsData, setEventsData] = useState([]);
    const [categories, setCategories] = useState([]);

    // Check eventsRoutes.js and db.js in the server to see what this is retrieving.
    // If any of this is too confusing just lmk and I'll take care of app <-> db connections.
    // Frontend rendering, triggers, etc are more important.
    // - Ian
    useEffect(() => {
        api.get("/events")
        .then((response) => {
            setEventsData(response.data.events);
            setCategories([...new Set(response.data.events.map(events => events.EventType))]);
        })
        .catch((e) => {
            console.error(e);
        });
    }, []);

    return (
        <div>
            <div className="notificationbar">
                <h1 className="notificationtext">**WINTER SEASON PASSES AVAILABLE! LOGIN OR CREATE AN ACCOUNT FOR MORE INFORMATION.</h1>
                <section className="loginbutton">
                    <a href="login" id="logintext">
                        <CustomerAccount text="Log In" />
                    </a>
                </section>
            </div>
            <Navbar />
            <button className="back-button" onClick={() => navigate('/')}>
                Back to Home
            </button>
            <br/><br/>
            <div className="events-container">
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
                                    <p><strong>Time:</strong> {events.EventDateTime}</p>
                                    <p><strong>Age Limit:</strong> {events.EventAgeLimit}+</p>
                                    <p><strong>Restrictions:</strong> {events.EventRestrictions}</p>
                                    
                                    {/* Add the registration button for the event */}
                                    {/* Please move this to the customer portal or remove it. <3 Ian */}
                                    {events.EventID === 14 && (
                                        <EventRegistration eventId={14} customerId={1} />
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