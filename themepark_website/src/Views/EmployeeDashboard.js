import styles from "./Dashboard.module.css";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation, useResolvedPath, Outlet } from 'react-router-dom';
import { ApiContext, ApiContextProvider } from "../ApiContext";
import MainLogo from '../images/flagslogo.png'; 
import * as Icon from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Nav, Container, NavDropdown, ListGroup} from "react-bootstrap";
import { StaffManagerContextProvider } from "./Staff";
import { api } from "../App";

export function WhoAmI() {
    // This is a placeholder for testing
    
    // Subscribe to context, will now have access to ApiContextProvider state
    const {data} = useContext(ApiContext); 

    if (!data) return (<h1>Loading...</h1>);

    return (
        <div>
            <p>{`Welcome ${data.firstName} ${data.lastName}!`}</p>
            <p>{`Your email is ${data.user}`}</p>
            <p>{`Your access level is ${data.accessLevel}`}</p>
        </div>
    );
}

export function SideBarLink({title, activeIcon, inactiveIcon, className, path}) {
    const navigate = useNavigate();
    const location = useLocation();
    const resolvedPath = useResolvedPath(path);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (location.pathname === resolvedPath.pathname) setIsActive(true);
        else setIsActive(false)
    }, [setIsActive, location, resolvedPath]);

    const ActiveIcon = Icon[activeIcon];
    const InactiveIcon = Icon[inactiveIcon];

    return (
        <ListGroup.Item action 
            onClick={() => navigate(path)} 
            className={`bg-transparent ${styles.hoverdark} ${isActive? styles.darken : ""} ${className}`}>
                <div className="d-flex justify-content-start align-items-center">
                    {isActive? (<ActiveIcon size={24}/>) : (<InactiveIcon size={24}/>)}
                    <div className="mx-3">{title}</div>
                </div>
        </ListGroup.Item>
    );
}

// Currently works for employee only
export function DashUI() {
    const {data} = useContext(ApiContext);
    const navigate = useNavigate();

    return (
        <Container fluid className={`${styles.fullsize} d-flex flex-column`}>
            <Navbar bg="light" expand={true}>
                <Container fluid>
                    <Navbar.Brand onClick={() => navigate("")} className="py-0">
                        <img
                            alt=""
                            src={MainLogo}
                            height={50}
                        />
                    </Navbar.Brand>
                    <Navbar.Text className="fs-5">
                        Employee Dashboard
                    </Navbar.Text>
                    <Nav className="ms-auto">
                        <NavDropdown title={`Logged in as ${data.firstName} ${data.lastName}`} align="end" id="collapsible-nav-dropdown">
                            <NavDropdown.Header>
                                <p className="fs-6 text-center"
                                style={{marginTop:-8, marginBottom:-8}}
                                >{`${data.user}`}</p>
                                <p className="fs-7 text-center"
                                style={{marginTop:8, marginBottom:-8}}
                                >{data.role}</p>
                            </NavDropdown.Header>
                            <NavDropdown.Divider/>
                            <NavDropdown.Item onClick={() => {
                                api.post("/employee/logout", {employeeUser: data.user})
                                .then(() => navigate("/employee/login"))
                                .catch((e) => console.error(e));
                            }} className="text-center">
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
            <div className={`${styles.grow} ${styles.hide} d-flex flex-row`}>
                <div className={`${styles.sidepanel}`}>
                    <ListGroup className={`list-group-flush ${styles.grow}`}>
                        <SideBarLink title="Home" path="" activeIcon="HouseFill" inactiveIcon="House" />
                        <SideBarLink title="Attractions" path="attractions" activeIcon="MapFill" inactiveIcon="Map" />
                        <SideBarLink title="Events" path="events" activeIcon="CalendarEventFill" inactiveIcon="CalendarEvent" />
                        <SideBarLink title="Reports" path="reports" activeIcon="Clipboard2DataFill" inactiveIcon="Clipboard2Data" />
                        <SideBarLink title="Maintenance Report" path="maintenance" activeIcon="Hammer" inactiveIcon="Hammer" />
                        <SideBarLink title="Ride Operator Portal" path="runs" activeIcon="Clipboard2DataFill" inactiveIcon="Clipboard2Data" />
                        <SideBarLink title="Data Management" path="datamanage" activeIcon="DatabaseFillLock" inactiveIcon="DatabaseLock" />
                        <SideBarLink className="mt-auto" title="Settings" path="settings" activeIcon="GearFill" inactiveIcon="Gear" />
                    </ListGroup>
                </div>
                <div className={`${styles.scrolly} w-100`}>
                    <Outlet />
                </div>
            </div>
        </Container>
    );
}

export default function EmployeeDashboard(props) {
    
    return (
        <ApiContextProvider 
            apiPath="/employee/info" 
            apiFailureAction={() => window.location.pathname = "/employee/login"}
            blockRendering={true}
        >
            <StaffManagerContextProvider>
                <DashUI />
            </StaffManagerContextProvider>
        </ApiContextProvider>
    );
}