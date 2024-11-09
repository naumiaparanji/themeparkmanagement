import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
      return;
    }

    fetch('/api/customer/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched customer data:', data); // Check if you get data here
        if (data && data.name) {
          setCustomerData(data);
        } else {
          setError('No profile data found.');
        }
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error);
        setError('Error fetching profile data.');
      })
      .finally(() => setLoading(false));  // Set loading to false after request
  }, [navigate]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  // Default data structure in case it's empty
  const profileData = customerData || {
    name: 'Guest',
    email: 'No email provided',
    tickets: [],
  };

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      <div className="profile-info">
        <h3>{profileData.name}</h3>
        <p>Email: {profileData.email}</p>
      </div>

      <div className="profile-tickets">
        <h4>Your Tickets/Events</h4>
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
