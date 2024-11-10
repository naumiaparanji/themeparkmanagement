import { useCallback } from "react";
import { Modal, Button } from "react-bootstrap";

export function EventConfirmModal({show, title, body, confirmText, cancelText, confirmCallback, onClose, confirmVariant, cancelVariant}) {
    
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