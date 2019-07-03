import * as constants from '../utils/constants'
import mongoose from 'mongoose'

export default class Database {
  constructor() {

  }

  async connect() {
    const { DB } = constants.ENV
    try {
      (mongoose).Promise = Promise
      const url = `mongodb://${DB.HOST}:${DB.PORT}/${DB.NAME}`
      console.log(url)
      const connect = mongoose.connect(url, { user: DB.USER, pass: DB.PASSWORD, useNewUrlParser: true })
      console.debug('Connected database')
    } catch (err) {
      console.debug(`Can't connect database`)
      throw new Error(`Can't connect database`)
    }
  }
}