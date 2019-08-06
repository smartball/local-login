import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import dotenv from 'dotenv'
import https from 'https'
import fs from 'fs'
import * as router from '../routes'
import * as constants from '../utils/constants'

// const opts = {
//   key: fs.readFileSync('/app/cert/server_key.pem')
//   , cert: fs.readFileSync('/app/cert/server_cert.pem')
//   , requestCert: true
//   , rejectUnauthorized: false
//   , ca: [fs.readFileSync('/app/cert/server_cert.pem')]
// }
export default class Express {
  constructor() {
    this.express = express()
    this.express.use(bodyParser.urlencoded({ extended: false }))
    this.express.use(bodyParser.json())
    this.express.disable('etag')
  }

  useRouteSSL = () => {
    this.express.use('/', (req, res, next) => {
      const cert = req.connection.getPeerCertificate()
      if (req.client.authorized) {
        // res.send(`Hello ${cert.subject.CN}, your certificate was issued by ${cert.issuer.CN}!`)
        next()
      } else if (cert.subject) {
        res.status(403)
          .send(`Sorry ${cert.subject.CN}, certificates from ${cert.issuer.CN} are not welcome here.`)
      } else {
        res.status(401)
          .send(`Sorry, but you need to provide a client certificate to continue.`)
      }
    }, router.Root)
  }

  useRoute = () => {
    this.express.use('/', (req, res, next) => {
      next()
    }, router.Root)
  }

  listen() {
    // this.useRouteSSL()
    // https.createServer(opts, this.express).listen(process.env.PORT, () => {
    //   console.log(process.env.NODE_ENV)
    //   console.log(`App listening on port ${constants.ENV.PORT}!`);
    // })

    this.useRoute()
    this.express.listen(process.env.PORT, () => {
      console.log(process.env.NODE_ENV)
      console.log(`App listening on port ${constants.ENV.PORT}!`);
    })
  }
}