//import './Home.css';
import BgVideo from './images/stock_footage_bg.mp4';
import Navbar from './Navbar'; 
import './CustomerAccount';
import CustomerAccount from './CustomerAccount';

const Home = () => {

    return (
        <div className="homepage">
            <div className="homenotificationbar">
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
                <div>
                    <video width="400" height="400" autoPlay loop muted className="bg-Video" >
                        <source src={BgVideo} type="video/mp4" />
                    </video>
                </div>
                <br></br>
                <h4 className="head4">A New Exhilarating Experience for that special day.</h4>
                <hr />
                <p>Explore our Website and book your next family outing with us!</p>
            </div>
        </div>
    );
}

export default Home;
