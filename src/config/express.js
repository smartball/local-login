import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
const PORT = process.env.PORT || 9000;
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

  listen(){
    this.useLogin()
    this.express.listen(PORT, () => {
      console.log(`App listening on port ${PORT}!`);
    })
  }
}