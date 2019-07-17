import express from 'express'
import schema from 'schm'
import passport from 'passport'
import moment from 'moment'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'

export class MiddleWareLogin {
  constructor() {
    this.app = express.Router()
    this.app.post('/', this.initApp, this.checkParam)
  }

  initApp = async (req, res, next) => {
    try {
      const SECRET = "MY_SECRET_KEY"
      const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: SECRET,//SECRETเดียวกับตอนencodeในกรณีนี้คือ MY_SECRET_KEY
      }
      const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
        const timeNow = moment().format('x')
        const checkExpire = payload.expires_in - timeNow
        if (checkExpire > 0) {
          if (payload.accessToken === "test") {
            return done(null, true)
          }
        }
        else {
          return done(null, false)
        }
      })

      passport.use(jwtAuth)
      passport.authenticate('jwt', { session: false }, function (err, status, info) {
        console.log('status', status)
        console.log(err, info)
        if (status) {
          res.status(200).send({ message: 'success', accessToken: req.headers.authorization.split(' ')[1], successful: true })
        } else {
          console.log('aaaa', status)
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
      res.status(404).send({ message: msgRequire })
    }
  }
}