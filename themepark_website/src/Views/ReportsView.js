import { MaintenanceDataBox } from "../Maintenance/MaintenanceEdit";
import { Container, Tabs, Tab } from "react-bootstrap";
import { EventTicketsReportsView } from "./EventTicketsReports";

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
            </Tabs>
        </Container>
    );

}