import React, { useState, useContext, useCallback, useEffect } from 'react';
import { ApiContext, ApiContextProvider } from './ApiContext';
import { api } from './App';

const ProfileDisplay = () => {
    const { data } = useContext(ApiContext);
    
    // This is what you'd need to get ticket info in a react component.
    // ----------------------------------------------------------------
    const [ tickets, setTickets ] = useState([]);

    const refreshTickets = useCallback(() => {
        api.get("/customer/tickets")
        .then((response) => {
            setTickets(response.data.tickets);
        })
        .catch((e) => console.log(e));
    }, []);

    useEffect(() => {
        refreshTickets();
    }, []);
    // ----------------------------------------------------------------
    // Copy it anywhere you need ticket info for the current customer session

    return (
        <div>
            <h1>Profile Page</h1>
            {data && (
                <div>
                    <h2>{data.firstName} {data.lastName}</h2>
                    <p>Email: {data.email}</p>
                </div>
            )}
            { /* Remove this part when you figure out what you want to do */ }
            <h2>Event Tickets</h2>
            {tickets && tickets.map((ticket, i) => (
                <div key={i}>
                    {ticket.EventTicketID} {ticket.EventID} {ticket.Bought} {ticket.ExpirationDate}
                </div>
            ))}
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
