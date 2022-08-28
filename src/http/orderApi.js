import { $authHost } from ".";

export const getAllOrders = async () => {
    try {
        const {data} = await $authHost.get('api/order')
        return data
    } catch (e) {
        return e
    }
}

export const deleteOrder = async (id) => {
    try {
        const {data} = await $authHost.delete('api/order/' + id)
        return data
    } catch (e) {
        return e
    }
}

export const updateStatus = async (id, status) => {
    try {
        const {data} = await $authHost.post('api/order/setstatus/' + id, { status: status })
        return data
    } catch (e) {
        return e
    }
}