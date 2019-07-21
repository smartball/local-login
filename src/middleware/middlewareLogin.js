import express from 'express'
import schema from 'schm'
import passport from 'passport'
import moment from 'moment'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'

export class MiddleWareLogin {
  constructor() {
    this.app = express.Router()
    this.app.post('/', this.initApp, this.checkParam)
  }

  initApp = async (req, res, next) => {
    try {
      const SECRET = "MY_SECRET_KEY"
      const publicKEY = fs.readFileSync(path.join(__dirname, './public.key'))
      const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: publicKEY,
        algorithms: ['RS256'],
      }
      var verifyOptions = {
        issuer: 'dp-lotto',
        subject: 'some@user.com',
        audience: 'http://example.com',
        expiresIn: "12h",
        algorithm: ["RS256"]
      }
      const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJ1c2VybmFtZSI6Im93bmVyIiwicm9vdF9pZCI6MywicGFyZW50X2lkIjoxLCJhY2Nlc3NUb2tlbiI6InRlc3QiLCJyZWZyZXNoX3Rva2VuIjoiQUFBIiwiZXhwaXJlc19pbiI6IjE1NjQxMjA0NDA5NzUiLCJpYXQiOjE1NjM2ODg0NDA5NzksImV4cCI6MTU2MzY4ODQ4NDE3OSwiYXVkIjoiaHR0cDovL2V4YW1wbGUuY29tIiwiaXNzIjoiZHAtbG90dG8iLCJzdWIiOiJzb21lQHVzZXIuY29tIn0.ZJ-RGeBEg33TzonVltotcYh5nVWkq71gXqvfWJtHRJiCcaw4msscrW-4xXU9uFLRZEJ6F2dAS_8IitdJ9vbak0Mk15Yarr-3bFRPbiIxDOZo6Wj7lJ30AGawRF5x_VU6NAX6vNBjd9MRAN74-ksvXxQRbmEl8KYb4JW3ks53cKpkUpeJnpUiwASk1yK9fHD8A7PYQI_xd28hDqpP6U8s2xeV1jomtyQfuJ9LlSrAtoTt_6lWh3hgvLaACwub-BA1AnbafmBT_574pIj0jmqvHIkFw15a-kJvXVsE-UH1L6_4ddNpH0PzQF9hc9ZGNn717ndclImt-ELNQb8QHFpS-e_14a2K0xZgnI_UXcZFdReFJAITtC4fBGKveHoTkdXm1vKpcfo-MrshaR4scD5yMKfw_a-dNDecCFHa7Y7Mx6PAa3Cy9YT1r2JigfMxW5DFtIbXGK6FshiZqmXz6upCGfOrrMe8PpKxPQjcHZlKAGdiVPJO7C-ZtUjxAk0CYh-MFHiWfS6tRZtOmWGVCNejkb4RTXu5OaNdqp8G86MKbFsgqpI0atiDh5IfTL1cN4xOX-93K4CFv1rjVh4x7x5hU6tFM2-YbiiKnKe-zgQIviCk8fVBxqqcwCl7lqr2gAae_SedhcTBhDuLikLvTjVpS4pc9ojONCvq6056V2ne6JI'
      
      var legit = jwt.verify('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJ1c2VybmFtZSI6Im93bmVyIiwicm9vdF9pZCI6MywicGFyZW50X2lkIjoxLCJhY2Nlc3NUb2tlbiI6InRlc3QiLCJyZWZyZXNoX3Rva2VuIjoiQUFBIiwiZXhwaXJlc19pbiI6IjE1NjQxMjA5MjUzNTEiLCJpYXQiOjE1NjM2ODg5MjUzNTYsImV4cCI6MTU2MzY4ODk2ODU1NiwiYXVkIjoiaHR0cDovL2V4YW1wbGUuY29tIiwiaXNzIjoiZHAtbG90dG8iLCJzdWIiOiJzb21lQHVzZXIuY29tIn0.nBqJwYtnzqtKKeX_NPkMzofQsdgboMraqO0OLUx_Kiaz_KTgiGnHpm6wFp2v5OMJOQtRUan4-4nNCmDKoCcgF5Tv4cCmkjYKrsWwkEBRsKtuZyZzAtvjuji14YkLwqrJe1gpTUHhOtWHHYPzFwIyJjpHQBpHohXOxMgkWKIXC5RJZgxeTVYvqSgActy3ZzImB23yexWezqO5NDY-HKaynw37rYGV_lRfYM08fwHi3_bc4RnRt4InELT9gilu-OrXwMG52HG-S-LK-IcQfWiVmCgmMneQymtMseKnCeorovmdmbIPD-iCAAWhPvVQaGWEy2MZJhMUH9aBiaO9yppx4XHzSy5D_PflWhW2Coes_YMw255c1ADxAUDQgS6TBHXgrw7-KFs1SlFvZg3R-HaKwy1l-vRTZH0GivonBBdmiVZFf0C3Gm2YxNXA0GeZBXSjK6Eva_MRUXbViCTDwlv2pOVZGBr_urZ6ZQ9DuqMCMHiIC0NNWkHqM6eNGCBD5dyitBwVEC37phHHR62kdk_oqHYadgsgITKEtjos19ZBAKG0I05Nny3n05dw5_zc5vJj0PCWYiG3p4M_4mHF2b4QkTSxdn96NAanC0ouLYphBpLFxgz3lalDcxu-NMsRQ6Bh-gB1us_d_BT4s2pWKK7ud3xaKamSR-jBvEHQuCBZUH0', publicKEY, verifyOptions);
      console.log("\nJWT verification result: " + JSON.stringify(legit))
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