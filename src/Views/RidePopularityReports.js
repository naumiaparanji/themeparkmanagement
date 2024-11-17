import React, {useCallback, useContext, useEffect, useState} from "react";
import { api } from "../App";
import { Card, Table } from "react-bootstrap";
import styles from "./EventTicketsReports.module.css"
import MainLogo from "../images/flagslogo.png";

const RidePopularityReportContext = React.createContext();

export function RidePopularityReportContextProvider({children}) {
    const [ categoryData, setCategoryData ] = useState([]);
    const [ rideData, setRideData ] = useState([]);
    const [ runsData, setRunsData ] = useState([]);

    const refreshCategorySummary = useCallback(() => {
        api.get("/ridePopularity/category")
            .then((res) => setCategoryData(res.data.rows))
            .catch((e) => console.log(e));
    }, []);

    const refreshRideSummary = useCallback(() => {
        api.get("/ridePopularity/ride")
            .then((res) => setRideData(res.data.rows))
            .catch((e) => console.log(e));
    }, []);

    const refreshRuns = useCallback(() => {
        api.get("/ridePopularity/runs")
            .then((res) => setRunsData(res.data.rows))
            .catch((e) => console.log(e));
    }, []);

    useEffect(() => {
        refreshCategorySummary();
        refreshRideSummary();
        refreshRuns();
    }, [refreshCategorySummary, refreshRideSummary, refreshRuns]);

    return (
        <RidePopularityReportContext.Provider value={{
            categoryData,
            rideData,
            runsData,
            refreshCategorySummary,
            refreshRideSummary,
            refreshRuns
        }}>
            {children}
        </RidePopularityReportContext.Provider>
    )

}

export function CategoryPopularitySummary() {
    const { categoryData } = useContext(RidePopularityReportContext);

    return (
        <>
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
    const { rideData } = useContext(RidePopularityReportContext);

    return (
        <>
            <Table className={styles.reportstable} striped bordered size="sm">
                <thead>
                <tr>
                    <th>Ride ID</th>
                    <th>Ride Name</th>
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
    const { runsData } = useContext(RidePopularityReportContext);
    const [ displayData, setDisplayData ] = useState(runsData);
    const [ fromDate, setFromDate ] = useState(null);
    const [ toDate, setToDate ] = useState(null);

    const applyFilters = useCallback(() => {
        console.log(fromDate);
        let newData = runsData;
        if (fromDate && !isNaN(fromDate.getTime())) {
            newData = newData.filter((item) => new Date(item.RideTime) > fromDate);
        }
        if (toDate && !isNaN(toDate.getTime())) {
            newData = newData.filter((item) => new Date(item.RideTime) <= toDate);
        }
        setDisplayData(newData);
    }, [runsData, fromDate, toDate]);

    const handleFromChange = useCallback((event) => {
        setFromDate(new Date(event.target.value));
    }, []);

    const handleToChange = useCallback((event) => {
        setToDate(new Date(event.target.value));
    }, []);

    useEffect(() => {
        applyFilters();
    }, [fromDate, toDate, applyFilters]);

    return (
        <>
            <div className="d-flex flex-row justify-content-center">
                <div className="d-flex flex-column justify-content-center mx-4">
                    <label style={{textAlign: "center"}}>Run date from:</label>
                    <input style={{width: 200}} onChange={handleFromChange} type="date" id="fromdate"/>
                </div>
                <div className="d-flex flex-column justify-content-center mx-4">
                    <label style={{textAlign: "center"}}>Run date to:</label>
                    <input style={{width: 200}} onChange={handleToChange} type="date" id="todate"/>
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
    const [ reportType, setReportType ] = useState("category-summary");

    const handleChange = useCallback((event) => {
        setReportType(event.target.value);
    }, []);

    return (
        <RidePopularityReportContextProvider>
            <Card className={`mx-5 mt-4 ${styles.scroll} `}>
                <div className="d-flex flex-column">
                    <img className="w-25 m-auto mt-4" src={MainLogo} alt="Main Logo" />
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