import mongoose from 'mongoose'
import UsersSchema from './users.schema'

const UsersModel = mongoose.model('users', UsersSchema)

export class Users {
  static getModel() {
    return UsersModel
  }

  static create(user) {
    return new UsersModel(user).save()
  }

  static updateOne(condition, update) {
    return UsersModel.findOneAndUpdate(condition, update, { new: true })
  }

  static updateById(id, update) {
    return UsersModel.findByIdAndUpdate(id, update, { new: true })
  }

  static updateMany(condition, update) {
    return UsersModel.updateMany(condition, update, { new: true })
  }

  static removeOne(condition) {
    return UsersModel.findOneAndRemove(condition)
  }

  static removeById(id) {
    return UsersModel.findByIdAndRemove(id)
  }

  static removeMany(condition) {
    return UsersModel.remove(condition)
  }

  static findById(id, fields = '') {
    return UsersModel.findById(id, fields)
  }

  static findOne(condition) {
    return UsersModel.findOne(condition)
  }
}