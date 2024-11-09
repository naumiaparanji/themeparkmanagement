// ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate instead of useHistory

const ProfilePage = () => {
  const [customerData, setCustomerData] = useState(null);
  const navigate = useNavigate();  // Access navigate function for redirection

  useEffect(() => {
    // Check if the user is logged in
    if (!localStorage.getItem('authToken')) {
      // Redirect to login page if not authenticated
      navigate('/login');
    }

    // Fetch customer data if authenticated
    fetch('/api/customer/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCustomerData(data))
      .catch((error) => console.error('Error fetching profile data:', error));
  }, [navigate]);

  const handleUpdateProfile = (updatedData) => {
    // Make a PUT request to update customer data
    fetch('/api/customer/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => setCustomerData(data))
      .catch((error) => console.error('Error updating profile data:', error));
  };

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      {customerData ? (
        <div>
          <h3>{customerData.name}</h3>
          <p>Email: {customerData.email}</p>
          <p>Tickets: {customerData.tickets.join(', ')}</p>
          <button onClick={() => handleUpdateProfile({ name: 'New Name' })}>
            Update Profile
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
