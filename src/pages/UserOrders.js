import { AxiosError } from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Nav, Image, Stack, Badge, Accordion, OverlayTrigger, Tooltip, Button, Form, InputGroup } from "react-bootstrap";
import { Context } from "..";
import { deleteOrder } from "../http/orderApi";
import { confirmOrder, getAllUserOrders } from "../http/userApi";
import { FLOWER_ROUTE, SHOP_ROUTE } from "../utils/consts";

const UserOrders = () => {
    const { loading } = useContext(Context)

    const [orders, setOrders] = useState({rows: []})
    const [confirmCode, setConfirmCode] = useState("")

    const formatCount = (count) => {
        const countUnits = count % 10

        return count + ((count >= 10 && count < 20) || countUnits > 4 ? " букетов" : countUnits === 1 ? " букет" : " букета")
    }

    useEffect(() => {
        const loadedOne = () => {
            loading.removeLoadingOperation()
        }

        loading.addLoadingOperation()
        
        const loadOrders = () => {
            getAllUserOrders().then(data => {
                if (data instanceof AxiosError) {
                    loadOrders()
                    return
                }

                setOrders(data)
                loadedOne()
            })
        }

        loadOrders()
    }, [loading])

    const sendConfirmCode = () => {
        confirmOrder(confirmCode).then(data => {
            if (data instanceof AxiosError) {
                return
            }
        }).catch(e => {
            console.log(e)
        })
    }

    const cancelOrder = (index) => {
        console.log(orders, index)
        deleteOrder(orders.rows[index].id)
        orders.rows = orders.rows.filter((order, ind) => ind !== index)
        setOrders(orders)
    }
    
    return (
        <Container style={{marginTop:10}}>
            <Card style={{ padding:10 }}>
                <div style={{fontWeight:"bold", fontSize:22, borderBottom:"1px solid #ccc", marginBottom:5}}>
                    Ваши заказы
                </div>

                <Accordion alwaysOpen>
                {orders.count > 0 ?
                    orders.rows.map((order, index) => 
                    <Accordion.Item key={index} eventKey={index}>
                        <Accordion.Header>
                            <span style={{fontWeight:"bold"}}>
                                {`Заказ #${order.id}`}
                            </span>

                            <div style={{marginLeft:5}}>
                                <Badge bg={order.confirmCode === "" ? "success" : "secondary"}>{order.status}</Badge> 
                            </div>
                            {order.selfDelivery.toLowerCase().startsWith("да") ?
                                <div style={{marginLeft:5}}>
                                    <Badge bg={"success"}>Самовывоз</Badge> 
                                </div>
                                :
                                <></>
                            }
                        </Accordion.Header>
                        <Accordion.Body>
                            <Stack>
                                <div>
                                    В заказ входит <span>{formatCount(order.orderFlowers.reduce((summ, orderFlower) => orderFlower.count + summ, 0))}</span>:
                                </div>

                                <Stack direction="horizontal">
                                    {order.orderFlowers.map((orderFlower, index) =>  {
                                        const renderTooltip = (props) => (
                                            <Tooltip {...props}>
                                                <Image width={"100%"} style={{aspectRatio: 3/4, borderRadius: 5, marginBottom: 7, opacity:1}} src={process.env.REACT_APP_API_URL + orderFlower.flower.previewImg}/>
                                            </Tooltip>
                                        );

                                        return (
                                            <div key={index}>
                                                <span>
                                                    {index === 0 ? "" : ", "}
                                                </span>

                                                <OverlayTrigger placement="bottom" delay={{ show: 100, hide: 100 }} overlay={renderTooltip}>
                                                    <a style={{textDecoration:"underline", color:"black"}} href={FLOWER_ROUTE + '/' + orderFlower.flower.id}>
                                                        {orderFlower.flower.name}
                                                    </a>
                                                </OverlayTrigger>

                                                <span>
                                                    {" " + orderFlower.count} шт.
                                                </span>
                                            </div>
                                    )})}
                                </Stack>

                                {order.selfDelivery.toLowerCase().startsWith("да") ?
                                    <div>
                                        Самовывоз {new Date(order.selfDelivery.substring(2)).toLocaleDateString()} в {new Date(order.selfDelivery.substring(2)).toTimeString().substring(0, 8)} по адресу Красный проспект 102/1
                                    </div>
                                    :
                                    <div>
                                        Доставка по адресу {order.address}
                                    </div>
                                }

                                <Row className="mt-2">
                                    {order.confirmCode === "" ?
                                        <></>
                                        :
                                        <Col style={{paddingRight:0}} xs={"auto"}>
                                            <InputGroup>
                                                <Form.Control value={confirmCode} onChange={e => setConfirmCode(e.target.value)} placeholder="Код с почты"/>
                                                <Button variant="success" onClick={sendConfirmCode}> Подтвердить </Button>
                                            </InputGroup>
                                        </Col>
                                    }
                                    
                                    {order.status !== "Подтвержден" ?
                                        <></>
                                        :
                                        <Col className="ml-auto">
                                            <Button variant="secondary" onClick={() => cancelOrder(index)}> Отменить </Button>
                                        </Col>
                                    }
                                </Row>
                            </Stack>
                        </Accordion.Body>
                    </Accordion.Item>
                )
                :
                    <div>
                        Тут пусто, но вы можете это исправить <Nav.Link style={{display:"inline", color:"#0d6efd", textDecoration:"underline"}} href={SHOP_ROUTE}> здесь</Nav.Link>
                    </div>
                }
                </Accordion>
            </Card>
        </Container>
    );
}

export default UserOrders