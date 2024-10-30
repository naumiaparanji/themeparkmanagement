import React from 'react';

async function registerForEvent(eventId, customerId) {
    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventId, customerId })
        });
        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', data);

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


export default function EventRegistration({ eventId, customerId }) {
    return (
        <button onClick={() => registerForEvent(eventId, customerId)}>
            Register for Event
        </button>
    );
}
