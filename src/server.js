import Database from './config/database'
import Express from './config/express'

export default class Server {
    constructor() {
        this.database = new Database()
        this.app = new Express()
        this.database.connect()
        this.app.listen()
    }

    static init() {
        new Server()
    }
}