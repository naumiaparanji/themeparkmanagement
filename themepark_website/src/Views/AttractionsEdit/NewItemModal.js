import { Button, Modal } from "react-bootstrap";
import { ItemEditContextProvider, ItemEditContext } from "./ItemEditContext";
import { EditContext } from "./EditContext";
import { useEffect, useState, useContext, useCallback } from "react";
import { api } from "../../App";

function addItem(path, editState, idKey, onSuccess, onFailure) {
    let payload = {...editState};
    delete payload.OpenInput;
    delete payload.CloseInput;
    delete payload.Deleted;
    delete payload[idKey];
    api.post(path, payload)
    .then((response) => {
        onSuccess(response);
    })
    .catch((e) => {
        onFailure(e);
    });
}

function ContextModal({show, onHide, children}) {
    const { editState, item } = useContext(ItemEditContext);
    const { refreshItems, datapath, idKey } = useContext(EditContext);
    const [ isValid, setIsValid ] = useState(false);

    useEffect(() => {
        const checkObj = editState || item;
        console.log(checkObj);
        setIsValid(Object.entries(checkObj).every(([k, v]) => k === "Deleted"? true : Boolean(v)));
    }, [editState, item]);

    const onSubmitSuccess = useCallback(() => {
        refreshItems();
        onHide();
    }, [onHide, refreshItems]);

    const handleSubmit = useCallback(() => {
        const submitObj = editState || item;
        addItem(datapath, submitObj, idKey, onSubmitSuccess, (e) => console.log(e));
    }, [datapath, editState, idKey, item, onSubmitSuccess]);

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>New Item</Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer>
                <Button disabled={!isValid} onClick={handleSubmit}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}

export function NewItemModal({show, onHide, children}) {
    return (
        <ItemEditContextProvider item={{Location: ""}}>
            <ContextModal show={show} onHide={onHide}>
                {children}
            </ContextModal>
        </ItemEditContextProvider>
    );
}