import React, { useState, useContext, useCallback, useEffect } from 'react';
import { ApiContext, ApiContextProvider } from './ApiContext';
import './CustomerAccount';
import CustomerAccount from './CustomerAccount';
import Navbar from './Navbar';
import { api } from './App';
import './ProfilePage.css'

const ProfileDisplay = () => {
    const { data } = useContext(ApiContext);
    const [tickets, setTickets] = useState([]);
    const [passes, setPasses] = useState([]);

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
    }, [refreshTickets]);

    useEffect(() => {
        refreshPasses();
    }, [refreshPasses]);

    return (
        <div classname="profilepage">
            <div className="ppnotificationbar">
                <h1 className="notificationtext">
                    **WINTER SEASON PASSES AVAILABLE! LOGIN OR CREATE AN ACCOUNT FOR MORE INFORMATION.
                </h1>
                <section className="loginbutton">
                    <a href="login" id="logintext">
                        <CustomerAccount text="Log In" />
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
                
                <div className="profile-tickets">
                    <h3>Passes</h3>
                    {passes.length > 0 ? (
                        <ul>
                            {passes.map((pass, i) => (
                                <li key={i}>
                                    <strong>Pass Status: {pass.TicketID}</strong>
                                    <div>Pass ID: {pass.PassID}</div>
                                    <div>Purchased: {new Date(pass.Bought).toLocaleDateString()}</div>
                                    <div>Expires: {new Date(pass.ExpirationDate).toLocaleDateString()}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No Passes available.</p>
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
            <ProfileDisplay />
        </ApiContextProvider>
    );
};

export default ProfilePage;
