import {EventsEditContextProvider} from "./EventsEditContext";
import {EventsTopBar} from "./EventsTopBar";
import {EventsEditList} from "./EventsEditList";
import {Col, Container, Row} from "react-bootstrap";

export function EventsEditView() {
    return (
        <EventsEditContextProvider>
            <Container fluid>
                <Col>
                    <Row>
                        <EventsTopBar/>
                    </Row>
                    <Row className="h-100 overflow-auto">
                        <Container>
                            <EventsEditList/>
                        </Container>
                    </Row>
                </Col>
            </Container>
        </EventsEditContextProvider>
    );
}