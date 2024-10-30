import React from 'react';

// Function to handle event registration
async function registerForEvent(eventId, customerId) {
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventId, customerId })
        });
        const data = await response.json();
        if (response.ok) {
            alert(data.message);  // "Registration successful!"
        } else {
            alert(data.message);  // "Sorry, slots filled"
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred, please try again later.');
    }
}

// React component for event registration
export default function EventRegistration({ eventId, customerId }) {
    return (
        <button onClick={() => registerForEvent(eventId, customerId)}>
            Register for Event
        </button>
    );
}
