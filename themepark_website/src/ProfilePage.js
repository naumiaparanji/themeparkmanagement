import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios directly if needed
import { api } from './App'; // Assuming `api` is your configured Axios instance

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileAndTickets = async () => {
            try {
                // Fetch customer profile
                const profileResponse = await api.get('/customer/info');
                setProfile(profileResponse.data.user);

                // Fetch customer tickets
               // const ticketsResponse = await api.get('/customer/tickets');
                //setTickets(ticketsResponse.data.tickets);
            } catch (err) {
                setError('Failed to fetch data. Please try again.');
                console.error(err); // Log the full error for debugging
            }
        };

        fetchProfileAndTickets();
    }, []);

    return (
        <div>
            <h1>Profile Page</h1>
            {error && <p>{error}</p>}
            {profile && (
                <div>
                    <h2>{profile.name}</h2>
                    <p>Email: {profile.email}</p>
                </div>
            )}
            <h2>Your Tickets</h2>
            {tickets.length > 0 ? (
                <ul>
                    {tickets.map(ticket => (
                        <li key={ticket.EventTicketID}>
                            Event ID: {ticket.EventID}, Bought: {new Date(ticket.Bought).toLocaleDateString()}, 
                            Expires: {new Date(ticket.ExpirationDate).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tickets available</p>
            )}
        </div>
    );
};

export default ProfilePage;
