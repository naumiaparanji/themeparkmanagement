import React, {useCallback, useContext, useEffect, useState} from 'react';
import {ApiContext, ApiContextProvider} from '../ApiContext';
import './CustomerAccount';
import CustomerAccount from './CustomerAccount';
import Navbar from './Navbar';
import {api} from '../App';
import './ProfilePage.css'

const ProfileDisplay = () => {
    const { data } = useContext(ApiContext);
    const [tickets, setTickets] = useState([]);
    const [passes, setPasses] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [isNotificationsVisible, setIsNotificationsVisible] = useState(true); // New state for toggling notifications

    const refreshTickets = useCallback(() => {
        api.get("/customer/tickets")
            .then((response) => {
                setTickets(response.data.tickets);
            })
            .catch((e) => console.log(e));
    }, []);

    const refreshPasses = useCallback(() => {
        api.get("/customer/passes")
            .then((response) => {
                setPasses(response.data.passes);
            })
            .catch((e) => console.log(e));
    }, []);

    useEffect(() => {
        refreshTickets();
        refreshPasses();

        // Fetch notifications
        api.get("/customer/info")
            .then((response) => {
                setNotifications(response.data.notifications || []);
            })
            .catch((e) => console.log(e));
    }, [refreshTickets, refreshPasses]);

    return (
        <div className="profilepage">
            <div className="ppnotificationbar">
                <h1 className="notificationtext">
                    **WINTER SEASON PASSES AVAILABLE! LOGIN OR CREATE AN ACCOUNT FOR MORE INFORMATION.
                </h1>
                <section className="loginbutton">
                    <a href="login" id="logintext">
                        <CustomerAccount text="Log In"/>
                    </a>
                </section>
            </div>
            <Navbar />
            <div className="profile-container">
                <h3>Profile Page</h3>

                {data && (
                    <div className="profile-info">
                        <p>{data.firstName} {data.lastName}</p>
                        <p>Email: {data.email}</p>
                    </div>
                )}

                {/* Notifications Section */}
                <div className="profile-notifications">
                    <h3>
                        Notifications
                        <button 
                            className="toggle-button" 
                            onClick={() => setIsNotificationsVisible(!isNotificationsVisible)}
                        >
                            {isNotificationsVisible ? "Hide" : "Show"}
                        </button>
                    </h3>
                    {isNotificationsVisible && (
                        notifications.length > 0 ? (
                            <ul>
                                {notifications.map((note, i) => (
                                    <li key={i}>
                                        <div>{note.Message}</div>
                                        <div className="notification-date">
                                            {new Date(note.CreatedAt).toLocaleString()}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No notifications available.</p>
                        )
                    )}
                </div>

                <div className="profile-tickets">
                    <h3>Event Tickets</h3>
                    {tickets.length > 0 ? (
                        <ul>
                            {tickets.map((ticket, i) => (
                                <li key={i}>
                                    <strong>Ticket ID: {ticket.EventTicketID}</strong>
                                    <div>Event ID: {ticket.EventID}</div>
                                    <div>Purchased: {new Date(ticket.Bought).toLocaleDateString()}</div>
                                    <div>Expires: {new Date(ticket.ExpirationDate).toLocaleDateString()}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No tickets available.</p>
                    )}
                </div>

                <div className="profile-passes">
                    <h3>Passes</h3>
                    {passes.length > 0 ? (
                        <ul>
                            {passes.map((pass, i) => (
                                <li key={i}>
                                    <strong>Pass ID: {pass.PassID}</strong>
                                    <div>Purchased: {new Date(pass.Bought).toLocaleDateString()}</div>
                                    <div>Expires: {new Date(pass.ExpirationDate).toLocaleDateString()}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No passes available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProfilePage = () => {
    const handleInfoFailureRedirect = useCallback(() => {
        window.location.pathname = "/login";
    }, []);

    return (
        <ApiContextProvider
            apiPath="/customer/info"
            apiFailureAction={handleInfoFailureRedirect}
            blockRendering={true}
        >
            <ProfileDisplay/>
        </ApiContextProvider>
    );
};

export default ProfilePage;
