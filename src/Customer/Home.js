import '../App.css';
import BgVideo from '../images/stock_footage_bg.mp4';
import Navbar from './Navbar';
import './CustomerAccount';
import CustomerAccount from './CustomerAccount';
import {Button} from "react-bootstrap";
import {Link} from 'react-router-dom';

const Home = () => {

    return (
        <div className="homepage">
            <div className="homenotificationbar">
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
            <div className="mainText">
                <div>
                    <video autoPlay loop muted className="bg-Video">
                        <source src={BgVideo} type="video/mp4"/>
                    </video>
                </div>
            </div>
            <div className="BodyText">
                <h2 id="HomeHeader">An Exhilarating Experience for that Special Day</h2>
                <Button id="homebutton">
                    <Link id="homebutton" to="/Tickets">Available Passes Here</Link></Button>
            </div>
        </div>
    );
}

export default Home;
