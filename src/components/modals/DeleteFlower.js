import React, { useContext, useState, useEffect } from "react";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import { Context } from "../..";
import { deleteFlower, getAllFlowers } from "../../http/flowerApi";


const DeleteFlower = ({show, onHide}) => {
    const {flower} = useContext(Context)

    const [flowerToDelete, setFlowerToDelete] = useState({});
    
    useEffect(() => {
        getAllFlowers().then(data => flower.setFlowers(data.rows))
    })
    
    const hide = () => {
        setFlowerToDelete({})
        onHide()
    }

    const confirmDelete = () => {
        if (!flowerToDelete || !flowerToDelete.id)
        {
            alert('Укажите букет')
            return
        }

        deleteFlower(flowerToDelete).then(data => {
            const index = flower.flowers.indexOf(flowerToDelete);
            const flowers = [].concat(flower.flowers)
            flowers.splice(index, 1);

            flower.setFlowers(flowers)
            hide()
        })
    }

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Удалить букет
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Dropdown>
                        <Dropdown.Toggle>{ flowerToDelete.name || "Выберите цветок"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {flower.flowers.map((flower, index) =>
                                <Dropdown.Item onClick={() => setFlowerToDelete(flower)} key={index} >
                                    {flower.name}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="outline-danger" onClick={hide}>Отмена</Button>
                <Button variant="outline-success" onClick={confirmDelete}>Удалить</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteFlower