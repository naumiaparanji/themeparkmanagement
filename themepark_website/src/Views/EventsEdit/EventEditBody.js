import { useContext, useState, useCallback, useEffect } from "react";
import { EventsEditContext, updateEvent, deleteEvent } from "./EventsEditContext";
import { EventForm } from "./EventForm";
import { EventConfirmModal } from "./EventConfirmModal";
import { AccordionContext, Button } from "react-bootstrap";

export function EventEditBody({event, eventKey}) {
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
            <EventConfirmModal show={confirmDelete} onClose={handleConfirmClose} 
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