import './App.css';
import { Routes, Route } from 'react-router-dom';

import Home from './Home';
import Attractions from './Attractions';
import Events from './Events';
import AboutUs from './AboutUs';
import Rides from './Rides';
import { EmployeeLogin, Login } from './Auth/Login';
import { EmployeeSignup, SignUp } from './Auth/Signup';
import EmployeeDashboard from './Views/EmployeeDashboard';
import axios from "axios";

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
                <Route exact path='/rides' element={<Rides />} />
                <Route exact path='/' element={<Home />} />
                <Route exact path='/login' element={<Login />} />
                <Route exact path='/signup' element={<SignUp />} />
                <Route exact path='/attractions' element={<Attractions />} />
                <Route exact path='/events' element={<Events />} />
                <Route exact path='/about' element={<AboutUs />} />
                <Route exact path='/employee/login' element={<EmployeeLogin />} />
                <Route exact path='/employee/signup' element={<EmployeeSignup />} />
                <Route path='/employee/access/*' element={<EmployeeDashboard />} />
            </Routes>
        </div>
    );
}

export default App;
