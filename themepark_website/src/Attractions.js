import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerAccount from './CustomerAccount';
import Navbar from './Navbar';
import './Attractions.css';
import './CustomerAccount'

const attractionsData = [
    // Current Attractions
    { id: 1, name: '7/11 Burgers', 
            category: 'Restaurants', 
            descript: 'Craving a Beefy meal? Grab a Burger at 7/11 Burgers where that is all they think about! Other menu options are also available.',
                // Description of the Restaurant
            location: 'Near Wandering Lands',
                // Location of the Restaurant
            price_range: '$5 - $25' },
                // Price Range because I hate suprise-expensive-things
    { id: 2, name: 'Stomach of Kraken', 
            category: 'Restaurants', 
            descript: 'Wandering for some sea critters? The Kraken ate them all! Enjoy your favorite seafood selections in the belly of a Kraken (themed restaurant).',
            location: 'Near the Seven Seas', 
            price_range: '$5 - $30' },
    { id: 3, name: 'Station Up!', 
            category: 'Gift Shops', 
            descript: 'Visit the Official Gift shop of Seven Flags! Buy memories to take along, and maybe even a gift for that certain someone. All products are Quality-Verified by yours truly!',
            location: 'Near Front-Gate-1',
            price_range: '$1 - $200' },
    {
        id: 4, name: 'Treasure Trove of Captain Hawk', 
                // I have horrible naming sense btw.
            category: 'Gift Shops',
            descript: 'Purchase official treasure found by none other than Captain Hawk! All of these are inspected by our personal Treasure Inspectors to be 100% authentic.',
            location: 'Near the Seven Seas',
                // Just calling that the area where Water Rides are
            price_range: '$3 - $200' },
    { id: 5, name: 'Dippin Dots', 
            category: 'Concession Stands', 
            descript: 'Nothing beats a classic, chilling treat like Dippin Dots! Find a stand to take a breather before exploring the rest of the park.',
            location: 'Multiple Stands around the Park.',
            price_range: '$5 - $10' },
    { id: 6, name: 'Hot Doggos', 
            category: 'Concession Stands', 
            descript: 'Fresh, BUN LENGTH, Hot Dogs made every minute, every hour, every day!',
            location: 'Near "Station Up!"',
            price_range: '$3 - $10'
    },
    { id: 7, name: 'Forever Tuesday', 
            category: 'Concession Stands', 
            descript: 'Wish Taco Tuesday was always here? Well at Forever Tuesday it is! Soft and Hard Shell Tacos available.',
            location: 'Near Front-Gate-1',
            price_range: '$2 - $15' },
];

const Attractions = () => {
    const categories = [...new Set(attractionsData.map(attraction => attraction.category))]; // Unique categories

    return (
        <div>
            <div className="notificationbar">
                {/* Edit Notification Text */}
                <h1 className="notificationtext">**WINTER SEASON PASSES AVAILABLE! LOGIN OR CREATE AN ACCOUNT FOR MORE INFORMATION.</h1>
                <section className="loginbutton">
                    <a href="login" id="logintext">
                        <CustomerAccount text="Log In" /> {/* Looks ugly but works */}
                    </a>
                </section>
            </div>
            <Navbar />
            <div className="attractions-container">
             <div className="banner-image">
                <p className="h4">Attractions</p>
                </div>
                <br></br>
                <block id="topquote"><p><b>Take a look at our many attractions ranging from Restaurants, Gift Shops, and even Concession Stands!</b></p></block>
                {categories.map(category => (
                    <div className="attractions-category" key={category}>
                    <br></br><hr></hr>
                        <h2 className='attractionheader'>{category}</h2>
                        <div className="attractions-list">
                            {attractionsData.filter(attractions => attractions.category === category).map(attractions => (
                                <div className="attractions-card" key={attractions.id}>
                                    <h3>{attractions.name}</h3>
                                    <p><strong><u>Description:</u></strong> {attractions.descript} </p>
                                    <p><strong><u>Location:</u></strong> {attractions.location}</p>
                                    <p><strong><u>Price Range:</u></strong> {attractions.price_range}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Attractions;