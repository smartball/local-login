import * as express from 'express'

export default class Router {
    constructor() {
        this.app = express.Router()
    }
}