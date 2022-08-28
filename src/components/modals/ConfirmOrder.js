import { AxiosError } from "axios";
import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { confirmOrder } from "../../http/userApi";

const ConfirmOrder = ({onHide, show}) => {
    const [code, setCode] = useState("")
    const [alertMessage, setAlertMessage] = useState({ display: false, message: ""})

    const hide = () => {
        setAlertMessage({ display: false, message: ""})
        setCode("")
        onHide()
    }

    const alert = (message) => {
        setAlertMessage({ display: true, message: message })
    }

    const confirm = () => {
        if (code === "") {
            alert("Введите код!")
            return
        }

        confirmOrder(code).then(data => {
            if (data instanceof AxiosError) {
                alert("Неверный код!")
                return
            }

            hide()
        }).catch(err => {
            alert("Неверный код!")
        })
    }

    return (
        <Modal style={{paddingBottom:0}} show={show} onHide={onHide} backdrop="static" centered>
            <Modal.Header>
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
                    <Form.Label style={{fontWeight:"bold"}}>Введите код с почты</Form.Label>
                    <Form.Control type="text" value={code} onChange={e => setCode(e.target.value)}></Form.Control>
                    <Form.Text>Если вы не подтвердите заказ сейчас, то он будет отменен через 10 минут!</Form.Text>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="outline-success" onClick={confirm}>Подтвердить</Button>
            </Modal.Footer>`
        </Modal>
    );
}

export default ConfirmOrder