import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [customerData, setCustomerData] = useState(null);

  // Default data structure in case it's empty
  const profileData = customerData || {
    name: 'Guest',
    email: 'No email provided',
    tickets: [],
  };

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      <div className="profile-info">
        <h3>{profileData.name}</h3>
        <p>Email: {profileData.email}</p>
      </div>

      <div className="profile-tickets">
        <h2 classname="profheading">Your Tickets/Events</h2>
        {profileData.tickets.length > 0 ? (
          <ul>
            {profileData.tickets.map((ticket, index) => (
              <li key={index}>
                <div>
                  <strong>{ticket.event}</strong>
                </div>
                <div>
                  Expiry Date: {new Date(ticket.expiry).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no tickets or events.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
