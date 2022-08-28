import { makeAutoObservable } from 'mobx'

export default class FlowerStore {
    constructor() {
        this._tags = []
        this._flowers = []
        this._flowersCount = 0
        this._maxPrice = 0

        makeAutoObservable(this)
    }

    setTags(tags) {
        this._tags = tags
    }

    setFlowers(flowers) {
        this._flowers = flowers
    }

    setFlowersCount(num) {
        this._flowersCount = num
    }

    setMaxPrice(maxPrice) {
        this._maxPrice = Math.max(maxPrice, this._maxPrice)
    }

    get maxPrice() {
        return this._maxPrice
    }

    get flowersCount() {
        return this._flowersCount
    }

    get flowers() {
        return this._flowers
    }

    get tags() {
        return this._tags
    }
}