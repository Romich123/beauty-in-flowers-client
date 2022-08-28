import React, { useState } from "react";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { convertToOrder } from "../../http/userApi";

const CreateOrder = ({onHide, show, onConfirmed}) => {
    const [street, setStreet] = useState("")
    const [house, setHouse] = useState("")
    const [comment, setComment] = useState("")
    const [phone, setPhone] = useState()
    const [alertMessage, setAlertMessage] = useState({ display: false, message: ""})

    const hide = () => {
        setStreet("")
        setHouse("")
        setPhone("")
        setComment("")
        setAlertMessage({ display: false, message: ""})
        onHide()
    }

    const alert = (message) => {
        setAlertMessage({ display: true, message: message })
    }

    const confirm = () => {
        if (street === "") {
            alert('Введите улицу')
            return
        }

        if (house === "") {
            alert('Введите дом')
            return
        }

        if (!phone || phone.toString().length !== 11)
        {
            alert('Неверный телефон')
            return
        }

        convertToOrder(street + ' ' + house, phone)
        onConfirmed()
        hide()
    }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Оформление заказа
                </Modal.Title>
            </Modal.Header>

            <Alert show={alertMessage.display} variant='danger'>
                <div>
                    {alertMessage.message}
                </div>
            </Alert>

            <Modal.Body className="pt-1">
                <Form>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label style={{fontWeight:"bold"}}>Улица</Form.Label>
                                <Form.Control type="text" value={street} onChange={e => setStreet(e.target.value)}/>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label style={{fontWeight:"bold"}}>Дом</Form.Label>
                                <Form.Control type="text" value={house} onChange={e => setHouse(e.target.value)}/>
                            </Form.Group>
                        </Col>
                        <Form.Text style={{marginTop:-12}} id="passwordHelpBlock" muted>
                            Доставка работает только по Новосибирску!
                        </Form.Text>
                    </Row>
                    
                    <Form.Label style={{fontWeight:"bold"}}>Контактный телефон</Form.Label>
                    <PhoneInput inputClass="phone-input" country={'ru'} value={phone} onChange={setPhone}/>

                    <Form.Label style={{fontWeight:"bold", marginTop: 6}}>Комментарий к заказу</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Можете оставить это поле пустым" value={comment} onChange={e => setComment(e.target.value)}/>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="outline-danger" onClick={hide}>Отмена</Button>
                <Button variant="outline-success" onClick={confirm}>Заказать</Button>
            </Modal.Footer>`
        </Modal>
    );
}

export default CreateOrder