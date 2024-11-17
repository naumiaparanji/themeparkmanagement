import React from 'react';
import {useNavigate} from 'react-router-dom';
import './CustomerAccount'
import CustomerAccount from './CustomerAccount';
import Navbar from './Navbar';
import './Rides.css';

const ridesData = [
    // Existing rides
    {
        id: 1,
        name: 'Thunder Mountain',
        category: 'Land',
        ageLimit: 8,
        heightLimit: '42 inches',
        restrictions: 'No heart conditions'
    },
    {
        id: 2,
        name: 'Splash Water Ride',
        category: 'Water',
        ageLimit: 6,
        heightLimit: '36 inches',
        restrictions: 'Must wear life jacket'
    },
    {
        id: 3,
        name: 'Adventure River',
        category: 'Water',
        ageLimit: 5,
        heightLimit: '40 inches',
        restrictions: 'Supervision required'
    },
    {
        id: 4,
        name: 'Dragon Roller Coaster',
        category: 'Land',
        ageLimit: 10,
        heightLimit: '48 inches',
        restrictions: 'Pregnant women not allowed'
    },
    {
        id: 5,
        name: 'Sky Dive',
        category: 'Thrill',
        ageLimit: 12,
        heightLimit: '54 inches',
        restrictions: 'No back problems'
    },
    {
        id: 6,
        name: 'Wave Pool',
        category: 'Water',
        ageLimit: 4,
        heightLimit: '30 inches',
        restrictions: 'Must be with an adult'
    },
    {
        id: 7,
        name: 'Zipline Adventure',
        category: 'Thrill',
        ageLimit: 8,
        heightLimit: '42 inches',
        restrictions: 'Max weight 250 lbs'
    },
    {
        id: 8,
        name: 'Kiddie Carousel',
        category: 'Land',
        ageLimit: 2,
        heightLimit: 'None',
        restrictions: 'Adult supervision required'
    },
    {
        id: 9,
        name: 'Lazy River',
        category: 'Water',
        ageLimit: 0,
        heightLimit: 'None',
        restrictions: 'Must wear a life jacket for kids'
    },
    {
        id: 10,
        name: 'Bumper Cars',
        category: 'Land',
        ageLimit: 4,
        heightLimit: 'None',
        restrictions: 'Must be seated at all times'
    },
    {
        id: 11,
        name: 'Super Splash',
        category: 'Water',
        ageLimit: 8,
        heightLimit: '44 inches',
        restrictions: 'Must be able to swim'
    },
    {
        id: 12,
        name: 'Rock Climbing Wall',
        category: 'Land',
        ageLimit: 10,
        heightLimit: 'None',
        restrictions: 'Waiver required'
    },
    {id: 13, name: 'Scenic Train Ride', category: 'Land', ageLimit: 0, heightLimit: 'None', restrictions: 'None'},
    {
        id: 14,
        name: 'River Rapids',
        category: 'Water',
        ageLimit: 7,
        heightLimit: '42 inches',
        restrictions: 'No pregnant women'
    },
    {
        id: 15,
        name: 'Dragon Coaster',
        category: 'Thrill',
        ageLimit: 12,
        heightLimit: '4ft+',
        restrictions: 'No heart conditions'
    },
    {
        id: 16,
        name: 'Sky Drop',
        category: 'Thrill',
        ageLimit: 14,
        heightLimit: '4.5ft+',
        restrictions: 'No fear of heights'
    },
    {
        id: 17,
        name: 'Tornado Twister',
        category: 'Thrill',
        ageLimit: 12,
        heightLimit: '4ft+',
        restrictions: 'No back problems'
    },
    {id: 18, name: 'Pirate’s Adventure', category: 'Thrill', ageLimit: 8, heightLimit: '3ft+', restrictions: 'None'},
    {id: 19, name: 'Haunted Mansion', category: 'Horror', ageLimit: 8, heightLimit: 'None', restrictions: 'None'},
    {id: 20, name: 'Alien Invasion', category: 'Horror', ageLimit: 12, heightLimit: 'None', restrictions: 'None'},
    {id: 21, name: 'Dino Safari', category: 'Horror', ageLimit: 'All ages', heightLimit: 'None', restrictions: 'None'},
    {
        id: 22,
        name: 'Virtual Space Mission',
        category: 'Horror',
        ageLimit: 12,
        heightLimit: 'None',
        restrictions: 'None'
    },
    {id: 23, name: 'Flight Simulator', category: 'Horror', ageLimit: 10, heightLimit: 'None', restrictions: 'None'},
    {id: 24, name: 'Race Car Challenge', category: 'Horror', ageLimit: 12, heightLimit: 'None', restrictions: 'None'},
    {id: 25, name: 'Mini Bumper Cars', category: 'Kids', ageLimit: '5-10', heightLimit: 'None', restrictions: 'None'},
    {id: 26, name: 'Tiny Teacups', category: 'Kids', ageLimit: '3-8', heightLimit: 'None', restrictions: 'None'},
    {id: 27, name: 'Kiddie Coaster', category: 'Kids', ageLimit: '5-10', heightLimit: '2.5ft+', restrictions: 'None'},
];

const Rides = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const categories = [...new Set(ridesData.map(ride => ride.category))]; // Unique categories

    return (
        <div>
            <div className="notificationbar">
                {/* Edit Notification Text */}
                <h1 className="notificationtext">**WINTER SEASON PASSES AVAILABLE! LOGIN OR CREATE AN ACCOUNT FOR MORE
                    INFORMATION.</h1>
                <section className="loginbutton">
                    <a href="login" id="logintext">
                        <CustomerAccount text="Log In"/> {/* Looks ugly but works */}
                    </a>
                </section>
            </div>
            <Navbar/>
            <div className="rides-container">
                <button className="back-button" onClick={() => navigate('/')}>
                    Back to Home
                </button>
                <br></br>
                {categories.map(category => (
                    <div className="ride-category" key={category}>
                        <p className="h4">
                            {category} Rides
                        </p>
                        <div className="ride-list">
                            {ridesData.filter(ride => ride.category === category).map(ride => (
                                <div className="ride-card" key={ride.id}>
                                    <h3>{ride.name}</h3>
                                    <p><strong>Age Limit:</strong> {ride.ageLimit}+</p>
                                    <p><strong>Height Requirement:</strong> {ride.heightLimit}</p>
                                    <p><strong>Restrictions:</strong> {ride.restrictions}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rides;