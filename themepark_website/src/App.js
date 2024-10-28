import './App.css';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Home';
import Attractions from './Attractions';
import Events from './Events';
import AboutUs from './AboutUs';
import Rides from './Rides';
import { EmployeeLogin, Login } from './Auth/Login';
import { EmployeeSignup, SignUp } from './Auth/Signup';
import DataManage from './DataEdit/DataManage';
import EmployeeDashboard from './Views/EmployeeDashboard';
import { MaintenanceInfo } from './Maintenance/Maintenance';
import PageNotFound from "./PageNotFound";


export const apiUrl = 'http://localhost:8080';

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
                <Route exact path='/employee/login' element={<EmployeeLogin />} />
                <Route exact path='/employee/signup' element={<EmployeeSignup />} />
                <Route path='/employee/access/*' element={<EmployeeDashboard />} />
                <Route path='*' element={<PageNotFound />} />
            </Routes>
        </div>
    );
}

export default App;
