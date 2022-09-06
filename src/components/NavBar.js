import React, { useContext, useState } from "react";
import { Context } from "..";
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Container from "react-bootstrap/Container"
import { BASKET_ROUTE, LOGIN_ROUTE, ORDERS_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";
import ConfirmModal from "./modals/ConfirmModal";

const NavBar = observer(() => {
    const { user } = useContext(Context)

    const [showConfirm, setShowConfirm] = useState(false)

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        localStorage.setItem('token', "")
    }

    return (        
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href={SHOP_ROUTE}>Beauty In Flowers</Navbar.Brand>
                    { user.isAuth ?
                        <Nav className="ml-auto">
                            <Nav.Link href={ORDERS_ROUTE}>Заказы</Nav.Link>
                            <Nav.Link href={BASKET_ROUTE}>Корзина</Nav.Link>
                            <Nav.Link onClick={() => setShowConfirm(true)}>Выйти</Nav.Link>
                        </Nav>
                        :
                        <Nav className="ml-auto">
                            <Nav.Link href={LOGIN_ROUTE} className="ml-2">Войти</Nav.Link>
                            <Nav.Link href={REGISTRATION_ROUTE}>Зарегистрироваться</Nav.Link>
                        </Nav>
                    }
            </Container>
            <ConfirmModal show={showConfirm} onHide={() => setShowConfirm(false)} message="Вы действительно хотите выйти?" onConfirmed={() => logOut()} onCanceled={() => {}} />
        </Navbar>
    );
})

export default NavBar