import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import dotenv from 'dotenv'
import * as router from '../routes'
import * as constants from '../utils/constants'
export default class Express {
  constructor() {
    this.express = express()
    this.express.use(bodyParser.urlencoded({ extended: false }))
    this.express.use(bodyParser.json())
    this.express.disable('etag')
  }
  
  useLogin() {
    this.express.post('/login', (req, res, next) => { res.status(200).send({ message: 'success' }) })
  }

  useRoute = () => {
    this.express.use('/', (req, res, next) => {
      next()
    }, router.Root)
  }

  listen() {
    this.useRoute()
    // this.useLogin()
    this.express.listen(process.env.PORT, () => {
      console.log(process.env.NODE_ENV)
      console.log(`App listening on port ${constants.ENV.PORT}!`);
    })
  }
}