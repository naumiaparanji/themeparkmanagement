import React, {useCallback, useContext, useEffect, useState} from "react";
import {api} from "../../App";
import {Card, Table} from "react-bootstrap";
import styles from "./EventTicketsReports.module.css"
import MainLogo from "../../images/flagslogo.png";

const RidePopularityReportContext = React.createContext();

export function RidePopularityReportContextProvider({children}) {
    const [categoryData, setCategoryData] = useState([]);
    const [rideData, setRideData] = useState([]);
    const [runsData, setRunsData] = useState([]);

    const currentTime = new Date().toISOString().split("T")[0];
    const [startDate, setStartDate] = useState(currentTime);
    const [endDate, setEndDate] = useState(currentTime);

    const refreshCategorySummary = useCallback(() => {
        api.get("/ridePopularity/category", { params: { dateRange: [startDate, endDate] } })
            .then((res) => setCategoryData(res.data.rows))
            .catch((e) => console.log(e));
    }, [startDate, endDate]);

    const refreshRideSummary = useCallback(() => {
        api.get("/ridePopularity/ride", { params: { dateRange: [startDate, endDate] } })
            .then((res) => setRideData(res.data.rows))
            .catch((e) => console.log(e));
    }, [startDate, endDate]);

    const refreshRuns = useCallback(() => {
        api.get("/ridePopularity/runs")
            .then((res) => setRunsData(res.data.rows))
            .catch((e) => console.log(e));
    }, []);

    const handleStartChange = useCallback((event) => {
        setStartDate(new Date(event.target.value).toISOString().split('T')[0]);
    }, []);

    const handleEndChange = useCallback((event) => {
        setEndDate(new Date(event.target.value).toISOString().split('T')[0]);
    }, []);

    useEffect(() => {
        refreshCategorySummary();
        refreshRideSummary();
        refreshRuns();
    }, [refreshCategorySummary, refreshRideSummary, refreshRuns, startDate, endDate]);

    return (
        <RidePopularityReportContext.Provider value={{
            categoryData,
            rideData,
            runsData,
            refreshCategorySummary,
            refreshRideSummary,
            refreshRuns,
            startDate,
            endDate,
            handleStartChange,
            handleEndChange
        }}>
            {children}
        </RidePopularityReportContext.Provider>
    )

}

export function CategoryPopularitySummary() {
    const {categoryData, startDate, endDate, handleStartChange, handleEndChange} = useContext(RidePopularityReportContext);

    return (
        <>
            <div className="d-flex flex-row justify-content-center">
                <div className="d-flex flex-column justify-content-center mx-4">
                    <label style={{textAlign: "center"}}>Run date from:</label>
                    <input style={{width: 200}} onChange={handleStartChange} type="date" id="startDate" defaultValue={startDate}/>
                </div>
                <div className="d-flex flex-column justify-content-center mx-4">
                    <label style={{textAlign: "center"}}>Run date to:</label>
                    <input style={{width: 200}} onChange={handleEndChange} type="date" id="endDate" defaultValue={endDate}/>
                </div>
            </div>
            <Table className={styles.reportstable} striped bordered size="sm">
                <thead>
                <tr>
                    <th>Ride Category</th>
                    <th>Total Runs</th>
                    <th>Total Riders</th>
                    <th>Average Riders Per Run</th>
                    <th>Average Ride Capacity Within Category</th>
                    <th>Average Percent of Capacity Seated</th>
                </tr>
                </thead>
                <tbody>
                {categoryData.map((entry, i) => (
                    <tr key={i}>
                        <td>{entry.Category}</td>
                        <td>{entry.Total_Runs}</td>
                        <td>{entry.Total_Riders}</td>
                        <td>{entry.AVG_Riders_Per_Run}</td>
                        <td>{entry.AVG_Ride_Capacity}</td>
                        <td>{entry.AVG_Percent_Capacity_Filled}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
}

export function RidePopularitySummary() {
    const {rideData, startDate, endDate, handleStartChange, handleEndChange} = useContext(RidePopularityReportContext);

    return (
        <>
            <div className="d-flex flex-row justify-content-center">
                <div className="d-flex flex-column justify-content-center mx-4">
                    <label style={{textAlign: "center"}}>Run date from:</label>
                    <input style={{width: 200}} onChange={handleStartChange} type="date" id="startDate" defaultValue={startDate}/>
                </div>
                <div className="d-flex flex-column justify-content-center mx-4">
                    <label style={{textAlign: "center"}}>Run date to:</label>
                    <input style={{width: 200}} onChange={handleEndChange} type="date" id="endDate" defaultValue={endDate}/>
                </div>
            </div>
            <Table className={styles.reportstable} striped bordered size="sm">
                <thead>
                <tr>
                    <th>Ride ID</th>
                    <th>Ride Name</th>
                    <th>Ride Category</th>
                    <th>Number of Runs</th>
                    <th>Number of Riders</th>
                    <th>Average Riders Per Run</th>
                    <th>Ride Capacity</th>
                    <th>Average Percent of Capacity Seated</th>
                    <th>Fewest Riders in a Run</th>
                    <th>Most Riders in a Run</th>
                </tr>
                </thead>
                <tbody>
                {rideData.map((entry, i) => (
                    <tr key={i}>
                        <td>{entry.Ride_ID}</td>
                        <td>{entry.Ride_Name}</td>
                        <td>{entry.Category}</td>
                        <td>{entry.Number_Of_Runs}</td>
                        <td>{entry.Total_Riders}</td>
                        <td>{entry.AVG_Riders_Per_Run}</td>
                        <td>{entry.Ride_Capacity}</td>
                        <td>{entry.AVG_Percent_Capacity_Filled}</td>
                        <td>{entry.Fewest_Riders_On_Run}</td>
                        <td>{entry.Most_Riders_On_Run}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
}

export function IndividualRuns() {
    const {runsData, startDate, endDate, handleStartChange, handleEndChange} = useContext(RidePopularityReportContext);
    const [displayData, setDisplayData] = useState(runsData);

    const applyFilters = useCallback(() => {
        console.log(startDate);
        let newData = runsData;
        newData = newData.filter((item) => new Date(item.RideTime) > new Date(startDate));
        newData = newData.filter((item) => new Date(item.RideTime) <= new Date(endDate));
        setDisplayData(newData);
    }, [runsData, startDate, endDate]);

    useEffect(() => {
        applyFilters();
    }, [startDate, endDate, applyFilters]);

    return (
        <>
            <div className="d-flex flex-row justify-content-center">
                <div className="d-flex flex-column justify-content-center mx-4">
                    <label style={{textAlign: "center"}}>Run date from:</label>
                    <input style={{width: 200}} onChange={handleStartChange} type="date" id="startDate" defaultValue={startDate}/>
                </div>
                <div className="d-flex flex-column justify-content-center mx-4">
                    <label style={{textAlign: "center"}}>Run date to:</label>
                    <input style={{width: 200}} onChange={handleEndChange} type="date" id="endDate" defaultValue={endDate}/>
                </div>
            </div>
            <Table className={`${styles.reportstable} mt-4`} striped bordered size="sm">
                <thead>
                <tr>
                    <th>Date/Time</th>
                    <th>Ride ID</th>
                    <th>Ride Name</th>
                    <th>Ride Operator's Employee ID</th>
                    <th>Ride Operator Name</th>
                    <th>Number of Seats Filled</th>
                    <th>Ride Capacity</th>
                </tr>
                </thead>
                <tbody>
                {displayData.map((entry, i) => (
                    <tr key={i}>
                        <td>{new Date(entry.RideTime).toLocaleString()}</td>
                        <td>{entry.RideID}</td>
                        <td>{entry.RideName}</td>
                        <td>{entry.OperatorID}</td>
                        <td>{entry.OperatorName}</td>
                        <td>{entry.NumofRiders}</td>
                        <td>{entry.Capacity}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
}

export function RidePopularityReportsView() {
    const [reportType, setReportType] = useState("category-summary");

    const handleChange = useCallback((event) => {
        setReportType(event.target.value);
    }, []);

    return (
        <RidePopularityReportContextProvider>
            <Card className={`mx-5 mt-4 ${styles.scroll} `}>
                <div className="d-flex flex-column">
                    <img className="w-25 m-auto mt-4" src={MainLogo} alt="Main Logo"/>
                    <hr className={styles.divider}/>
                    <div className="m-auto mt-4">
                        Report Type
                    </div>
                    <select onChange={handleChange} name="report-type" id="rtype" className="w-auto m-auto">
                        <option value="category-summary">Category Popularity Summary</option>
                        <option value="ride-summary">Ride Popularity Summary</option>
                        <option value="runs">Individual Runs</option>
                    </select>
                </div>
                <div className="m-4">
                    {reportType === "category-summary" && <CategoryPopularitySummary/>}
                    {reportType === "ride-summary" && <RidePopularitySummary/>}
                    {reportType === "runs" && <IndividualRuns/>}
                </div>
            </Card>
        </RidePopularityReportContextProvider>
    )
}