import logo from './logo.svg';
import './App.css';
import navbar from './navbar';

function App() {
    return (
        <body>

            <div className="navbar">
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
                <h1>7-Flags: Family Theme Park</h1>
                <hr></hr>
                <p>Located in Houston Texas, 7 Flags is a new thrilling Theme Park to spend time with the Family.</p>
            </div>
      </body>
  );
}

export default App;
