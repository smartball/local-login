import express from 'express'
import Router from './router'
import LocalLogin from '../controllers/localLogin/localLogin'

export class Root extends Router {
  constructor() {
    super()
    this.app.use('/login', new LocalLogin().app)
  }
}