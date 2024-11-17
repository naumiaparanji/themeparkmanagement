import './App.css';
import {Route, Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Customer/Home';
import Tickets from './Customer/Tickets';
import Attractions from './Customer/Attractions';
import Events from './Customer/Events';
import AboutUs from './Customer/AboutUs';
import Rides from './Customer/Rides';
import {EmployeeLogin, Login} from './Auth/Login';
import {EmployeeSignup, SignUp} from './Auth/Signup';
import EmployeeDashboard from './Employee/EmployeeDashboard';
import PageNotFound from "./Customer/PageNotFound";
import axios from "axios";
import ProfilePage from './Customer/ProfilePage';


export const apiUrl = process.env.REACT_APP_API_SERVER_ADDRESS;

export const api = axios.create({
    withCredentials: true,
    baseURL: apiUrl
});

function App() {
    return (
        <div className="App">
            {/* Add your routes here */}
            <Routes>
                <Route exact path='/' element={<Home/>}/>
                <Route exact path='/rides' element={<Rides/>}/>
                <Route exact path='/login' element={<Login/>}/>
                <Route exact path='/signup' element={<SignUp/>}/>
                <Route exact path='/attractions' element={<Attractions/>}/>
                <Route exact path='/events' element={<Events/>}/>
                <Route exact path='/about' element={<AboutUs/>}/>
                <Route exact path='/Tickets' element={<Tickets/>}/>
                <Route exact path="/your-profile" element={<ProfilePage/>}/>
                <Route exact path='/employee/login' element={<EmployeeLogin/>}/>
                <Route exact path='/employee/signup' element={<EmployeeSignup/>}/>
                <Route path='/employee/access/*' element={<EmployeeDashboard/>}/>
                <Route path='*' element={<PageNotFound/>}/>
            </Routes>
        </div>
    );
}

export default App;
