import {useCallback, useContext, useEffect, useState} from "react";
import {deleteEvent, EventsEditContext, updateEvent} from "./EventsEditContext";
import {EventForm} from "./EventForm";
import {EventConfirmModal} from "./EventConfirmModal";
import {AccordionContext, Button, Spinner} from "react-bootstrap";

export function EventEditBody({event, eventKey}) {
    const {
        applyEventToFormState,
        formEditState,
        setFormEditState,
        isFormStateValid,
        refreshAll
    } = useContext(EventsEditContext);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [saveDate, setSaveDate] = useState(null);
    const [inProgress, setInProgress] = useState(false);
    const {activeEventKey} = useContext(AccordionContext);

    useEffect(() => {
        if (activeEventKey === eventKey) {
            applyEventToFormState(event);
        }
    }, [applyEventToFormState, activeEventKey, eventKey, event]);

    const onSubmitSuccess = useCallback(() => {
        refreshAll();
        setInProgress(false);
        setSaveDate("Event saved at " + new Date().toLocaleTimeString('en-US', {timeStyle: 'short'}));
    }, [refreshAll, setSaveDate]);

    const onSubmitFailure = useCallback((e) => {
        console.log(e);
        setInProgress(false);
        setSaveDate("Failed to save event");
    }, []);

    const handleSubmit = useCallback(() => {
        setInProgress(true)
        updateEvent(formEditState, onSubmitSuccess, onSubmitFailure);
    }, [formEditState, onSubmitSuccess, onSubmitFailure]);

    const handleDelete = useCallback(() => {
        deleteEvent(formEditState, refreshAll, (e) => console.log(e));
    }, [formEditState, refreshAll]);

    const handleToggleActive = useCallback(() => {
        let payload = {...event};
        payload.Deleted = Number(!Boolean(payload.Deleted));
        updateEvent(payload, onSubmitSuccess, onSubmitFailure);
    }, [event, onSubmitFailure, onSubmitSuccess]);

    const handleConfirmDelete = useCallback(() => setConfirmDelete(true), []);
    const handleConfirmClose = useCallback(() => setConfirmDelete(false), []);

    return (
        <div>
            <EventForm formState={formEditState} setFormState={setFormEditState}/>
            <hr/>
            <div className="d-flex justify-content-left">
                <Button disabled={!isFormStateValid} onClick={handleSubmit}>
                    {inProgress ?
                        (<Spinner
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />) : "Save"}
                </Button>
                <Button className="mx-3" onClick={handleToggleActive}>
                    {event.Deleted ? "Inactive" : "Active"}
                </Button>
                <Button variant="danger" onClick={handleConfirmDelete}>
                    Delete
                </Button>
                {saveDate && (<p className="my-auto mx-3">{saveDate}</p>)}
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