import React, { useEffect, useState, useContext, useCallback } from "react";
import { api } from "../App";
import { Accordion, AccordionContext, Button, Form, Container, InputGroup, Modal, Row, Col, Navbar } from "react-bootstrap";

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

function prepareEventPayload(event) {
    const {startDate, duration} = generateEventStartAndDuration(event.startTime, event.endTime);
    let payload = {...event};
    payload.EventDateTime = startDate;
    payload.EventDuration = duration;
    delete payload.startTime;
    delete payload.endTime;
    return payload;
}

function updateEvent(event, onSuccess, onFailure) {
    let payload = prepareEventPayload(event);
    api.put(`/events/${event.EventID}`, payload)
    .then((response) => {
        onSuccess(response);
    })
    .catch((e) => {
        onFailure(e);
    });
}

function addEvent(event, onSuccess, onFailure) {
    let payload = prepareEventPayload(event);
    delete payload.EventID;
    delete payload.Deleted;
    api.post(`/events`, payload)
    .then((response) => {
        onSuccess(response);
    })
    .catch((e) => {
        onFailure(e);
    });
}

function deleteEvent(event, onSuccess, onFailure) {
    api.delete(`/events/${event.EventID}`)
    .then((response) => {
        onSuccess(response);
    })
    .catch((e) => {
        onFailure(e);
    })
}

const defaultFormState = {
    EventName: "",
    EventType: "",
    EventDateTime: "1970-01-01T06:00:00Z",
    EventDuration: 720,
    EventDesc: "",
    EventRestrictions: "",
    EventAgeLimit: 1,
    Location: "",
    Capacity: 1,
    startTime: "",
    endTime: ""
};

export const EventsEditContext = React.createContext();

// Contains all shared state variables and functions
// Also manages logic between component states
export function EventsEditContextProvider({children}) {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState(-1);
    const [displayEvents, setDisplayEvents] = useState([]);
    const [formEditState, setFormEditState] = useState(defaultFormState);
    const [isFormStateValid, setIsFormStateValid] = useState(false);

    const refreshEvents = useCallback(() => {
        api.get("/events")
        .then((response) => {
            setEvents(response.data.events);
        })
        .catch((e) => console.log(e));
    }, []);

    const refreshCategories = useCallback(() => {
        api.get("/events/categories")
        .then((response) => {
            setCategories(response.data.categories);
        })
        .catch((e) => console.log(e));
    }, []);

    const refreshAll = useCallback(() => {
        refreshEvents();
        refreshCategories();
    }, [refreshEvents, refreshCategories]);
    
    const resetFormEditState = useCallback(() => {
        setFormEditState({
            ...defaultFormState,
            ...formatEventTime24H(defaultFormState.EventDateTime, defaultFormState.EventDuration)
        });
    }, []);

    const applyEventToFormState = useCallback((event) => {
        setFormEditState({
            ...event,
            ...formatEventTime24H(event.EventDateTime, event.EventDuration)
        });
    }, []);

    useEffect(() => {
        refreshEvents();
        refreshCategories();
    }, [refreshCategories, refreshEvents]);

    useEffect(() => {
        let newEvents = events;
        if (activeCategory >= 0) {
            newEvents = events.filter((event) => event.EventType === categories[activeCategory]);
        }
        if (search) {
            newEvents = newEvents.filter((event) => event.EventName.toLowerCase().indexOf(search.toLowerCase()) !== -1);
        }
        setDisplayEvents(newEvents);
    }, [activeCategory, search, categories, events]);

    useEffect(() => {
        setIsFormStateValid(Object.entries(formEditState).every(([k, v]) => k === "Deleted"? true : Boolean(v)));
    }, [formEditState]);

    return (
        <EventsEditContext.Provider value={{
            events, 
            refreshEvents, 
            categories, 
            refreshCategories,
            refreshAll,
            search,
            setSearch,
            activeCategory,
            setActiveCategory,
            displayEvents,
            formEditState,
            setFormEditState,
            resetFormEditState,
            applyEventToFormState,
            isFormStateValid
        }}>
            {children}
        </EventsEditContext.Provider>
    );

}

export function EventForm() {
    const { formEditState, setFormEditState } = useContext(EventsEditContext);

    const handleChange = useCallback((e) => {
        let { name, value } = e.target;
        setFormEditState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, [setFormEditState]);

    return (
        <Form>
            <Form.Text className="mx-0">Name</Form.Text>
            <Form.Control className="mx-0" placeholder="Event name" value={formEditState.EventName} name="EventName" onChange={handleChange}/>
            <Form.Text className="mx-0">Type</Form.Text>
            <Form.Control className="mx-0" placeholder="Event type" value={formEditState.EventType} name="EventType" onChange={handleChange}/>
            <Form.Text className="mx-0">Description</Form.Text>
            <Form.Control className="mx-0" as="textarea" value={formEditState.EventDesc} name="EventDesc" onChange={handleChange}/>
            <Form.Text className="mx-0">Restrictions</Form.Text>
            <Form.Control className="mx-0" placeholder="Event restrictions" value={formEditState.EventRestrictions} name="EventRestrictions" onChange={handleChange}/>
            <Form.Text className="mx-0">Age Limit</Form.Text>
            <Form.Control className="mx-0" type="number" value={formEditState.EventAgeLimit} name="EventAgeLimit" onChange={handleChange} min={1}/>
            <Form.Text className="mx-0">Location</Form.Text>
            <Form.Control className="mx-0" value={formEditState.Location} name="Location" onChange={handleChange}/>
            <Form.Text className="mx-0">Capacity</Form.Text>
            <Form.Control className="mx-0" type="number" value={formEditState.Capacity} name="Capacity" onChange={handleChange} min={1}/>
            <Form.Text className="mx-0">Time</Form.Text>
            <InputGroup>
                <Form.Control className="mx-0" type="time" value={formEditState.startTime} name="startTime" onChange={handleChange}/>
                <Form.Control className="mx-0" type="time" value={formEditState.endTime} name="endTime" onChange={handleChange}/>
            </InputGroup>
        </Form>
    );
}

function ConfirmModal({show, title, body, confirmText, cancelText, confirmCallback, onClose, confirmVariant, cancelVariant}) {
    
    const handleConfirm = useCallback(() => {
        confirmCallback(); 
        onClose();
    }, [confirmCallback, onClose]);
    
    return (
        <Modal show={show} animation={false} onHide={onClose}>
            <Modal.Header closeButton>
                {title}
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
                <Button variant={cancelVariant || "secondary"} onClick={onClose}>{cancelText}</Button>
                <Button variant={confirmVariant || "primary"} onClick={handleConfirm}>{confirmText}</Button>
            </Modal.Footer>
        </Modal>
    );
}

export function EventEditForm({event, eventKey}) {
    const { applyEventToFormState, formEditState, isFormStateValid, refreshAll } = useContext(EventsEditContext);
    const [ confirmDelete, setConfirmDelete ] = useState(false);
    const { activeEventKey } = useContext(AccordionContext);
    
    useEffect(() => {
        if (activeEventKey === eventKey) {
            applyEventToFormState(event);
        }
    }, [applyEventToFormState, activeEventKey, eventKey, event]);

    const handleSubmit = useCallback(() => {
        updateEvent(formEditState, refreshAll, (e) => console.log(e));
    }, [formEditState, refreshAll]);
    
    const handleDelete = useCallback(() => {
        deleteEvent(formEditState, refreshAll, (e) => console.log(e));
    }, [formEditState, refreshAll]);

    const handleConfirmDelete = useCallback(() => setConfirmDelete(true), []);

    const handleConfirmClose = useCallback(() => setConfirmDelete(false), []);

    return (
        <div>
            <EventForm/>
            <hr/>
            <div className="d-flex justify-content-left">
                <Button disabled={!isFormStateValid} onClick={handleSubmit}>
                    Save
                </Button>
                <Button variant="danger" className="mx-3" onClick={handleConfirmDelete}>
                    Delete
                </Button>
            </div>
            <ConfirmModal show={confirmDelete} onClose={handleConfirmClose} 
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
                <EventEditForm event={event} eventKey={eventKey}/>
            </Accordion.Body>
        </Accordion.Item>
    );
}

export function EventsEditList() {
    const { displayEvents } = useContext(EventsEditContext);
    return (
        <div>
        {
            displayEvents? (
                <Accordion defaultActiveKey={-1} className="accordion-flush">
                    {displayEvents.map((event, i) => (
                        <EventEditComponent eventKey={i} key={i} event={event}/>
                    ))}
                </Accordion>
             ) : (
                "Loading..."
             )
        }
        </div>
    );
}



export function NewEventModal({show, onHide}) {
    const {resetFormEditState, isFormStateValid, refreshEvents, refreshCategories, formEditState} = useContext(EventsEditContext);
    const [isActivated, setIsActivated] = useState(false);

    useEffect(() => {
        if(show && !isActivated) {
            setIsActivated(true);
            resetFormEditState();
        } else if (!show && isActivated) {
            setIsActivated(false);
        }
    }, [show, isActivated, resetFormEditState]);
    
    const successAction = useCallback(() => {
        refreshEvents();
        refreshCategories();
        onHide();
    }, [refreshEvents, refreshCategories, onHide]);

    const handleSubmit = useCallback(() => {
        addEvent(formEditState, successAction, (e) => console.log(e));
    }, [formEditState, successAction]);

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>New Event</Modal.Header>
            <Modal.Body>
            <EventForm/>
            </Modal.Body>
            <Modal.Footer>
                <Button disabled={!isFormStateValid} onClick={handleSubmit}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}

export function EventsTopBar() {
    const {search, setSearch, setActiveCategory, categories} = useContext(EventsEditContext);
    const [createState, setCreateState] = useState(false);

    const handleHide = useCallback(() => setCreateState(false), []);
    const handleAddEvent = useCallback(() => setCreateState(true), []);

    return (
        <>
        <Navbar fixed="top">
            <Container fluid>
                <Form className="w-100">
                    <InputGroup className="d-flex">
                        <Form.Control placeholder="Search" className="m-0" value={search} onChange={(event) => setSearch(event.target.value)}/>
                        <Form.Select style={{ minWidth: 'fit-content', maxWidth: 'fit-content'}} onChange={(event) => setActiveCategory(Number(event.target.value))}>
                            <option value={-1} key={-1}>All</option>
                            {categories.map((category, i) => (
                                <option value={i} key={i}>{category}</option>
                            ))}
                        </Form.Select>
                        <Button onClick={handleAddEvent}>Add new event</Button>
                    </InputGroup>
                </Form>
            </Container>
        </Navbar>
        <NewEventModal show={createState} onHide={handleHide} />
        <hr/>
        </>
    );
}

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