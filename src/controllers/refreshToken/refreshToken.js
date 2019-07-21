import express from 'express'
import passport from 'passport'
import moment from 'moment'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { responseMessage } from '../../utils'

export default class RefreshToken {
  constructor() {
    this.app = express.Router()
    this.app.get('/', this.refreshToken)
  }

  refreshToken = (req, res, next) => {
    try {
      const publicKEY = fs.readFileSync(path.join(__dirname, '../../utils/constants/key/public.key'))
      const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: publicKEY,
        algorithms: ['RS256'],
      }
      const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
        if (payload.refresh_token === 'AAA') {
          return done(null, payload)
        }
        else {
          return done(null, false)
        }
      })
      passport.use(jwtAuth)
      passport.authenticate('jwt', { session: false }, function (err, data, info) {
        const expires_in = moment().utcOffset(7).add(1, 'hours')
        const privateKEY = fs.readFileSync(path.join(__dirname, '../../utils/constants/key/private.key'))
        if (data) {
          data.expires_in = expires_in
          const token = jwt.sign(data, privateKEY, { algorithm: 'RS256' })
          res.status(200).send(responseMessage(200, { accessToken: token }))
        } else {
          res.status(400).send(responseMessage(400, { errorMessage: 'Bad request.' }))
        }
      })(req, res, next)
    } catch (err) {
      console.log('error ===> ', err)
      res.status(500).send(responseMessage(500, { errorMessage: 'Something wrong!!' }))
    }
  }
}