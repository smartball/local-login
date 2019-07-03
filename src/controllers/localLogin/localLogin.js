import express from 'express'
import jwt from 'jwt-simple'
import sha1 from 'sha1'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { LoginName, OauthUsers, Users } from '../../models'

export default class LocalLogin {
  constructor() {
    this.app = express.Router()
    this.app.post('/', this.loginController)
    // this.app.get('/', this.initApp, this.authLocal)
  }
  

  loginController = async (req, res, next) => {
    let request = req.body
    const checkUserLogin = await LoginName.findOne({ username: request.username })
    if (!checkUserLogin) {
      return res.status(401).send({ message: 'username หรือ password ไม่ถูกต้อง', successful: false })
    } else {
      request.id = checkUserLogin.id
      let oauthUser = await OauthUsers.findOne({ username: request.id })
      let dataUser = await Users.findOne({ id: request.id })
      dataUser = { ...dataUser._doc, ...oauthUser._doc }
      console.log(dataUser)
      if (sha1(request.password) === dataUser.password) {
        if (dataUser.is_banned === 1) {
          return res.status(401).send({ message: 'คุณโดนแบน กรุณาติดต่อผู้ที่เกี่ยวข้อง', successful: false })
        } else {
          this.generateJwt(req, res, next)
          next()
        }
      } else {
        return res.status(401).send({ message: 'username หรือ password ไม่ถูกต้อง', successful: false })
      }
    }
  }

  generateJwt = (req, res, next) => {
    const payload = {
      sub: 'test',
      iat: new Date().getTime()
    };
    const SECRET = "MY_SECRET_KEY"
    res.status(200).send({ message: 'success', accessToken: jwt.encode(payload, SECRET) })
  }
}