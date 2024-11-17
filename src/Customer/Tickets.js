import './Tickets.css';
import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import './CustomerAccount'
import CustomerAccount from './CustomerAccount';
import Navbar from './Navbar';
import {api} from "../App";
import goldpass from '../images/goldpass.png';
import prestige from '../images/prestigeadvent.png';
import newcomer from '../images/newcomer.png';

function TicketInfo() {
    // Supposed to grab Data from the Database
    const [data, setData] = useState([])

    useEffect(() => {
        api.get('http://localhost:8080')
            .then(res => setData(res.data))
            .catch(err => console.log(err));
    }, [])
};


const ticketData = [
    // Testing tickets
    {
        id: 1,
        name: 'Gold Pass',
        image: <img src={goldpass} alt="logo"
                    style={{width: '100%', height: 'auto', paddingRight: '15px', position: 'relative'}}/>,
        subName: 'VIP Experience with Exclusive Benefits',
        Description: 'Enjoy Preferred Parking, Monthly Pass Holder Rewards, Discounts, 2 Bring-a-Friend FREE tickets* and more with your 2025 Prestige Pass including UNLIMITED visits the rest of this year and the entire 2025 season at Seven Flags.',
        price: "$129.99"
    },
    {
        id: 2,
        name: 'Prestiged Adventurer',
        image: <img src={prestige} alt="logo"
                    style={{width: '100%', height: 'auto', paddingRight: '15px', position: 'relative'}}/>,
        subName: 'Never-Ending VIP Experience with Exclusive Benefits!',
        Description: 'Enjoy Preferred Parking, Monthly Pass Holder Rewards, Discounts 2 Bring-a-Friend FREE tickets* and more with your Prestige Membership including UNLIMITED visits with no blockout dates at Six Flags Over Texas and Hurricane Harbor Arlington.',
        price: "$169.99"
    },
    {
        id: 3,
        name: 'A Newcomer Ticket',
        image: <img src={newcomer} alt="logo"
                    style={{width: '100%', height: 'auto', paddingRight: '15px', position: 'relative'}}/>,
        subName: 'Good for a one-day visit!',
        Description: 'Gain general access to the park and all of the rides for one day! Parking is not included and extra activities will need to be paid for if you are interested in participating in them.',
        price: "$39.99"
    }
];

const Tickets = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    //const categories = [...new Set(ticketData.map(ticket => ticket.category))]; // Unique categories
    const [passData, setPassData] = useState([]);
    const [passTypes, setPassCategories] = useState([]);
    const [userPasses, setUserPasses] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Fetch pass data
        api.get("/passes")
            .then((response) => {
                setPassData(response.data.passes);
                setPassCategories([...new Set(response.data.passes.map(passes => passes.PassType))]);
            })
            .catch((e) => console.error(e));

        // Check login status and fetch user passes
        api.get("/customer/info", {withCredentials: true})
            .then((res) => {
                if (res.data.success) {
                    setIsLoggedIn(true);
                    api.get("/customer/passes")
                        .then((response) => setUserPasses(response?.data?.passes.map(passes => passes.PassID) || []))
                        .catch((e) => console.log(e));
                }
            })
            .catch(() => setIsLoggedIn(false)); // Handle not logged in
    }, []);

    const handleRegister = (passId) => {
        api.post("/customer/registerPass", {passId})
            .then((res) => {
                alert("Successfully purchased a Pass!");
                setUserPasses((prevPasses) => [...prevPasses, passId]); // Update local passes state
            })
            .catch((e) => {
                if (e.response?.data?.error !== "SQLError") {
                    alert(e.response.data.error);
                } else {
                    console.error("Error purchasing pass:", e);
                }
            });
    };

    const handleUnregister = (passId) => {
        api.post("/customer/unregisterPass", {passId})
            .then((res) => {
                if (res.data.success) {
                    alert("Successfully returned Pass!");
                    setUserPasses((prevPasses) => prevPasses.filter(id => id !== passId));
                } else {
                    alert("Return failed. Please try again.");
                }
            })
            .catch((e) => {
                const errorMsg = e.response?.data?.error || "An unexpected error occurred.";
                alert(errorMsg);
                console.error("Error purchasing pass:", e);
            });
    };

    return (
        <div className="containermain">
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
            <div className="background-image"></div>
            <div className="Ticket-container">
                {passTypes.map(category => (
                    <div className="ticket-category" key={category}>
                        <div className="ticket-list">
                            {passData.filter(passes => passes.PassType === category).map(passes => (
                                <div className="ticket-card" key={passes.PassID}>
                                    <h3>{passes.PassName}</h3>
                                    <p><strong><u>Description:</u></strong> {passes.PassDesc}</p>
                                    <p><strong>Location:</strong> {passes.Location}</p>
                                    <p><strong>Restrictions:</strong> {passes.PassRestrictions}</p>
                                    {isLoggedIn ? (
                                        userPasses.includes(passes.PassID) ? (
                                            <>
                                                <hr></hr>
                                                <p><strong>Already Purchased</strong></p>
                                                <button className="button2"
                                                        onClick={() => handleUnregister(passes.PassID)}>Refund
                                                </button>
                                            </>
                                        ) : (
                                            <button className="button"
                                                    onClick={() => handleRegister(passes.PassID)}>Purchase</button>
                                        )
                                    ) : (
                                        <p className="PleaseLogin">Please log in to Purchase</p>
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

export default Tickets;