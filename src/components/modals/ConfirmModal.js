import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmModal = ({show, onHide, message, onConfirmed, onCanceled}) => {
    return (
        <Modal show={show} onHide={onHide} size="md" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Подтвердите действие
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <span>
                    {message}
                </span>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={"outline-danger"} onClick={() => { onCanceled(); onHide() }}>Отмена</Button>
                <Button variant={"outline-success"} onClick={() => { onConfirmed(); onHide() }}>Подтвердить</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmModal