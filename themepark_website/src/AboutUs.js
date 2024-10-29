import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerAccount'
import CustomerAccount from './CustomerAccount';
import Navbar from './Navbar'; 
import './AboutUs.css'; 

const AboutUs = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook

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
    <div className="about-us-container">
      {/* Title Section  */}
      <button className="back-button" onClick={() => navigate('/')}>
              Back to Home
          </button>  
      <h1 className="about-us-title">About Our Theme Park</h1>
      
      {/* Cards Section */}
      <div className="about-us-cards">
        {/* History Card */}
        <div className="about-us-card">
          <h3>History</h3>
          <p>
            Established in 1990, our theme park has been a place of joy and excitement for millions. From humble beginnings, we have grown into one of the premier attractions in the region.
          </p>
        </div>

        {/* Top Attractions Card */}
        <div className="about-us-card">
          <h3>Top Attractions</h3>
          <p>
            Our park is home to some of the most thrilling rides and experiences. Don’t miss the roller coasters, water rides, and live shows that make our park unique.
          </p>
        </div>

        {/* Reviews Card */}
        <div className="about-us-card">
          <h3>Reviews</h3>
          <p>
            "Best theme park I've ever visited!" - Jane D. , Jul 2024 <br />
            "My kids loved every moment. Highly recommend!" - John S. , Aug 2024
          </p>
        </div>

        {/* More Information Card */}
        <div className="about-us-card">
          <h3>More Information</h3>
          <p>
            Plan your visit with our detailed guides on tickets, accommodations, and special events. We're here to help you have an unforgettable experience.
          </p>
        </div>
        </div>
    </div>
    </div>
  );
};

export default AboutUs;  