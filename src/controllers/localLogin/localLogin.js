import express from 'express'
import jwt from 'jsonwebtoken'
import sha1 from 'sha1'
import moment from 'moment'
import fs from 'fs'
import path from 'path'
import { MiddleWareLogin } from '../../middleware'
import { LoginName, OauthUsers, Users } from '../../models'

export default class LocalLogin {
  constructor() {
    this.app = express.Router()
    this.app.use('/', new MiddleWareLogin().app, this.loginController)
    // this.app.get('/', this.initApp, this.authLocal)
  }


  loginController = async (req, res, next) => {
    let request = req.body
    const checkUserLogin = await LoginName.findOne({ username: request.username })
    try {
      if (!checkUserLogin) {
        return res.status(401).send({ message: 'username หรือ password ไม่ถูกต้อง', successful: false })
      } else {
        request.id = checkUserLogin.id
        let oauthUser = await OauthUsers.findOne({ username: request.id })
        // console.log('checkUserLogin==========', oauthUser)
        let dataUser = await Users.findOne({ id: request.id })
        dataUser = { ...dataUser._doc, ...oauthUser._doc }
        // console.log(dataUser)
        if (sha1(request.password) === dataUser.password) {
          if (dataUser.is_banned === 1) {
            return res.status(401).send({ message: 'คุณโดนแบน กรุณาติดต่อผู้ที่เกี่ยวข้อง', successful: false })
          } else {
            req.loginName = checkUserLogin
            req.dataUser = dataUser
            this.generateJwt(req, res, next)
            next()
          }
        } else {
          return res.status(401).send({ message: 'username หรือ password ไม่ถูกต้อง', successful: false })
        }
      }
    } catch (err) {
      console.log(err)
      res.status(500).send({ message: 'something wrong!!', successful: false })
    }
  }

  generateJwt = (req, res, next) => {
    const SECRET = "MY_SECRET_KEY"
    const expires_in = moment().utcOffset(7).add(5, 'days')
    const privateKEY = fs.readFileSync(path.join(__dirname, './private.key'))
    const publicKEY = fs.readFileSync(path.join(__dirname, './public.key'))
    const signOptions = {
      issuer: 'dp-lotto',
      subject: 'some@user.com',
      audience: 'http://example.com',
      expiresIn: '12h',
      algorithm: 'RS256'
    }
    const payload = {
      user_id: req.loginName.user_id,
      username: req.loginName.username,
      root_id: req.dataUser.root_id,
      parent_id: req.dataUser.parent_id,
      accessToken: 'test',
      refresh_token: 'AAA',
      expires_in: expires_in.format('x'),
      iat: new Date().getTime()
    }
    var verifyOptions = {
      issuer: 'dp-lotto',
      subject: 'some@user.com',
      audience: 'http://example.com',
      expiresIn:  "12h",
      algorithm:  ["RS256"]
     }
    let token = jwt.sign(payload, privateKEY, signOptions)
    // var token = jwt.sign({ foo: 'bar' }, 'shhhhh')
    // console.log(token)
    var legit = jwt.verify('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJ1c2VybmFtZSI6Im93bmVyIiwicm9vdF9pZCI6MywicGFyZW50X2lkIjoxLCJhY2Nlc3NUb2tlbiI6InRlc3QiLCJyZWZyZXNoX3Rva2VuIjoiQUFBIiwiZXhwaXJlc19pbiI6IjE1NjQxMjA5MjUzNTEiLCJpYXQiOjE1NjM2ODg5MjUzNTYsImV4cCI6MTU2MzY4ODk2ODU1NiwiYXVkIjoiaHR0cDovL2V4YW1wbGUuY29tIiwiaXNzIjoiZHAtbG90dG8iLCJzdWIiOiJzb21lQHVzZXIuY29tIn0.nBqJwYtnzqtKKeX_NPkMzofQsdgboMraqO0OLUx_Kiaz_KTgiGnHpm6wFp2v5OMJOQtRUan4-4nNCmDKoCcgF5Tv4cCmkjYKrsWwkEBRsKtuZyZzAtvjuji14YkLwqrJe1gpTUHhOtWHHYPzFwIyJjpHQBpHohXOxMgkWKIXC5RJZgxeTVYvqSgActy3ZzImB23yexWezqO5NDY-HKaynw37rYGV_lRfYM08fwHi3_bc4RnRt4InELT9gilu-OrXwMG52HG-S-LK-IcQfWiVmCgmMneQymtMseKnCeorovmdmbIPD-iCAAWhPvVQaGWEy2MZJhMUH9aBiaO9yppx4XHzSy5D_PflWhW2Coes_YMw255c1ADxAUDQgS6TBHXgrw7-KFs1SlFvZg3R-HaKwy1l-vRTZH0GivonBBdmiVZFf0C3Gm2YxNXA0GeZBXSjK6Eva_MRUXbViCTDwlv2pOVZGBr_urZ6ZQ9DuqMCMHiIC0NNWkHqM6eNGCBD5dyitBwVEC37phHHR62kdk_oqHYadgsgITKEtjos19ZBAKG0I05Nny3n05dw5_zc5vJj0PCWYiG3p4M_4mHF2b4QkTSxdn96NAanC0ouLYphBpLFxgz3lalDcxu-NMsRQ6Bh-gB1us_d_BT4s2pWKK7ud3xaKamSR-jBvEHQuCBZUH0', publicKEY, verifyOptions);
console.log("\nJWT verification result: " + JSON.stringify(legit));
    res.status(200).send({ message: 'success', accessToken: token, successful: true })
  }
}