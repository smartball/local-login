import express from 'express'
import jwt from 'jsonwebtoken'
import sha1 from 'sha1'
import moment from 'moment'
import fs from 'fs'
import path from 'path'
import { MiddleWareLogin } from '../../middleware'
import { LoginName, OauthUsers, Users } from '../../models'
import { responseMessage } from '../../utils'

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
        return res.status(401).send(responseMessage(401, { errorMessage: 'username หรือ password ไม่ถูกต้อง' }))
      } else {
        request.id = checkUserLogin.id
        let oauthUser = await OauthUsers.findOne({ username: request.id })
        // console.log('checkUserLogin==========', oauthUser)
        let dataUser = await Users.findOne({ id: request.id })
        dataUser = { ...dataUser._doc, ...oauthUser._doc }
        // console.log(dataUser)
        if (sha1(request.password) === dataUser.password) {
          if (dataUser.is_banned === 1) {
            return res.status(401).send(responseMessage(401, { errorMessage: 'คุณโดนแบน กรุณาติดต่อผู้ที่เกี่ยวข้อง' }))
          } else {
            req.loginName = checkUserLogin
            req.dataUser = dataUser
            this.generateJwt(req, res, next)
            next()
          }
        } else {
          return res.status(401).send(responseMessage(401, { errorMessage: 'username หรือ password ไม่ถูกต้อง' }))
        }
      }
    } catch (err) {
      console.log(err)
      res.status(500).send(responseMessage(500, { errorMessage: 'Something wrong!!' }))
    }
  }

  generateJwt = (req, res, next) => {
    const expires_in = moment().utcOffset(7).add(1, 'hours')
    const privateKEY = fs.readFileSync(path.join(__dirname, '../../utils/constants/key/private.key'))
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
    let token = jwt.sign(payload, privateKEY, { algorithm: 'RS256' })
    res.status(200).send(responseMessage(200, { accessToken: token }))
  }
}