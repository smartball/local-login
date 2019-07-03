import express from 'express'
import jwt from 'jwt-simple'
import sha1 from 'sha1'
import moment from 'moment'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { MiddleWareLogin } from '../../middleware'
import { LoginName, OauthUsers, Users } from '../../models'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'

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
        console.log('checkUserLogin==========', oauthUser)
        let dataUser = await Users.findOne({ id: request.id })
        dataUser = { ...dataUser._doc, ...oauthUser._doc }
        console.log(dataUser)
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
    console.log(moment(expires_in).format('DD-MM-YYYY:HH:mm'))
    const payload = {
      user_id: req.loginName.user_id,
      username: req.loginName.username,
      root_id: req.dataUser.root_id,
      parent_id: req.dataUser.parent_id,
      accessToken: 'test',
      refresh_token: 'AAA',
      expires_in: expires_in.format('x'),
      iat: new Date().getTime()
    };

    res.status(200).send({ message: 'success', accessToken: jwt.encode(payload, SECRET), successful: true })
  }
}