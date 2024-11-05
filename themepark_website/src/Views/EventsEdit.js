import { useEffect, useState } from "react";
import { api } from "../App";
import { Accordion, Button, Form, Container, InputGroup } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';

function formatEventTime24H(startDate, duration) {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000);

    const formatTo24H = (date) => {
        return date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "America/Chicago"
        });
    };

    const startTime = formatTo24H(startDateTime);
    const endTime = formatTo24H(endDateTime);

    return { startTime, endTime };
}

function generateEventStartAndDuration(startTime, endTime) {
    const currentDate = new Date();
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const startDate = new Date(currentDate);
    startDate.setHours(startHour, startMinute, 0, 0);
    const endDateTime = new Date(currentDate);
    endDateTime.setHours(endHour, endMinute, 0, 0);
    let duration = (endDateTime - startDate) / (60 * 1000);
    if (duration < 0) {
        duration += 24 * 60;
    }
    return { startDate, duration };
}

export function EventEditForm({event, path}) {
    const [formState, setFormState] = useState({
        ...event,
        ...formatEventTime24H(event.EventDateTime, event.EventDuration)
    });
    const [canSubmit, setCanSubmit] = useState(Object.entries(formState).every(([k, v]) => k === "Deleted"? true : Boolean(v)));

    const handleChange = (e) => {
        let { name, value } = e.target;
        const newState = {
            ...formState,
            [name]: value
        }
        setFormState(newState);
        setCanSubmit(Object.entries(newState).every(([k, v]) => k === "Deleted"? true : Boolean(v)));
    }

    const handleSubmit = () => {
        const {startDate, duration} = generateEventStartAndDuration(formState.startTime, formState.endTime);
        let payload = Object.assign({}, formState);
        payload.EventDateTime = startDate;
        payload.EventDuration = duration;
        delete payload.startTime;
        delete payload.endTime;
        api.put(`/events/${event.EventID}`, payload)
        .then((response) => {

        })
        .catch((e) => {
            console.log(e);
        })
    }

    const handleDelete = () => {
        api.delete(`/events/${event.EventID}`)
        .then((response) => {

        })
        .catch((e) => {
            console.log(e);
        })
    }

    return (
        <div>
            <Form>
                <Form.Text className="mx-0">Name</Form.Text>
                <Form.Control className="mx-0" placeholder="Event name" value={formState.EventName} name="EventName" onChange={handleChange}/>
                <Form.Text className="mx-0">Type</Form.Text>
                <Form.Control className="mx-0" placeholder="Event type" value={formState.EventType} name="EventType" onChange={handleChange}/>
                <Form.Text className="mx-0">Description</Form.Text>
                <Form.Control className="mx-0" as="textarea" value={formState.EventDesc} name="EventDesc" onChange={handleChange}/>
                <Form.Text className="mx-0">Restrictions</Form.Text>
                <Form.Control className="mx-0" placeholder="Event restrictions" value={formState.EventRestrictions} name="EventRestrictions" onChange={handleChange}/>
                <Form.Text className="mx-0">Age Limit</Form.Text>
                <Form.Control className="mx-0" type="number" value={formState.EventAgeLimit} name="EventAgeLimit" onChange={handleChange} min={1}/>
                <Form.Text className="mx-0">Location</Form.Text>
                <Form.Control className="mx-0" value={formState.Location} name="Location" onChange={handleChange}/>
                <Form.Text className="mx-0">Capacity</Form.Text>
                <Form.Control className="mx-0" type="number" value={formState.Capacity} name="Capacity" onChange={handleChange} min={1}/>
                <Form.Text className="mx-0">Time</Form.Text>
                <InputGroup>
                    <Form.Control className="mx-0" type="time" value={formState.startTime} name="startTime" onChange={handleChange}/>
                    <Form.Control className="mx-0" type="time" value={formState.endTime} name="endTime" onChange={handleChange}/>
                </InputGroup>
            </Form>
            <hr/>
            <div className="d-flex justify-content-left">
                <Button disabled={!canSubmit} onClick={handleSubmit}>
                    Save
                </Button>
                <Button variant="danger" className="mx-3" onClick={handleDelete}>
                    Delete
                </Button>
            </div>
        </div>
    );
}

export function EventEditComponent({event, eventKey}) {
    return (
        <Accordion.Item eventKey={eventKey}>
            <Accordion.Header className="py-0">
                <div className="w-100 d-flex justify-content-between align-items-center">
                    <center>
                        {event.EventName}
                    </center>
                    
                </div>
            </Accordion.Header>
            <Accordion.Body>
                <EventEditForm event={event} />
            </Accordion.Body>
        </Accordion.Item>
    );
}

export function EventsEditList({eventsList}) {
    return (
        <div>
        {
            eventsList? (
                <Container>
                <Accordion defaultActiveKey={-1} className="accordion-flush">
                    {eventsList.map((event, i) => (
                        <EventEditComponent eventKey={i} key={i} event={event}/>
                    ))}
                </Accordion>
                </Container>
             ) : (
                "Loading..."
             )
        }
        </div>
    );
}

export function EventsEditView() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        api.get("/events")
        .then((response) => {
            setEvents(response.data.events);
        })
        .catch((e) => console.log(e));
    }, []);
    
    return (
        <EventsEditList eventsList={events} />
    );
}