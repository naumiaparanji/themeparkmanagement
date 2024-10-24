import "./Dashboard.css";
import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ApiContext, ApiContextProvider } from "../ApiContext";
import { Dashboard, PanelButton, SidePanelElements, SidePanelRoute, TopBarElements } from "./Dashboard";
import HomeIcon from "../images/home.svg";
import ReportsIcon from "../images/chart-histogram.svg";
import UserIcon from "../images/circle-user.svg";
import DownArrow from "../images/angle-small-down.svg";
import MainLogo from '../images/flagslogo.png'; 
import { apiPost } from "../CRUDApi";

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

export function EmployeeUserPanel({width}) {
    const {data} = useContext(ApiContext);
    const navigate = useNavigate();

    if (!data) return null;

    return (
        <div className="panel-font" style={{
            width: `${width}px`,
            position: "absolute",
            left: `calc(100vw - ${width + 10}px)`,
            border: "1px solid #d6d6d6",
            backgroundColor: "#ffffff",
        }}>
            <p style={{
                margin: "10px 0px 2px 0px",
                textAlign: "center",
                fontSize: "24px",
                textOverflow: "ellipsis"
                }}>
                {`${data.firstName} ${data.lastName}`}
            </p>
            <p style={{
                margin: 2,
                textAlign: "center",
                fontSize: "16px",
                textOverflow: "ellipsis"
                }}>
                {`${data.user}`}
            </p>
            <p style={{
                margin: 4,
                textAlign: "center",
                fontSize: "16px",
                textOverflow: "ellipsis"
                }}>
                {{
                    "EMP": "Employee",
                    "MGR": "Manager",
                    "ADM": "Admin"
                }[data.accessLevel]}
            </p>
            <div style={{
                marginTop: 16,
                borderTop: "1px solid #d6d6d6"
            }}>
                <PanelButton onClick={() => {
                    const getInfo = async () => {
                        const response = await apiPost("/employee/logout", {
                            employeeUser: data.user
                        })
                        .catch((e) => console.log(e));
                        if (response.code === 200) navigate("/employee/login");
                    }
                    getInfo().catch((e) => console.log(e));
                }}>
                    <p style={{
                        textAlign: "center",
                        margin: 4,
                        fontSize: 16,
                        width: "100%"
                    }}>
                        Logout
                    </p>
                </PanelButton>
            </div>
        </div>
    );
}

export function EmployeeUserInfo() {
    const [toggle, setToggle] = useState(false);

    return (
        <div style={{
            display: "flex",
            flexGrow: 1,
            alignContent: "flex-end",
            flexDirection: "row",
        }}>
            <div style={{marginLeft: "auto"}}>
            <div style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                <PanelButton onClick={() => setToggle(!toggle)}>
                    <img src={UserIcon} width={"35px"} alt="user"></img>
                    <img src={DownArrow} width={"30px"} alt="ui-arrow"></img>
                </PanelButton>
                </div>
                {toggle && <EmployeeUserPanel width={240}/>}
            </div>
        </div>
    );
}

export default function EmployeeDashboard(props) {
    const sidePanelWidth = props.sidePanelWidth || 240;
    const topBarHeight = props.topBarWidth || 60;

    return (
        <ApiContextProvider 
            apiPath="/employee/info" 
            apiFailureAction={() => window.location.pathname = "/employee/login"}
        >
            <Dashboard topBarHeight={topBarHeight} sidePanelWidth={sidePanelWidth}>
                <TopBarElements>
                    <img src={MainLogo} alt="Main Logo" />
                    <EmployeeUserInfo />
                </TopBarElements>
                <SidePanelElements>
                    { /* Must not have an element assigned to use root path DOM tree */ }
                    <SidePanelRoute icon={HomeIcon} text="Home" path="/employee/access" />
                    
                    { /* Other sidebar paths */ }
                    <SidePanelRoute icon={ReportsIcon} text="Reports" path="reports" element={null /* Actual element goes here */} />
                </SidePanelElements>
                { /* DOM tree for root path */ }
                <WhoAmI />
            </Dashboard>
        </ApiContextProvider>
    );
}