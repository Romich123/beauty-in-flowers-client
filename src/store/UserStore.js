import { makeAutoObservable } from 'mobx'

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._deliveredFlowers = []
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }

    setUser(user) {
        this._user = user
    }

    setDeliveredFlowers(flowers) {
        this._deliveredFlowers = flowers
    }

    get isAuth() {
        return this._isAuth
    }

    get user() {
        return this._user
    }
    
    get deliveredFlowers() {
        return this._deliveredFlowers
    }
}