import './App.css';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Home';
import Tickets from './Tickets/Tickets';
import Attractions from './Attractions';
import Events from './Events';
import AboutUs from './AboutUs';
import Rides from './Rides';
import Runs from './Runs/Runs';
import { EmployeeLogin, Login } from './Auth/Login';
import { EmployeeSignup, SignUp } from './Auth/Signup';
import DataManage from './Views/DataEdit/DataManage';
import EmployeeDashboard, { WhoAmI } from './Views/EmployeeDashboard';
import { MaintenanceInfo } from './Maintenance/Maintenance';
import PageNotFound from "./PageNotFound";
import axios from "axios";
import { MaintenanceData } from './Maintenance/MaintenanceEdit';
import { RidesInfo, RidesInfoBox } from './Rides/Rides';
import { EventsEditView } from './Views/EventsEdit/EventsEditView';
import { AttractionsEditView } from './Views/AttractionsEdit/AttractionsEdit';
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
                <Route exact path='/employee/datamanage' element={<DataManage />} />
                <Route exact path='/maintenance' element={<MaintenanceInfo />} />
                <Route exact path='/about' element={<AboutUs />} />
                <Route exact path='/Tickets/Tickets' element={<Tickets />} />
                <Route exact path="/your-profile" element={<ProfilePage />} /> 
                <Route exact path='/employee/login' element={<EmployeeLogin />} />
                <Route exact path='/employee/signup' element={<EmployeeSignup />} />
                <Route exact path='/attractions/edit' element={<AttractionsEditView/>} />
                <Route exact path='/events/edit' element={<EventsEditView/>} />
                <Route path='/employee/access/*' element={<EmployeeDashboard />}>
                <Route path="" element={<WhoAmI/>} />
                <Route path="events" element={<EventsEditView/>} />
                <Route path="attractions" element={<AttractionsEditView/>} />
                <Route path="reports" element={<WhoAmI/>} />
                <Route path="rides" element={<RidesInfo/>} />
                <Route path="maintenance" element={<MaintenanceInfo/>} />
                <Route path="runs" element={<Runs/>} />
                <Route path="maintenance/data" element={<MaintenanceData/>} />
                <Route path="datamanage" element={<DataManage/>} />
                <Route path='*' element={<PageNotFound />} />
                </Route>
                <Route path='*' element={<PageNotFound />} />
            </Routes>
        </div>
    );
}

export default App;
