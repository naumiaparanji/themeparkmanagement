import { useContext, useState, useEffect, useCallback } from "react";
import { EventsEditContext, addEvent } from "./EventsEditContext";
import { Modal, Button } from "react-bootstrap";
import { EventForm } from "./EventForm";

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