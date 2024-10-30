import React from 'react';
import CustomerAccount from './CustomerAccount';
import { useNavigate } from 'react-router-dom';
import EventRegistration from './EventRegistration';  // Import the registration component
import Navbar from './Navbar';
import './Events.css';
import './CustomerAccount'

const eventsData = [
    // Existing rides
    {
        id: 1, name: 'Uniqlo Grand Opening Popup',
        category: 'Promotions',
        descript: 'Celebrating the first Uniqlo opening in Houston at Memorial City Mall, Uniqlo is hosting a small Popup! Pass by for special deals, coupons, and to check out their catalog!',
        location: 'Near Front-Gate-2',
        time: '12:00pm - 2:00pm CST',
        ageLimit: 14,
        restrictions: 'Parents and guardians are recommended to watch their children.'
    },
    {
        id: 2, name: 'Database Systems Crash Course Panel',
        category: 'Promotions',
        descript: 'Join us with Professor Uma Ramamurthy to learn about the wonders of SQL and the importance of Databases.',
        location: 'Near (Location Here because I cant come up with one right now.)',
        time: '5:30pm - 7:00pm CST',
        ageLimit: '6',
        restrictions: 'While ages 6+ are encouraged, parents and guardians are recommended to watch their children.'
    },
    {
        id: 3, name: 'Porter Robinson - SMILE! :D',
        category: 'Events',
        descript: 'The Smile! :D. tour is a journey through the past and present eras of Porter Robinson, bringing all the magic of his previous tours with tons of extra added fun.',
        location: 'Stage of the Seventh Flag',
        time: '6:30pm - 8:00pm CST',
        ageLimit: 1,
        restrictions: 'There is a strict 6 ticket limit per show. Additional orders exceeding the ticket limit may be canceled without notice.'
    },
    {
        id: 4, name: 'Marshmello side:TOUR',
        category: 'Events',
        descript: 'Famous DJ artist, Marshemllo is hosting a small concert for Seven Flags! If you love his music as much as us, you would not want to miss this.',
        location: 'Stage of the Seventh Flag',
        time: '9:00pm - 10:30pm CST',
        ageLimit: 18,
        restrictions: 'No participant younger than 18 years of age is allowed to participate. ID checks will be given.'
    },
    {
        id: 5, name: 'Renaissance Festival',
        category: 'Events',
        descript: 'A blast from the past, hosting our very own Renaissance Festival! This event will take up a section of the park and will last a good while.',
        location: 'Entire (Insert Park Section here)',
        time: '10pm - 8pm',
        ageLimit: 3,
        restrictions: 'Ages under 16 are required to have a parent or guardian attending with them at all times.'
    },
    {
        id: 6, name: 'Ian the Goat Showcase',
        category: 'Events',
        descript: 'The Entire Park of Seven Flags will switch advertisement screens and posters to display anything from Ian/Yaannsloot. During the time of this event, it will be complete dedication to celebrating him!',
        location: 'Entire Park',
        time: '12am - 12pm CST',
        ageLimit: 1,
        restrictions: 'No restrictions, just celebration~'
    },
];

const Events = () => {
    const categories = [...new Set(eventsData.map(events => events.category))]; // Unique categories
    const navigate = useNavigate(); // Initialize useNavigate hook

    return (
        <div>
            <div className="notificationbar">
                <h1 className="notificationtext">**WINTER SEASON PASSES AVAILABLE! LOGIN OR CREATE AN ACCOUNT FOR MORE INFORMATION.</h1>
                <section className="loginbutton">
                    <a href="login" id="logintext">
                        <CustomerAccount text="Log In" />
                    </a>
                </section>
            </div>
            <Navbar />
            <button className="back-button" onClick={() => navigate('/')}>
                Back to Home
            </button>
            <br/><br/>
            <div className="events-container">
                <div className="banner-image3">
                    <p className="h4">Events And Promotions</p>
                </div>
                <br/>
                <block id="topquote_one"><p><b>Check out our Daily Attractions and Promotions!</b></p></block>
                {categories.map(category => (
                    <div className="events-category" key={category}>
                        <h2>{category}</h2>
                        <div className="events-list">
                            {eventsData.filter(events => events.category === category).map(events => (
                                <div className="events-card" key={events.id}>
                                    <h3>{events.name}</h3>
                                    <p><strong><u>Description:</u></strong> {events.descript}</p>
                                    <p><strong>Location:</strong> {events.location}</p>
                                    <p><strong>Time:</strong> {events.time}</p>
                                    <p><strong>Age Limit:</strong> {events.ageLimit}+</p>
                                    <p><strong>Restrictions:</strong> {events.restrictions}</p>
                                    
                                    {/* Add the registration button for the event */}
                                    {events.id === 2 && (
                                        <EventRegistration eventId={2} customerId={1} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;