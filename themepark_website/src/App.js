import './App.css';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Home';
import Tickets from './Tickets';
import Attractions from './Attractions';
import Events from './Events';
import AboutUs from './AboutUs';
import Rides from './Rides';
import { EmployeeLogin, Login } from './Auth/Login';
import { EmployeeSignup, SignUp } from './Auth/Signup';
import DataManage from './Views/DataEdit/DataManage';
import EmployeeDashboard, { WhoAmI } from './Views/EmployeeDashboard';
import { MaintenanceInfo } from './Maintenance/Maintenance';
import PageNotFound from "./PageNotFound";
import axios from "axios";
import ProfilePage from './ProfilePage'; 


export const apiUrl = 'http://localhost:8080';

export const api = axios.create({
    withCredentials: true,
    baseURL: apiUrl
});

function App() {
    return (
        <div className="App">
            {/* Add your routes here */}
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/rides' element={<Rides />} />
                <Route exact path='/login' element={<Login />} />
                <Route exact path='/signup' element={<SignUp />} />
                <Route exact path='/attractions' element={<Attractions />} />
                <Route exact path='/events' element={<Events />} />
                <Route exact path='/about' element={<AboutUs />} />
                <Route exact path='/Tickets' element={<Tickets />} />
                <Route exact path="/your-profile" element={<ProfilePage />} /> 
                <Route exact path='/employee/login' element={<EmployeeLogin />} />
                <Route exact path='/employee/signup' element={<EmployeeSignup />} />
                <Route path='/employee/access/*' element={<EmployeeDashboard />} />
                <Route path='*' element={<PageNotFound />} />
            </Routes>
        </div>
    );
}

export default App;
