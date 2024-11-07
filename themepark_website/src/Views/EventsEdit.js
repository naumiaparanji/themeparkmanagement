import { useEffect, useState, useContext } from "react";
import { api } from "../App";
import { Accordion, AccordionContext, Button, Form, Container, InputGroup, Modal, FloatingLabel } from "react-bootstrap";

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

function ConfirmModal({show, title, body, confirmText, cancelText, confirmCallback, onClose, confirmVariant, cancelVariant}) {
    return (
        <Modal show={show} animation={false} onHide={onClose}>
            <Modal.Header closeButton>
                {title}
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
                <Button variant={cancelVariant || "secondary"} onClick={onClose}>{cancelText}</Button>
                <Button variant={confirmVariant || "primary"} onClick={() => {confirmCallback(); onClose();}}>{confirmText}</Button>
            </Modal.Footer>
        </Modal>
    );
}

export function EventEditForm({event, eventKey, refreshCallback}) {
    const [formState, setFormState] = useState({
        ...event,
        ...formatEventTime24H(event.EventDateTime, event.EventDuration)
    });
    const [canSubmit, setCanSubmit] = useState(Object.entries(formState).every(([k, v]) => k === "Deleted"? true : Boolean(v)));
    const [confirmDelete, setConfirmDelete] = useState(false);
    const { activeEventKey } = useContext(AccordionContext);

    const isCurrentEventKey = activeEventKey === eventKey;

    const resetContent = () => {
        setFormState({
            ...event,
            ...formatEventTime24H(event.EventDateTime, event.EventDuration)
        });
    }

    useEffect(() => {
        if (isCurrentEventKey) resetContent();
    }, [isCurrentEventKey]);

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
            refreshCallback();
        })
        .catch((e) => {
            console.log(e);
        })
    }

    

    const handleDelete = () => {
        api.delete(`/events/${event.EventID}`)
        .then((response) => {
            refreshCallback();
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
                <Button variant="danger" className="mx-3" onClick={() => setConfirmDelete(true)}>
                    Delete
                </Button>
            </div>
            <ConfirmModal show={confirmDelete} onClose={() => setConfirmDelete(false)} 
                title="Confirm Delete"
                body={`You are about to delete "${event.EventName}". This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                confirmVariant="danger"
                confirmCallback={handleDelete}
            />
        </div>
    );
}

export function EventEditComponent({event, eventKey, refreshCallback}) {
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
                <EventEditForm event={event} eventKey={eventKey} refreshCallback={refreshCallback}/>
            </Accordion.Body>
        </Accordion.Item>
    );
}

export function EventsEditList({eventsList, refreshCallback}) {

    return (
        <div>
        {
            eventsList? (
                <Accordion defaultActiveKey={-1} className="accordion-flush">
                    {eventsList.map((event, i) => (
                        <EventEditComponent eventKey={i} key={i} event={event} refreshCallback={refreshCallback}/>
                    ))}
                </Accordion>
             ) : (
                "Loading..."
             )
        }
        </div>
    );
}

export function EventsTopBar({events, displayEvents, setDisplayEvents}) {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(-1);

    const refreshCategories = () => {
        api.get("/events/categories")
        .then((response) => {
            setCategories(response.data.categories);
        })
        .catch((e) => console.log(e));
    }

    useEffect(() => {
        refreshCategories();
        setDisplayEvents(events);
    }, [events]);

    useEffect(() => {
        if (activeCategory < 0)
            setDisplayEvents(events);
        else {
            setDisplayEvents(events.filter((event) => event.EventType === categories[activeCategory].EventType));
        }
    }, [activeCategory])

    return (
        <div>
        <Form className="d-flex flex-row mt-4">
            <Form.Control placeholder="Search" className="h-100"/>
            <Form.Select className="w-10" onChange={(event) => setActiveCategory(Number(event.target.value))}>
                <option value={-1} key={-1}>All</option>
                {categories.map((category, i) => (
                    <option value={i} key={i}>{category.EventType}</option>
                ))}
            </Form.Select>
        </Form>
        <hr/>
        </div>
    );
}

export function EventsEditView() {
    const [events, setEvents] = useState([]);
    const [displayEvents, setDisplayEvents] = useState([]);

    const refreshContent = () => {
        api.get("/events")
        .then((response) => {
            setEvents(response.data.events);
        })
        .catch((e) => console.log(e));
    }

    useEffect(() => {
        refreshContent();
    }, []);
    
    return (
        <div className="d-flex flex-row">
        <Container className="d-flex flex-column">
            <EventsTopBar events={events} displayEvents={displayEvents} setDisplayEvents={setDisplayEvents}/>
            <div className="overflow-scroll h-100">
                <EventsEditList eventsList={displayEvents} refreshCallback={refreshContent}/>
            </div>
        </Container>
        </div>
    );
}