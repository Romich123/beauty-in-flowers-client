import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Context } from ".";
import { check, getDeliveredFlowers } from "./http/userApi";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar"
import Loading from "./components/Loading";

const App = observer(() => {
    const {user, loading} = useContext(Context)

    useEffect(() => {
        const loadUser = () => {
            loading.addLoadingOperation()

            check().then(data => {
                loading.removeLoadingOperation()
    
                user.setUser(data)
                user.setIsAuth(true)
            }).catch(err => {
                loading.removeLoadingOperation()
                user.setIsAuth(false) 
            })
        }

        const loadDeliveredFlowers = () => {
            loading.addLoadingOperation()

            getDeliveredFlowers().then(data => {
                loading.removeLoadingOperation()
                user.setDeliveredFlowers(data)
            }).catch(err => {
                loading.removeLoadingOperation()
            })
        }

        loadUser()
        loadDeliveredFlowers()
    }, [loading])

    return (
        <BrowserRouter>
            <NavBar/>
            <div style={loading.loading ? {display: "none"} : {} }>
                <AppRouter/>
            </div>
            <Loading show={loading.loading}/>
        </BrowserRouter>
    );
}) 

export default App;