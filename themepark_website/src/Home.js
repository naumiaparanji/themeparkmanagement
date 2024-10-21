import './App.css';
import BgVideo from './images/stock_footage_bg.mp4';
import Navbar from './Navbar'; 
import './CustomerAccount';
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

            <Navbar /> 

            <div className="mainText">
                <video autoPlay loop muted id="bg-Video">
                    <source src={BgVideo} type="video/mp4" />
                </video>
                <h2>A New Exhilarating Experience for that special day.</h2>
                <hr />
                <p>Explore our Website and book your next family outing with us!</p>
            </div>
            <br /><br /><br /><br /><br /><br /><br />
        </div>
    );
}

export default Home;
