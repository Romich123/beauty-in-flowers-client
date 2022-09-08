import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Container, Row, Image, Button, Form, InputGroup, Nav, Stack } from "react-bootstrap";
import { Context } from "..";
import ConfirmOrder from "../components/modals/ConfirmOrder";
import CreateOrder from "../components/modals/CreateOrder";
import { getInfo } from "../http/flowerApi";
import { getBasket, setFlowersInBasket } from "../http/userApi";
import { FLOWER_ROUTE, SHOP_ROUTE } from "../utils/consts";

const Basket = () => {
    const { loading } = useContext(Context)

    const [basket, setBasket] = useState([])
    const [deliveryCost, setDeliveryCost] = useState(0)
    const [showCreate, setShowCreate] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const flowersCost = basket.reduce((summ, basketFlower) => summ + basketFlower.flower.price * basketFlower.count, 0)

    const overallCost = flowersCost + (flowersCost === 0 ? 0 : deliveryCost)

    const formatPrice = (price) => {
        return (price + "").split("").reverse().join("").replace(/(\d{3})/g, "$1 ").split("").reverse().join("").replace(/^ /, "") + " ₽"
    }

    const formatCount = (count) => {
        const countUnits = count % 10

        return "За " + count + ((count >= 10 && count < 20) || countUnits > 4 ? " букетов" : countUnits === 1 ? " букет" : " букета")
    }

    useEffect(() => {
        const loadedOne = () => {
            loading.removeLoadingOperation()
        }

        loading.addLoadingOperation()
        loading.addLoadingOperation()
        
        getBasket().then(data => setBasket(data.filter(basketFlower => basketFlower.flower))).finally(loadedOne)
        getInfo().then(data => setDeliveryCost(data.deliveryCost)).finally(loadedOne)
    }, [setBasket, loading])

    const setCount = (index, count) => {
        if (!Number(count)) {
            return
        }

        count = Math.max(count, 1)
        basket[index].count = count
        setBasket([].concat(basket))
        setFlowersInBasket(basket)
    }

    const incrementCount = (index) => {
        setCount(index, basket[index].count + 1)
    }

    const decrementCount = (index) => {
        const count = basket[index].count - 1
        if (count === 0) {
            removeFlower(index)
        } else {
            setCount(index, count)
        }
    }

    const removeFlower = (index) => {
        basket.splice(index, 1)
        setBasket([].concat(basket))
        setFlowersInBasket(basket)
    }
    
    const onCreatedOrder = () => {
        setShowConfirm(true)
    }

    return (
        <Container style={{marginTop:10}}>
            <Row>
                <Col lg={9} className="mb-2">
                    <Card style={{ padding:10 }}>
                        <div style={{fontWeight:"bold", fontSize:22, borderBottom:"1px solid #ccc", marginBottom:5}}>
                            Корзина
                        </div>

                        {basket.length > 0 ?
                        basket.map((basketFlower, index) => 
                            <Row className="mb-2" key={basketFlower.id}>
                                <Col xs={"auto"} style={{paddingRight:0}}>
                                    <Image width={81} style={{aspectRatio: 3/4, borderRadius: 5}} src={process.env.REACT_APP_API_URL + basketFlower.flower.previewImg}/>
                                </Col>

                                <Col xs={4}>
                                    <Stack>
                                        <Nav.Link style={{fontWeight:"bold"}} href={FLOWER_ROUTE + '/' + basketFlower.flower.id}>
                                            {basketFlower.flower.name}
                                        </Nav.Link>

                                        <div style={{height:84, width:"calc(100%)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace:"nowrap"}}>
                                            {basketFlower.flower.description}
                                        </div>
                                    </Stack>
                                </Col>

                                <Col xs={2} className="d-flex justify-content-center align-items-center" style={{minWidth:139}}>
                                    <InputGroup>
                                        <Button style={{minWidth:36.95}} variant={basketFlower.count === 1 ? "outline-danger" : "outline-secondary"} onClick={e => decrementCount(index)}> 
                                            {basketFlower.count === 1 ? "×" : "-"}
                                        </Button>
                                        <Form.Control className="text-center" value={basketFlower.count} onChange={e => setCount(index, e.target.value)}/>
                                        <Button variant="outline-success" onClick={e => incrementCount(index)}> 
                                            + 
                                        </Button>
                                    </InputGroup>
                                </Col>

                                <Col>
                                    <div className="d-flex justify-content-end align-items-end" style={{height:"60%", fontSize:22, fontWeight:"bold"}}>
                                        {formatPrice(basketFlower.flower.price * basketFlower.count)}
                                    </div>
                                    <div className="float-end" style={{color:"gray", fontSize:14, marginTop:-10}}>
                                        {formatCount(basketFlower.count)}
                                    </div>
                                </Col>
                            </Row>
                        )
                        :
                        <div key={0}>
                            Тут пусто, но вы можете это исправить <Nav.Link style={{display:"inline", color:"#0d6efd", textDecoration:"underline"}} href={SHOP_ROUTE}> здесь</Nav.Link>
                        </div>
                        }
                    </Card>
                </Col>

                <Col lg={3}>
                    <Card className="p-3" style={{height:177}}>
                        <Stack>
                            <Stack direction="horizontal" gap={3}>
                                <div style={{fontSize:24, fontWeight:"bold"}}>
                                    Итого
                                </div>

                                <div className="ms-auto" style={{fontSize:22, fontWeight:"bold"}}>
                                    {formatPrice(overallCost)}
                                </div>
                            </Stack>

                            <Stack direction="horizontal" gap={3}>
                                <div style={{color:"gray", fontSize:16}}>
                                    Букеты, {basket.reduce((summ, basketFlower) => summ + basketFlower.count, 0)} шт.
                                </div>

                                <div className="ms-auto" style={{color:"gray", fontSize:18}}>
                                    {formatPrice(flowersCost)}
                                </div>
                            </Stack>
                            
                            <Button variant="success" style={{marginTop:"auto"}} disabled={basket.length === 0} onClick={() => setShowCreate(true)}>
                                Заказать
                            </Button>
                        </Stack>
                    </Card>
                </Col>
            </Row>

            <CreateOrder show={showCreate} onHide={() => setShowCreate(false)} onConfirmed={onCreatedOrder}/>
            <ConfirmOrder show={showConfirm} onHide={() => window.location.reload()}/>
        </Container>
    );
}

export default Basket