import { makeAutoObservable } from 'mobx'

export default class LoadingStore {
    constructor() {
        this._loadingOperationsCount = 0

        makeAutoObservable(this)
    }

    addLoadingOperation() {
        this._loadingOperationsCount++
    }

    removeLoadingOperation() {
        this._loadingOperationsCount--
    }

    get loading() {
        return this._loadingOperationsCount > 0
    }
}