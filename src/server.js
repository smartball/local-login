import Express from './config/express'

export default class Server {
    constructor() {
        this.app = new Express()
        this.app.listen()
    }

    static init() {
        new Server()
    }
}