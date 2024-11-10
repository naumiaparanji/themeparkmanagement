import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './App'; // Import the api instance from App.js

const ProfilePage = () => {
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by verifying if the auth token exists
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login'); // Redirect to login if no auth token
      return;
    }
  
    // Fetch customer profile data using Axios
    api.get('/customer/info', {
      headers: {
        'Authorization': `Bearer ${authToken}`, // Send the token in the header
      },
    })
      .then((response) => {
        console.log('API Response:', response); // Log the full response to debug
  
        if (response.data.success) {
          setCustomerData(response.data.user); // Assuming 'data.user' contains the profile info
        } else {
          setError('Failed to fetch user data');
        }
      })
      .catch((err) => {
        console.error('Error fetching profile data:', err);
        setError(`Error fetching data: ${err.message}`);
      });
  }, [navigate]);
  

  // Default data structure if no customer data is available
  const profileData = customerData || {
    name: 'Guest',
    email: 'No email provided',
    tickets: [], // Ensure tickets is always an array
  };

  // Ensure tickets is an array before using length
  const tickets = Array.isArray(profileData.tickets) ? profileData.tickets : [];

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      {error ? (
        <p>{error}</p> // Display error message if there was an issue
      ) : (
        <div>
          <div className="profile-info">
            <h3>{profileData.name}</h3>
            <p>Email: {profileData.email}</p>
          </div>

          <div className="profile-tickets">
            <h2 className="profheading">Your Tickets/Events</h2>
            {tickets.length > 0 ? (
              <ul>
                {tickets.map((ticket, index) => (
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
      )}
    </div>
  );
};

export default ProfilePage;
