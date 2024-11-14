import { MaintenanceDataBox } from "../Maintenance/MaintenanceEdit";
import { Container, Tabs, Tab } from "react-bootstrap";
import { EventTicketsReportsView } from "./EventTicketsReports";
import { RidePopularityReportsView } from "./RidePopularityReports";

export function ReportsView() {

    return (
        <Container>
            <Tabs
                defaultActiveKey="maintenance"
            >
                <Tab eventKey="maintenance" title="Maintenance Status">
                    <MaintenanceDataBox isReport = {true} />
                </Tab>
                <Tab eventKey="event-tickets" title="Event Sales">
                    <EventTicketsReportsView/>
                </Tab>
                <Tab eventKey="ride-popularity" title="Ride Popularity">
                    <RidePopularityReportsView/>
                </Tab>
            </Tabs>
        </Container>
    );

}