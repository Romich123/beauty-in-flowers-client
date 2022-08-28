import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import AllOrders from "../components/modals/AllOrders";
import CreateFlower from "../components/modals/CreateFlower";
import CreateTag from "../components/modals/CreateTag";
import DeleteFlower from "../components/modals/DeleteFlower";
import DeleteTag from "../components/modals/DeleteTag";

const Admin = () => {
    const [tagVisible, setTagVisible] = useState(false)
    const [flowerVisible, setFlowerVisible] = useState(false)
    const [tagDeleteVisible, setTagDeleteVisible] = useState(false)
    const [flowerDeleteVisible, setFlowerDeleteVisible] = useState(false)
    const [ordersVisible, setOrdersVisible] = useState(false)

    return (
        <Container className="d-flex flex-column">

            <Button className="mt-4" onClick={() => setTagVisible(true)}>
                Добавить тэг
            </Button>

            <Button className="mt-4" onClick={() => setFlowerVisible(true)}>
                Добавить букет
            </Button>
            
            <Button className="mt-4" onClick={() => setTagDeleteVisible(true)}>
                Удалить тэг
            </Button>

            <Button className="mt-4" onClick={() => setFlowerDeleteVisible(true)}>
                Удалить букет
            </Button>
            
            <Button className="mt-4" onClick={() => setOrdersVisible(true)}>
                Посмотреть все заказы
            </Button>

            <CreateTag show={tagVisible} onHide={() => setTagVisible(false)}/>
            <CreateFlower show={flowerVisible} onHide={() => setFlowerVisible(false)}/>
            <DeleteTag show={tagDeleteVisible} onHide={() => setTagDeleteVisible(false)}/>
            <DeleteFlower show={flowerDeleteVisible} onHide={() => setFlowerDeleteVisible(false)}/>
            <AllOrders show={ordersVisible} onHide={() => setOrdersVisible(false)}/>
        </Container>
    );
}

export default Admin