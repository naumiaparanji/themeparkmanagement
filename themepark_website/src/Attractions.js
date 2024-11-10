import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerAccount from './CustomerAccount';
import Navbar from './Navbar';
import { api } from './App';
import './Attractions.css';
import './CustomerAccount'

const Attractions = () => {
    const [ attractions, setAttractions ] = useState([]);
    const [ categories, setCategories ] = useState([]);
    const navigate = useNavigate();

    const refreshAttractions = useCallback(() => {
        api.get("/attractions")
        .then((response) => {
            setAttractions(response.data.attractions);
            setCategories([...new Set(response.data.attractions.map(a => a.Category))]);
        })
        .catch((e) => console.log(e));
    }, []);

    useEffect(() => {
        refreshAttractions();
    }, [refreshAttractions]);

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
            <button className="back-button" onClick={() => navigate('/')}>
              Back to Home
                </button> 
                <br></br> 
                <br></br>
            <div className="attractions-container">
             <div className="banner-image2">
                <p className="h4">Attractions</p>
                </div>
                <br></br>
                <block id="topquote_one"><p><b>Take a look at our many attractions ranging from Restaurants, Gift Shops, and even Concession Stands!</b></p></block>
                {categories.map(category => (
                    <div className="attractions-category" key={category}>
                    <hr></hr>
                        <h2 className='attractionheader'>{category}</h2>
                        <div className="attractions-list">
                            {attractions.filter(attractions => attractions.Category === category).map(attraction => (
                                <div className="attractions-card" key={attraction.ID}>
                                    <h3>{attraction.Name}</h3>
                                    <p><strong><u>Description:</u></strong> {attraction.Description} </p>
                                    <p><strong><u>Location:</u></strong> {attraction.Location}</p>
                                    <p><strong><u>Price Range:</u></strong> {`$${attraction.PriceMin} - $${attraction.PriceMax}`}</p>
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