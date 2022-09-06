import { $authHost, $host } from ".";
import jwt_decode from "jwt-decode"

export const registration = async (email, password) => {
    const {data} = await $host.post('api/user/registration', {email, password})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const addToBasket = async (flower) => {
    const {data} = await $authHost.post('api/basket/f/' + flower.id)
    return data
}

export const getBasket = async () => {
    const {data} = await $authHost.get('api/basket/')
    return data
}

export const setFlowersInBasket = async (flowers) => {
    const {data} = await $authHost.post('api/basket/', { flowers: flowers })
    return data
}

export const convertToOrder = async (address, phone, selfDelivery, comment) => {
    const {data} = await $authHost.post('api/basket/toorder', { address: address, comment: comment, phone: phone, selfDelivery: selfDelivery })
    return data
}

export const confirmOrder = async (code) => {
    const {data} = await $host.post('api/order/confirm', { code: code })
    return data
}

export const getAllUserOrders = async () => {
    const {data} = await $authHost.get('api/order/usersorders')
    return data
}

export const getDeliveredFlowers = async () => {
    const {data} = await $authHost.get('api/user/flowers')
    return data
}

export const sendFeedBack = async (rating, comment, flowerId) => {
    const {data} = await $authHost.post('api/feedback', { comment: comment, rating: rating, flowerId: flowerId })
    return data
}

export const deleteFeedback = async (flowerId) => {
    const {data} = await $authHost.delete('api/feedback/' + flowerId )
    return data
}