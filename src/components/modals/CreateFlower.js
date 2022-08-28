import { AxiosError } from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Dropdown, Alert, InputGroup } from "react-bootstrap";
import { Context } from "../..";
import { createFlower, getAllFlowers, getTags } from "../../http/flowerApi";


const CreateFlower = ({show, onHide}) => {
    const {flower} = useContext(Context)

    const [selectedTags, setSelectedTags] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [files, setFiles] = useState([])
    const [alertMessage, setAlertMessage] = useState({display: false, message: ""})
    
    useEffect(() => {
        getTags().then(data => flower.setTags(data))
        getAllFlowers().then(data => flower.setFlowers(data.rows))
    })
    
    const hide = () => {
        setName('')
        setDescription('')
        setPrice(0)
        setSelectedTags([])
        setFiles(undefined)
        onHide()
    }

    const addFlower = () => {
        if (name === "") {
            alert("Имя не может быть пустым")
            return
        }

        if (price === 0) {
            alert("Вы уверены что хотите продавать за 0 рублей?")
            return
        }

        if (!files || files.length === 0) {
            alert("Картинка обязательна")
            return
        }

        const tagIds = selectedTags.map(tag => tag.id)

        const formData = new FormData()
        formData.append('name', name)
        formData.append('description', description)
        formData.append('price', price)

        console.log(files)
        for (let i = 0; i < files.length; i++) {
            formData.append(`img`, files[i])
        }

        formData.append('tags', tagIds)

        createFlower(formData).then(data => {  

            if (data instanceof AxiosError)
            {
                alert('Произошла ошибка (Скорее всего букет с таким именем уже существует) ' + data)
                console.log(data)
                return
            }

            hide()
        })
    }

    const alert = (message) => {
        setAlertMessage({display: true, message: message})
    }

    const tags = flower.tags.map(tag => { return {id: tag.id, name: tag.name } })

    const notSelectedTags = tags.filter(e => { return !selectedTags.map(tag => tag.id).includes(e.id); })

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить букет
                </Modal.Title>
            </Modal.Header>

            <Alert show={alertMessage.display} variant='danger'>
                <div>
                    {alertMessage.message}
                </div>
            </Alert>           

            <Modal.Body>
                <Form>
                    <Form.Control className="mb-3" type="text" placeholder="Введите название букета" value={name} onChange={e => setName(e.target.value)}/>
                    <Form.Control className="mb-3" type="text" placeholder="Введите описание букета" value={description} onChange={e => setDescription(e.target.value)}/>
                    <InputGroup className="mb-3">
                        <Form.Control type="number" placeholder="Введите цену букета" value={price} onChange={e => setPrice(Math.max(e.target.value, 0))}/>

                        <InputGroup.Text>{"₽"}</InputGroup.Text>
                    </InputGroup>
                    <Form.Label>Картинка</Form.Label>
                    <Form.Control className="mb-3" type="file" multiple onChange={e => setFiles(e.target.files)}/>
                    <Form.Label>Тэги</Form.Label>
                    <Row className="d-flex">
                        <Col xs={3}>
                            <Button disabled={notSelectedTags.length === 0} className="mb-2" variant="success" onClick={() => setSelectedTags(selectedTags.concat(notSelectedTags[0]))}>
                                Добавить Тэг
                            </Button>

                            <Button disabled={selectedTags.length === 0} variant="danger" onClick={() => { selectedTags.pop(); setSelectedTags([].concat(selectedTags))}}>
                                Удалить Тэг
                            </Button>
                        </Col>

                        <Col>
                            <Row>
                                {selectedTags.map((selectedTag, selectedIndex) => 
                                    <Col className="mb-1" style={{paddingLeft:0, paddingRight:4}} xs={"auto"} key={selectedIndex}>
                                        <Dropdown>
                                            <Dropdown.Toggle>{ selectedTags[selectedIndex].name || "Выберите тип"}</Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {notSelectedTags.map((tag, index) =>
                                                    <Dropdown.Item
                                                        onClick={() => { selectedTags[selectedIndex] = tag; setSelectedTags([].concat(selectedTags))}}
                                                        key={index}
                                                    >
                                                        {tag.name}
                                                    </Dropdown.Item>
                                                )}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                        
                    </Row>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="outline-danger" onClick={hide}>Отмена</Button>
                <Button variant="outline-success" onClick={addFlower}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateFlower