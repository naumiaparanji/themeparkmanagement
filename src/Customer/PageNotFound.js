import './PageNotFound.css';
import Navbar from './Navbar';
import './CustomerAccount';
import CustomerAccount from './CustomerAccount';
import "../Auth/Auth.css";
import BgVideo from "../images/stock_footage_bg.mp4";

function PageNotFound() {

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

            <div className="mainText">
                <video autoPlay loop muted width="100%" height="100%">
                    <source src={BgVideo} type="video/mp4"/>
                </video>
                <div className="overlay">
                    <h1 style={{color: 'black', fontSize: 150, outlineColor: 'red'}}>
                        <strong>404 - Page not found.</strong>
                    </h1>
                </div>
            </div>
        </div>
    );
}

export default PageNotFound;
