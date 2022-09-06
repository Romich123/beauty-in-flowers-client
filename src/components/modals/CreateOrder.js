import React, { useState } from "react";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { convertToOrder } from "../../http/userApi";

const CreateOrder = ({onHide, show, onConfirmed}) => {
    const [street, setStreet] = useState("")
    const [house, setHouse] = useState("")
    const [comment, setComment] = useState("")
    const [apartment, setApartment] = useState("")
    const [phone, setPhone] = useState()
    const [selfDelivery, setSelfDelivery] = useState({ enabled: false, day: "", time: "" })
    const [alertMessage, setAlertMessage] = useState({ display: false, message: ""})

    const hide = () => {
        setStreet("")
        setHouse("")
        setPhone("")
        setComment("")
        setApartment("")
        setAlertMessage({ display: false, message: ""})
        onHide()
    }

    const alert = (message) => {
        setAlertMessage({ display: true, message: message })
    }

    const confirm = () => {
        if (!phone || phone.toString().length !== 11)
        {
            alert('Неверный телефон')
            return
        }

        if (selfDelivery.enabled) {
            if (selfDelivery.day === "" || selfDelivery.day === "") {
                alert('Пожалуйста, выберите день и время.')
                return
            }

            const date = new Date(selfDelivery.day + ' ' + selfDelivery.time)

            if (date.getHours() < 9  || date.getHours() > 20) {
                alert('Мы выдаем заказы с 9:00 до 20:00, пожалуйста, выберите время в этом промежутке.')
                return
            }

            const timeFromNow = date - new Date()

            if (timeFromNow / 1000 / 60 / 60 <= 2) {
                alert('Врядли мы сможем успеть меньше, чем за 2 часа, пожалуйста, выберите время попозже.')
                return
            }

            convertToOrder(street + ' ' + house + ' ' + apartment, phone, "Да " + selfDelivery.day + ' ' + selfDelivery.time, comment)
        } else {
            if (street === "") {
                alert('Введите улицу')
                return
            }
    
            if (house === "") {
                alert('Введите дом')
                return
            }

            if (apartment === "") {
                alert('Введите квартиру')
                return
            }

            convertToOrder(street + ' ' + house + ' кв. ' + apartment, phone, "Нет", comment)
        }

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
                    <Form.Check 
                        reverse
                        checked={selfDelivery.enabled}
                        type="switch"
                        style={{fontWeight:"bold", borderBottom:"1px solid #dee2e6", paddingBottom:4}}
                        label="Самовывоз"
                        onChange={e => setSelfDelivery({ enabled: e.target.checked, day: "", time: "" })}
                    />

                    {selfDelivery.enabled ?
                        <Row key={"selfDeliverySettings"}>
                            <Col>
                                <Form.Group>
                                    <Form.Label style={{fontWeight:"bold"}}>Дата</Form.Label>
                                    <Form.Control type="date" value={selfDelivery.day} onChange={e => setSelfDelivery({ enabled: true, day: e.target.value, time: selfDelivery.time })}/>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group>
                                    <Form.Label style={{fontWeight:"bold"}}>Время</Form.Label>
                                    <input
                                        key={"selfDeliveryTimeInput"}
                                        type="time"
                                        step="1"
                                        className="form-control"
                                        placeholder="Time"
                                        value={selfDelivery.time}
                                        onChange={e => setSelfDelivery({ enabled: true, day: selfDelivery.day, time: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            
                            <Form.Text muted>
                                Мы находимся на Красном Проспекте 102/1
                            </Form.Text>
                        </Row>
                        :
                        <Row key={"normalDeliverySettings"}>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{fontWeight:"bold"}}>Улица</Form.Label>
                                    <Form.Control type="text" value={street} onChange={e => setStreet(e.target.value)}/>
                                </Form.Group>
                            </Col>

                            <Col style={{paddingLeft:0, paddingRight:0}}>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{fontWeight:"bold"}}>Дом</Form.Label>
                                    <Form.Control type="text" value={house} onChange={e => setHouse(e.target.value)}/>
                                </Form.Group>
                            </Col>
                            
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{fontWeight:"bold"}}>Квартира</Form.Label>
                                    <Form.Control type="text" value={apartment} onChange={e => setApartment(e.target.value)}/>
                                </Form.Group>
                            </Col>

                            <Form.Text style={{marginTop:-12}} id="passwordHelpBlock" muted>
                                Доставка работает только по Новосибирску!
                            </Form.Text>
                        </Row>
                    }
                    
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