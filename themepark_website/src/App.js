import './App.css';
import navbar from './navbar';
import BgVideo from './stock_footage_bg.mp4';
import MainLogo from './flagslogo.png';

function App() {
    return (
        <body>
            <div className="notificationbar">
            {/* Edit Notification Text */}
            <h1 className="notificationtext">**WINTER SEASON PASSES AVAILABLE! LOGIN OR CREATE AN ACCOUNT FOR MORE INFORMATION.</h1>
            <section className="loginbutton">
                <a href="login.js" id="logintext">Log In</a>
            </section>
            </div>

            <div className="navbar">
                <section className="navbar-links">
                    <a href="App.js">
                        <img src={MainLogo} alt="logo" />
                    </a>
                </section>
                <section className="navbar-links">
                    <a href="App.js">Home</a>
                </section>
                <section className="navbar-links">
                    <a href="App.js">Rides</a>
                </section>
                <section className="navbar-links">
                    <a href="App.js">Attractions</a>
                </section>
                <section className="navbar-links">
                    <a href="App.js">Events</a>
                </section>
                <section className="navbar-links">
                    <a href="App.js">About Us</a>
                </section>
            </div>

            <div className="mainText">
                <video autoPlay loop muted id="bg-Video"><source src={BgVideo} type="video/mp4" /> </video>
                <h2>A New Exhilirating Experience for that special day.</h2>
                <hr></hr>
                <p>Explore our Website and book your next family outing with us!</p>
            </div>
            <br></br><br></br><br></br><br></br><br></br>
      </body>
  );
}

export default App;
