import React, { useState, useEffect } from 'react';
import { api } from './App'; // Assuming `api` is your Axios instance

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileResponse = await api.get('/api/customer/info');
                setProfile(profileResponse.data.user);

                const ticketsResponse = await api.get('/api/customer/tickets');
                setTickets(ticketsResponse.data.tickets);
            } catch (err) {
                setError('Failed to fetch data');
                console.error(err);
            }
        };

        fetchProfile();
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
                            Event ID: {ticket.EventID}, Bought: {ticket.Bought}, Expires: {ticket.ExpirationDate}
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
