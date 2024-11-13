import { useContext, useState, useCallback, useEffect } from "react";
import { ItemEditContext } from "./ItemEditContext";
import { Button, Spinner } from "react-bootstrap";
import { EditContext } from "./EditContext";
import { EventConfirmModal } from "../EventsEdit/EventConfirmModal";
import { api } from "../../App";

function updateItem(path, editState, onSuccess, onFailure) {
    let payload = {...editState};
    delete payload.OpenInput;
    delete payload.CloseInput;
    api.put(path, payload)
    .then((response) => {
        onSuccess(response);
    })
    .catch((e) => {
        onFailure(e);
    });
}

function deleteItem(path, onSuccess, onFailure) {
    api.delete(path)
    .then((response) => {
        onSuccess(response);
    })
    .catch((e) => {
        onFailure(e);
    });
}

export function EditFooter() {
    const { editState, item } = useContext(ItemEditContext);
    const { refreshItems, nameKey, datapath, idKey } = useContext(EditContext);
    const [ inProgress, setInProgress ] = useState(false);
    const [ isValid, setIsValid ] = useState(false);
    const [ saveDate, setSaveDate ] = useState(null);
    const [ confirmDelete, setConfirmDelete ] = useState(false);

    const onSubmitSuccess = useCallback(() => {
        refreshItems();
        setInProgress(false);
        setSaveDate("Saved at " + new Date().toLocaleTimeString('en-US', {timeStyle:'short'}));
    }, [refreshItems, setSaveDate]);

    const onSubmitFailure = useCallback((e) => {
        console.log(e);
        setInProgress(false);
        setSaveDate("Failed to save");
    }, []);

    const handleSubmit = useCallback(() => {
        const submitObj = editState || item;
        setInProgress(true)
        updateItem(`${datapath}/${item[idKey]}`, submitObj, onSubmitSuccess, onSubmitFailure);
    }, [onSubmitSuccess, onSubmitFailure, datapath, idKey, item, editState]);

    const handleDelete = useCallback(() => {
        deleteItem(`${datapath}/${item[idKey]}?permanent=true`, refreshItems, (e) => console.log(e));
    }, [refreshItems, datapath, idKey, item]);

    const handleToggleActive = useCallback(() => {
        let payload = {...item};
        payload.Deleted = Number(!Boolean(payload.Deleted));
        updateItem(`${datapath}/${item[idKey]}`, payload, onSubmitSuccess, onSubmitFailure);
    }, [datapath, idKey, item, onSubmitFailure, onSubmitSuccess]);

    const handleConfirmDelete = useCallback(() => setConfirmDelete(true), []);
    const handleConfirmClose = useCallback(() => setConfirmDelete(false), []);

    useEffect(() => {
        const checkObj = editState || item;
        setIsValid(Object.entries(checkObj).every(([k, v]) => k === "Deleted"? true : Boolean(v)));
    }, [editState, item]);

    return (
        <>
            <hr/>
                <div className="d-flex justify-content-left">
                <Button disabled={!isValid} onClick={handleSubmit}>
                    {inProgress? 
                    (<Spinner
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />) : "Save"}
                </Button>
                <Button className="mx-3" onClick={handleToggleActive}>
                    {item.Deleted? "Inactive" : "Active"}
                </Button>
                <Button variant="danger" onClick={handleConfirmDelete}>
                    Delete
                </Button>
                {saveDate && (<p className="my-auto mx-3">{saveDate}</p>)}
                <EventConfirmModal show={confirmDelete} onClose={handleConfirmClose}
                    title="Confirm Delete"
                    body={`You are about to delete "${item[nameKey]}". This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    confirmVariant="danger"
                    confirmCallback={handleDelete}
                />
            </div>
        </>
    );
}