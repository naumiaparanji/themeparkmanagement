import "./Dashboard.css";
import React, { createContext, useContext, useEffect } from "react";
import { useLocation, useNavigate, useResolvedPath } from "react-router-dom";

export function PanelButton({containerClassName, width, height, className, onClick, children}) {
    return (
        <div className={containerClassName || "panel-button"} style={{
            width: `${width}px`,
            height: `${height}px`
        }}>
            <button className={className} onClick={onClick}>
                {children}
            </button>
        </div>
    );
}

export function SidePanel({width, offsetLeft, offsetRight, offsetTop, offsetBottom, children}) {
    return (
        <div className="sidepanel" 
            style={{
                width: `${width ? width : 240}px`,
                marginLeft: `${offsetLeft}px`,
                marginRight: `${offsetRight}px`,
                marginTop: `${offsetTop}px`,
                marginBottom: `${offsetBottom}px`,
            }}
        >
            <div className="ui-flex-content panel-font">
                {children}
            </div>
        </div>
    );
}

export function TopBar({height, offsetLeft, offsetRight, offsetTop, offsetBottom, children}) {
    return (
        <div className="topbar" 
            style={{
                height: `${height ? height : 40}px`,
                marginLeft: `${offsetLeft}px`,
                marginRight: `${offsetRight}px`,
                marginTop: `${offsetTop}px`,
                marginBottom: `${offsetBottom}px`,
            }}
        >
            <div className="ui-flex-content panel-font">
                {children}
            </div>
        </div>
    );
}

const DashboardContext = createContext();

export function SidePanelRoute({ path, element, text, icon, height }) {
    const navigate = useNavigate();
    const location = useLocation();
    const resolvedPath = useResolvedPath(path);
    const { setRoutedElement } = useContext(DashboardContext);

    useEffect(() => {
        if (location.pathname === resolvedPath.pathname)
            setRoutedElement(element);
    }, [path, element, location, resolvedPath, setRoutedElement]);

    return (
        <PanelButton height={height || 30} onClick={() => {if (path) navigate(path)}}>
            <img className="sidepanel-route-icon" src={icon} alt={text || "Button"}/>
            <div className="sidepanel-route-text sidepanel-font">{text || "Button"}</div>
        </PanelButton>
    );
}

export function TopBarElements({ children }) {
    const { setTopBarElements } = useContext(DashboardContext);
    useEffect(() => {
        setTopBarElements(children);
    }, [children, setTopBarElements]);
    return null;
}

export function SidePanelElements({ children }) {
    const { setSidePanelElements } = useContext(DashboardContext);
    useEffect(() => {
        setSidePanelElements(children);
    }, [children, setSidePanelElements]);
    return null;
}

export function Dashboard({topBarHeight, sidePanelWidth, children}) {
    const [topBarElements, setTopBarElements] = React.useState(null);
    const [sidePanelElements, setSidePanelElements] = React.useState(null);
    const [routedElement, setRoutedElement] = React.useState(null);

    return (
        <DashboardContext.Provider value={{ setTopBarElements, setSidePanelElements, setRoutedElement }}>
            <TopBar height={topBarHeight}>
                {topBarElements}
            </TopBar>
            <SidePanel width={sidePanelWidth} offsetTop={topBarHeight + 1}>
                {sidePanelElements}
            </SidePanel>
            <div style={{
                position: "fixed",
                marginTop: topBarHeight + 1,
                marginLeft: sidePanelWidth + 1,
                width: `calc(100vw - ${sidePanelWidth + 1}px)`,
                height: `calc(100vh - ${topBarHeight + 1}px)`,
                overflowX: "hidden",
                overflowY: "scroll"
            }}>
                {routedElement || children}
            </div>
        </DashboardContext.Provider>
    );
}
