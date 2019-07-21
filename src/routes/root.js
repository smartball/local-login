import express from 'express'
import Router from './router'
import LocalLogin from '../controllers/localLogin/localLogin'
import RefreshToken from '../controllers/refreshToken/refreshToken'

export class Root extends Router {
  constructor() {
    super()
    this.app.use('/login', new LocalLogin().app)
    this.app.use('/accessToken', new RefreshToken().app)
  }
}