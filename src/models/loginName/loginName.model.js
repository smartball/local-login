import mongoose from 'mongoose'
import LoginNameSchema from './loginName.schema'

const LoginNameModel = mongoose.model('login_names', LoginNameSchema)

export class LoginName {
  static getModel() {
    return LoginNameModel
  }

  static create(user) {
    return new LoginNameModel(user).save()
  }

  static updateOne(condition, update) {
    return LoginNameModel.findOneAndUpdate(condition, update, { new: true })
  }

  static updateById(id, update) {
    return LoginNameModel.findByIdAndUpdate(id, update, { new: true })
  }

  static updateMany(condition, update) {
    return LoginNameModel.updateMany(condition, update, { new: true })
  }

  static removeOne(condition) {
    return LoginNameModel.findOneAndRemove(condition)
  }

  static removeById(id) {
    return LoginNameModel.findByIdAndRemove(id)
  }

  static removeMany(condition) {
    return LoginNameModel.remove(condition)
  }

  static findById(id, fields = '') {
    return LoginNameModel.findById(id, fields)
  }

  static findOne(condition) {
    return LoginNameModel.findOne(condition)
  }
}