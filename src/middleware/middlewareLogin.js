import express from 'express'
import schema from 'schm'
import passport from 'passport'
import moment from 'moment'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { responseMessage } from '../utils'

export class MiddleWareLogin {
  constructor() {
    this.app = express.Router()
    this.app.post('/', this.initApp, this.checkParam)
  }

  initApp = async (req, res, next) => {
    try {
      const publicKEY = fs.readFileSync(path.join(__dirname, '../utils/constants/key/public.key'))
      const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: publicKEY,
        algorithms: ['RS256'],
      }
      const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
        const timeNow = moment().format('x')
        const checkExpire = payload.expires_in - timeNow
        console.log(checkExpire)
        if (checkExpire > 0) {
          if (payload.accessToken === "test") {
            return done(null, true)
          }
        } else if (checkExpire < 0) {
          return done(null, 'expires')
        } else {
          return done(null, false)
        }
      })

      passport.use(jwtAuth)
      passport.authenticate('jwt', { session: false }, function (err, status, info) {
        console.log('status', status)
        console.log(err, info)
        if (status) {
          if (status === 'expires') {
            res.status(401).send(responseMessage(401, { errorMessage: 'The access token is expires.' }))
          } else {
            res.status(200).send(responseMessage(200, { accessToken: req.headers.authorization.split(' ')[1] }))
          }
        } else {
          next()
        }
      })(req, res, next)
    } catch (err) {
      console.log(err)
      next()
    }
  }

  checkParam = async (req, res, next) => {
    let messageErrList = []
    let msgRequire = ''
    const loginAccessSchema = schema({
      username: { type: String, required: true },
      password: { type: String, required: true }
    })
    try {
      await loginAccessSchema.validate(req.body)
      next()
    } catch (err) {
      err.map(element => {
        const fieldErr = element.message.split(' ')
        messageErrList.push(fieldErr[0])
      })
      msgRequire = `${messageErrList.toString().replace(/,/g, ' | ')} is required`
      res.status(404).send(responseMessage(404, { errorMessage: msgRequire }))
    }
  }
}