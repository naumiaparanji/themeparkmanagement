import { useContext, useState, useEffect, useCallback } from "react";
import { EventsEditContext, addEvent } from "./EventsEditContext";
import { Modal, Button } from "react-bootstrap";
import { EventForm } from "./EventForm";

export function NewEventModal({show, onHide}) {
    const {resetNewEventEditState, isNewEventValid, refreshEvents, refreshCategories, newEventEditState, setNewEventEditState } = useContext(EventsEditContext);
    const [isActivated, setIsActivated] = useState(false);

    useEffect(() => {
        if(show && !isActivated) {
            setIsActivated(true);
            resetNewEventEditState();
        } else if (!show && isActivated) {
            setIsActivated(false);
        }
    }, [show, isActivated, resetNewEventEditState]);
    
    const successAction = useCallback(() => {
        refreshEvents();
        refreshCategories();
        onHide();
    }, [refreshEvents, refreshCategories, onHide]);

    const handleSubmit = useCallback(() => {
        addEvent(newEventEditState, successAction, (e) => console.log(e));
    }, [newEventEditState, successAction]);

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>New Event</Modal.Header>
            <Modal.Body>
            <EventForm formState={newEventEditState} setFormState={setNewEventEditState}/>
            </Modal.Body>
            <Modal.Footer>
                <Button disabled={!isNewEventValid} onClick={handleSubmit}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}