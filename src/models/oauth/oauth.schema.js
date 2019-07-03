import { Schema } from "mongoose"

const OauthUsersSchema = new Schema({
  username: String,
  password: String,
  first_name: String,
  last_name: String
})


export default OauthUsersSchema