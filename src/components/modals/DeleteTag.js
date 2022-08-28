import React, { useContext, useState, useEffect } from "react";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import { Context } from "../..";
import { deleteTag, getTags } from "../../http/flowerApi";


const DeleteTag = ({show, onHide}) => {
    const {flower} = useContext(Context)

    const [tag, setTag] = useState({});
    
    useEffect(() => {
        getTags().then(data => flower.setTags(data))
    })
    
    const hide = () => {
        setTag({})
        onHide()
    }

    const confirmDelete = () => {
        if (!tag || !tag.id)
        {
            alert('Укажите тэг')
            return
        }

        deleteTag(tag).then(data => {
            const index = flower.tags.indexOf(tag);
            const tags = [].concat(flower.tags)
            tags.splice(index, 1);

            flower.setTags(tags)
            hide()
        })
    }

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Удалить тэг
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Dropdown>
                        <Dropdown.Toggle>{ tag.name || "Выберите тэг"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {flower.tags.map((tag, index) =>
                                <Dropdown.Item onClick={() => setTag(tag)} key={index} >
                                    {tag.name}
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

export default DeleteTag