import { Schema } from "mongoose"

const LoginNameSchema = new Schema({
  id: Number,
  user_id: Number,
  username: String,
  password: String,
  remember_token: String,
  is_main_login: Number,
  name: String,
  surname: String,
  telephone: String,
  mobilephone: String,
  ip: String,
  mac_address: String,
  start_date: String,
  is_active: Number,
  access_key: String,
  access_timestamp: String,
  updated_by: Number,
  deleted_at: String,
  created_at: String,
  updated_at: String,
})


export default LoginNameSchema