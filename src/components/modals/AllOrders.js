import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Form, Container, InputGroup, Dropdown, Accordion, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAllOrders, updateStatus } from "../../http/orderApi";
import { FLOWER_ROUTE } from "../../utils/consts";

const AllOrders = ({show, onHide}) => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        getAllOrders().then(data => {
            setOrders(data)
        })
    }, [])

    const setStatus = (index, status) => {
        orders[index].status = status
        updateStatus(orders[index].id, status)
        setOrders([].concat(orders))
    }


    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Текущие заказы
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Container>
                    <Accordion alwaysOpen>
                        {orders.map((order, index) => 
                            <Accordion.Item key={index} eventKey={index}>
                                <Accordion.Header style={{fontWeight:"bold", fontSize:18}}>
                                    Заказ #{order.id}
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Form>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text xs="2" style={{fontWeight:"bold"}}>
                                                Почта
                                            </InputGroup.Text>
                                            <Form.Control readOnly defaultValue={order.user.email} />
                                        </InputGroup>
                                
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text xs="2" style={{fontWeight:"bold"}}>
                                                Телефон
                                            </InputGroup.Text>
                                            <Form.Control readOnly defaultValue={order.phone} />
                                        </InputGroup>

                                        <InputGroup className="mb-1">
                                            <InputGroup.Text xs="2" style={{fontWeight:"bold"}}>
                                                Адрес
                                            </InputGroup.Text>
                                            <Form.Control as="textarea" readOnly defaultValue={order.address} />
                                        </InputGroup>

                                        <InputGroup className="mb-1">
                                            <InputGroup.Text xs="2" style={{fontWeight:"bold"}}>
                                                Комментарий пользователя
                                            </InputGroup.Text>
                                            <Form.Control as="textarea" readOnly defaultValue={order.comment} />
                                        </InputGroup>

                                        <div style={{fontWeight:"bold"}}>
                                            Цветы:
                                        </div>

                                        <Row style={{marginLeft:0}}>
                                            {order.orderFlowers.map((orderFlower, index) =>  
                                                <Col key={index} style={{paddingLeft:0, paddingRight:4}} xs={"auto"}>
                                                    <Button onClick={() => navigate(FLOWER_ROUTE + "/" + orderFlower.flowerId)}>
                                                        {orderFlower.flower.name +" " + orderFlower.count} шт.
                                                    </Button>
                                                </Col>
                                            )}
                                        </Row>
                                    </Form>
                                    
                                    <Stack direction="horizontal" className="mt-2">
                                        <Col style={{fontWeight:"bold", marginRight:5}} xs="auto">
                                            Текущий статус:
                                        </Col>
                                        
                                        <Col xs="auto">
                                            <Dropdown>
                                                <Dropdown.Toggle>{order.status}</Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    {["Подтвержден", "Готовится", "Готов", "Доставлен"].map((item) => 
                                                        <Dropdown.Item key={item} onClick={() => {setStatus(index, item)}}>
                                                            {item}
                                                        </Dropdown.Item>
                                                    )}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Col>
                                    </Stack>

                                </Accordion.Body>
                            </Accordion.Item>
                        )}
                    </Accordion>
                </Container>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AllOrders