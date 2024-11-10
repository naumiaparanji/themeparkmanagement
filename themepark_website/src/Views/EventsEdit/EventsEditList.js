import { useContext } from "react";
import { EventsEditContext } from "./EventsEditContext";
import { EventEditBody } from "./EventEditBody";
import { Accordion } from "react-bootstrap";

export function EventsEditList() {
    const { displayEvents } = useContext(EventsEditContext);
    return (
        <div>
        {
            displayEvents? (
                <Accordion defaultActiveKey={-1} className="accordion-flush">
                    {displayEvents.map((event, i) => (
                        <Accordion.Item eventKey={i} key={i}>
                            <Accordion.Header className="py-0">
                                <div className="w-100 d-flex justify-content-between align-items-center">
                                    <center>
                                        {event.EventName}
                                    </center>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <EventEditBody event={event} eventKey={i}/>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
             ) : (
                "Loading..."
             )
        }
        </div>
    );
}