import './App.css';
import Navbar from './Navbar';
import './CustomerAccount';
import CustomerAccount from './CustomerAccount';
import "../Auth/Auth.css";
import {
    RandomBGImg
} from "../Auth/AuthComponents";

function PageNotFound() {

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

            <div className="mainText">
                <RandomBGImg />
                <h1 style="color:red;font-size:50px"><strong>404 - Page not found.</strong></h1>
            </div>
            <br /><br /><br /><br /><br /><br /><br />
        </div>
    );
}

export default PageNotFound;
