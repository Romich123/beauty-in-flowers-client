import Basket from "./pages/Basket"
import Admin from "./pages/Admin"
import { ADMIN_ROUTE, BASKET_ROUTE, FLOWER_ROUTE, LOGIN_ROUTE, ORDERS_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "./utils/consts"
import Shop from "./pages/Shop"
import Auth from "./pages/Auth"
import FlowerPage from "./pages/FlowerPage"
import UserOrders from "./pages/UserOrders"

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: BASKET_ROUTE,
        Component: Basket
    },
]

export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        Component: Shop
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: FLOWER_ROUTE + '/:id',
        Component: FlowerPage
    },
    {
        path: ORDERS_ROUTE,
        Component: UserOrders
    },
]