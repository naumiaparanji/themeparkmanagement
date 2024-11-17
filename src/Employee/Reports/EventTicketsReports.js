import React, {useCallback, useContext, useEffect, useState} from "react";
import {api} from "../../App";
import {Card, Table} from "react-bootstrap";
import styles from "./EventTicketsReports.module.css"
import MainLogo from "../../images/flagslogo.png";

const EventTicketsReportContext = React.createContext();

export function EventTicketsReportContextProvider({children}) {
    const [salesData, setSalesData] = useState([]);
    const [eventTickets, setEventTickets] = useState([]);
    const [eventNames, setEventNames] = useState([]);

    const refreshSalesData = useCallback(() => {
        api.get("/events/tickets/summary")
            .then((res) => setSalesData(res.data.tickets))
            .catch((e) => console.log(e));
    }, []);

    const refreshEventTickets = useCallback(() => {
        api.get("/events/tickets")
            .then((res) => setEventTickets(res.data.tickets))
            .catch((e) => console.log(e));
    }, []);

    const refreshEventNames = useCallback(() => {
        api.get("/events/names")
            .then((res) => setEventNames(res.data.names))
            .catch((e) => console.log(e));
    }, []);

    useEffect(() => {
        refreshSalesData();
        refreshEventTickets();
        refreshEventNames();
    }, [refreshEventTickets, refreshSalesData, refreshEventNames]);

    return (
        <EventTicketsReportContext.Provider value={{
            salesData,
            eventTickets,
            eventNames,
            refreshSalesData,
            refreshEventTickets,
            refreshEventNames
        }}>
            {children}
        </EventTicketsReportContext.Provider>
    )

}

export function EventTicketSalesSummary() {
    const {salesData} = useContext(EventTicketsReportContext);

    return (
        <>
            <Table className={styles.reportstable} striped bordered size="sm">
                <thead>
                <tr>
                    <th>Event ID</th>
                    <th>Event Name</th>
                    <th>Tickets Sold</th>
                    <th>Scanned Tickets</th>
                </tr>
                </thead>
                <tbody>
                {salesData.map((entry, i) => (
                    <tr key={i}>
                        <td>{entry.EventID}</td>
                        <td>{entry.EventName}</td>
                        <td>{entry.TotalTickets}</td>
                        <td>{entry.ScannedCount}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
}

export function EventTicketDataReport() {
    const {eventTickets, eventNames} = useContext(EventTicketsReportContext);
    const [displayData, setDisplayData] = useState(eventTickets);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [eventFilter, setEventFilter] = useState(null);

    const applyFilters = useCallback(() => {
        let newData = eventTickets;
        if (fromDate && !isNaN(fromDate.getTime())) {
            newData = newData.filter((item) => new Date(item.Bought) > fromDate);
        }
        if (toDate && !isNaN(toDate.getTime())) {
            newData = newData.filter((item) => new Date(item.Bought) <= toDate);
        }
        if (eventFilter && eventFilter !== 'none') {
            newData = newData.filter((item) => item.EventName === eventFilter);
        }
        setDisplayData(newData);
    }, [eventTickets, fromDate, toDate, eventFilter]);

    const handleFromChange = useCallback((event) => {
        setFromDate(new Date(event.target.value));
    }, []);

    const handleToChange = useCallback((event) => {
        setToDate(new Date(event.target.value));
    }, []);

    const handleEventFilterChange = useCallback((event) => {
        setEventFilter(event.target.value);
    }, []);

    useEffect(() => {
        applyFilters();
    }, [fromDate, toDate, eventFilter, applyFilters]);

    return (
        <>
            <div className="d-flex flex-row justify-content-center">
                <div className="d-flex flex-column justify-content-center mx-4">
                    <label style={{textAlign: "center"}}>Filter by event:</label>
                    <select style={{width: 200}} onChange={handleEventFilterChange} name="event-filter" id="efilter">
                        <option value="none">Select event</option>
                        {eventNames.map((name, i) => (
                            <option value={name} key={i}>{name}</option>
                        ))}
                    </select>
                </div>
                <div className="d-flex flex-column justify-content-center mx-4">
                    <label style={{textAlign: "center"}}>Purchase date from:</label>
                    <input style={{width: 200}} onChange={handleFromChange} type="date" id="todate"/>
                </div>
                <div className="d-flex flex-column justify-content-center mx-4">
                    <label style={{textAlign: "center"}}>Purchase date to:</label>
                    <input style={{width: 200}} onChange={handleToChange} type="date" id="todate"/>
                </div>
            </div>
            <Table className={`${styles.reportstable} mt-4`} striped bordered size="sm">
                <thead>
                <tr>
                    <th>Event Ticket ID</th>
                    <th>Event Name</th>
                    <th>Customer Name</th>
                    <th>Purchase Date</th>
                    <th>Expiration Date</th>
                    <th>Scanned Date</th>
                </tr>
                </thead>
                <tbody>
                {displayData.map((entry, i) => (
                    <tr key={i}>
                        <td>{entry.EventTicketID}</td>
                        <td>{entry.EventName}</td>
                        <td>{entry.CustomerName}</td>
                        <td>{new Date(entry.Bought).toLocaleString()}</td>
                        <td>{new Date(entry.ExpirationDate).toLocaleString()}</td>
                        <td>{entry.ScannedDate !== "N/A" ? new Date(entry.ScannedDate).toLocaleString() : entry.ScannedDate}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
}

export function EventTicketsReportsView() {
    const [reportType, setReportType] = useState("summary");

    const handleChange = useCallback((event) => {
        setReportType(event.target.value);
    }, []);

    return (
        <EventTicketsReportContextProvider>
            <Card className={`mx-5 mt-4 ${styles.scroll} `}>
                <div className="d-flex flex-column">
                    <img className="w-25 m-auto mt-4" src={MainLogo} alt="Main Logo"/>
                    <hr className={styles.divider}/>
                    <div className="m-auto mt-4">
                        Report Type
                    </div>
                    <select onChange={handleChange} name="report-type" id="rtype" className="w-auto m-auto">
                        <option value="summary">Summary</option>
                        <option value="all">Individual Sales</option>
                    </select>
                </div>
                <div className="m-4">
                    {reportType === "summary" ? (<EventTicketSalesSummary/>) : (<EventTicketDataReport/>)}
                </div>
            </Card>
        </EventTicketsReportContextProvider>
    )
}