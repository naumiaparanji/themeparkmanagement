import {Container, Tab, Tabs} from "react-bootstrap";
import {EventTicketsReportsView} from "./EventTicketsReports";
import {RidePopularityReportsView} from "./RidePopularityReports";
import {MaintenanceReportsView} from "./MaintenanceReports";

export function ReportsView() {

    return (
        <Container>
            <Tabs
                defaultActiveKey="maintenance"
            >
                <Tab eventKey="maintenance" title="Maintenance Status">
                    <MaintenanceReportsView/>
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