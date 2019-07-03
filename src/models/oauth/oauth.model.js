import mongoose from 'mongoose'
import OauthUsersSchema from './oauth.schema'

const OauthUsersModel = mongoose.model('oauth_users', OauthUsersSchema)

export class OauthUsers {
  static getModel() {
    return OauthUsersModel
  }

  static create(user) {
    return new OauthUsersModel(user).save()
  }

  static updateOne(condition, update) {
    return OauthUsersModel.findOneAndUpdate(condition, update, { new: true })
  }

  static updateById(id, update) {
    return OauthUsersModel.findByIdAndUpdate(id, update, { new: true })
  }

  static updateMany(condition, update) {
    return OauthUsersModel.updateMany(condition, update, { new: true })
  }

  static removeOne(condition) {
    return OauthUsersModel.findOneAndRemove(condition)
  }

  static removeById(id) {
    return OauthUsersModel.findByIdAndRemove(id)
  }

  static removeMany(condition) {
    return OauthUsersModel.remove(condition)
  }

  static findById(id, fields = '') {
    return OauthUsersModel.findById(id, fields)
  }

  static findOne(condition) {
    return OauthUsersModel.findOne(condition)
  }
}