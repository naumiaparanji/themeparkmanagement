import React from 'react';
import { api } from './App';

export default function EventRegistration({ eventId, customerId }) {
    const handleClick = () => {
        api.post("/events/register", {eventId, customerId})
        .then((res) => {
            alert(res.data.message);
        })
        .catch((e) => {
            if (e.response && e.response.status) alert(e.response.data.message); 
            console.log(e);
        });
    }

    return (
        <button onClick={() => handleClick(eventId, customerId)}>
            Register for Event
        </button>
    );
}
