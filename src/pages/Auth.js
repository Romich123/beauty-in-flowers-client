import React, { useState, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Container, Form, Card, Button } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import { Context }  from "..";
import { login, registration } from "../http/userApi";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { useNavigate } from 'react-router-dom';

const Auth = observer(() => {
    const {user} = useContext(Context)
    const navigate = useNavigate()
    const location = useLocation()
    const isLogin = location.pathname === LOGIN_ROUTE

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const click = async () => {
        try {
            let data
            
            if (isLogin)
            {
                data = await login(email, password)
            }
            else
            {
                data = await registration(email, password)
            }

            user.setUser(data)
            user.setIsAuth(true)
            navigate(SHOP_ROUTE)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{height: window.innerHeight - 54}}>
            <Card className="p-5" style={{width: 600}}>
                <h2 className="m-auto">
                    {isLogin ? 'Авторизация' : 'Регистрация'}
                </h2>
                <Form className="d-flex flex-column">
                    <Form.Control className="mt-3" placeholder="Введите email..." value={email} onChange={e => setEmail(e.target.value)}/>
                    <Form.Control className="mt-3" placeholder="Введите пароль..." type="password" value={password} onChange={e => setPassword(e.target.value)}/>
                    { isLogin ?
                        <div style={{fontSize: 14, color: "grey"}} className="pl-4">
                            Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink>
                        </div>
                        :
                        <div style={{fontSize: 14, color: "grey"}} className="pl-4">
                            Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
                        </div>
                    }
                    <Button className="mt-2" variant={"outline-success"} onClick={click}>
                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </Button>
                </Form>
            </Card>
        </Container>
    );
});

export default Auth