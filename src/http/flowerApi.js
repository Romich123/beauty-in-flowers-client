import { $authHost, $host } from ".";

export const createTag = async (tag) => {
    try {
        const {data} = await $authHost.post('api/tag', tag)
        return data
    } catch (e) {
        return e
    }
}

export const getTags = async () => {
    try {
        const {data} = await $host.get('api/tag')
        return data

    } catch (e) {
        return e
    }
}

export const createFlower = async (flower) => {
    try {
        const {data} = await $authHost.post('api/flower', flower)
        return data
    } catch (e) {
        return e
    }
}

export const deleteFlower = async (flower) => {
    try {
        const {data} = await $authHost.delete('api/flower/' + flower.id)
        return data
    } catch (e) {
        return e
    }
}

export const getAllFlowers = async () => {
    try {
        const {data} = await $host.get('api/flower')
        return data
    } catch (e) {
        return e
    }
}

export const getFlowers = async (tags, page, limit, minPrice, maxPrice) => {
    try {
        const {data} = await $host.get('api/flower', { params: { 
            tags: tags, 
            page: page, 
            limit: limit, 
            minPrice: minPrice, 
            maxPrice:maxPrice }})
        return data
    } catch (e) {
        console.log(e)
        return e
    }
}

export const getOneFlower = async (id) => {
    try {
        const {data} = await $host.get('api/flower/' + id)
        return data
    } catch (e) {
        return e
    }
}

export const deleteTag = async (tag) => {
    try {
        const {data} = await $authHost.delete('api/tag/' + tag.id)
        return data
    } catch (e) {
        return e
    }
}

export const getInfo = async () => {
    try {
        const {data} = await $authHost.get('api/info/')
        return data
    } catch (e) {
        return e
    }
}