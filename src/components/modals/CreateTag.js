import { AxiosError } from "axios";
import React, { useContext, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Context } from "../..";
import { createTag } from "../../http/flowerApi";

const CreateTag = ({show, onHide}) => {
    const {flower} = useContext(Context)

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const hide = () => {
        setName('')
        setDescription('')
        onHide()
    }

    const addTag = () => {
        if (name === "") {
            alert("Имя не может быть пустым")
        }
        createTag({name: name, description: description}).then(data => {

            if (data instanceof AxiosError)
            {
                alert('Произошла ошибка (Скорее всего букет с таким именем уже существует) ' + data)
                console.log(data)
                return
            }

            flower.setTags(flower.tags.concat(data))
            hide()
        })
    }

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить тэг
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control placeholder="Введите название (Не может быть пустым)" value={name} onChange={e => setName(e.target.value)}/>
                    <Form.Control className="mt-2" placeholder="Введите описание (Может быть пустым)" value={description} onChange={e => setDescription(e.target.value)}/>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={"outline-danger"} onClick={hide}>Отмена</Button>
                <Button variant={"outline-success"} onClick={addTag}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateTag