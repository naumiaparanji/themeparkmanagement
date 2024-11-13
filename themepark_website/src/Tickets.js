import './Tickets.css'; 
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import './CustomerAccount'
import CustomerAccount from './CustomerAccount';
import Navbar from './Navbar';
import { api } from "./App";
import axios from "axios";
import goldpass from './images/goldpass.png'; 
import prestige from './images/prestigeadvent.png'; 
import newcomer from './images/newcomer.png'; 

function TicketInfo() {
    // Supposed to grab Data from the Database
        const [data, setData] = useState([])
    
        useEffect(()=> {
        api.get('http://localhost:8080')
            .then(res => setData(res.data))
            .catch(err => console.log(err));
      }, [])};
    


const ticketData = [
    // Testing tickets
    { id: 1, name: 'Gold Pass', image: <img src={goldpass} alt="logo" style={{ width: '100%', height: 'auto', paddingRight: '15px', position: 'relative' }} />, subName: 'VIP Experience with Exclusive Benefits', Description: 'Enjoy Preferred Parking, Monthly Pass Holder Rewards, Discounts, 2 Bring-a-Friend FREE tickets* and more with your 2025 Prestige Pass including UNLIMITED visits the rest of this year and the entire 2025 season at Seven Flags.', price: "$129.99" },
    { id: 2, name: 'Prestiged Adventurer', image: <img src={prestige} alt="logo" style={{ width: '100%', height: 'auto', paddingRight: '15px', position: 'relative' }} />, subName: 'Never-Ending VIP Experience with Exclusive Benefits!', Description: 'Enjoy Preferred Parking, Monthly Pass Holder Rewards, Discounts 2 Bring-a-Friend FREE tickets* and more with your Prestige Membership including UNLIMITED visits with no blockout dates at Six Flags Over Texas and Hurricane Harbor Arlington.', price: "$169.99" },
    { id: 3, name: 'A Newcomer Ticket', image: <img src={newcomer} alt="logo" style={{ width: '100%', height: 'auto', paddingRight: '15px', position: 'relative' }} />, subName: 'Good for a one-day visit!', Description: 'Gain general access to the park and all of the rides for one day! Parking is not included and extra activities will need to be paid for if you are interested in participating in them.', price: "$39.99" }
];


const Tickets = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const categories = [...new Set(ticketData.map(ticket => ticket.category))]; // Unique categories
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
      // Check session status on mount
      api.get('/customer/info', { withCredentials: true })
          .then(response => {
              if (response.data.success) {
                  setIsLoggedIn(true);
              } else {
                  setIsLoggedIn(false);
              }
          })
          .catch(() => setIsLoggedIn(false)); // Ensure safe fallback
    }, []);

    const linkStyle = {
        fontSize: '20px',
        fontWeight: 'bold',
        textDecoration: 'none',
        color: 'white',
    };

    const [modal, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal);
    };

    if(modal) {
        document.body.classList.add('active-modal')
      } else {
        document.body.classList.remove('active-modal')
    };

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
    <div className="background-image"></div>
      <div className="ticket-container">
          {categories.map(category => (
              <div className="ticket-category" key={category}>
                  <p className="h4-ticket">
                    Tickets
                  </p>
                  <div className="ticket-list">
                      {ticketData.filter(ticket => ticket.category === category).map(ticket => (
                          <div className="ticket-card" key={ticket.id}>
                              <h3>{ticket.name}</h3>
                              <p>{ticket.image}</p>
                              <p><strong>{ticket.subName}</strong></p>
                              <p><strong>Description: </strong> <p>{ticket.Description}</p></p>
                              <p className="price"><strong>Price: </strong>{ticket.price}</p>
                              {isLoggedIn && 
                                        <button className="button" onClick={toggleModal} style={linkStyle}>Purchase</button>
                                    }
                          </div>
                      ))}
                      
                  </div>
              </div>
          ))}
      </div>
      </div>

  );
};

export default Tickets;