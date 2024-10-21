import './App.css';
import { Link } from 'react-router-dom';
import BgVideo from './images/stock_footage_bg.mp4';
import MainLogo from './images/flagslogo.png';
import './CustomerAccount'
import CustomerAccount from './CustomerAccount';

function Home() {
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
            <div className="navbar">
                <section className="navbar-links" id="navbar-logo">
                    <Link to="/">
                        <img src={MainLogo} alt="logo" />
                    </Link>
                </section>
                <section className="navbar-links">
                    <Link to="/">Home</Link>
                </section>
                <section className="navbar-links">
                    <Link to="/rides">Rides</Link>
                </section>
                <section className="navbar-links">
                    <Link to="/attractions">Attractions</Link>
                </section>
                <section className="navbar-links">
                    <Link to="/events">Events</Link>
                </section>
                <section className="navbar-links">
                    <Link to="/about">About Us</Link>
                </section>
            </div>


            <div className="mainText">
                <video autoPlay loop muted id="bg-Video"><source src={BgVideo} type="video/mp4" /> </video>
                <h2>A New Exhilirating Experience for that special day.</h2>
                <hr></hr>
                <p>Explore our Website and book your next family outing with us!</p>
            </div>
            <br></br><br></br><br></br><br></br><br></br>
        </div>
  );
}

export default Home;
