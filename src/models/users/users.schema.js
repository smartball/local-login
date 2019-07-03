import { Schema } from "mongoose"

const UsersSchema = new Schema({
  id: {
    type: Number
  },
  parent_id: {
    type: Number,
    default: null
  },
  root_id: {
    type: Number,
    default: null
  },
  path: {
    type: String,
    default: '/'
  },
  position: {
    type: String,
    default: 'member'
  },
  init_credit: {
    type: Number,
    default: 0.00000000
  },
  remaining_credit: {
    type: Number,
    default: 0.00000000
  },
  child_credit: {
    type: Number,
    default: 0.00000000
  },
  bet: {
    type: Number,
    default: 0.00000000
  },
  own_amount: {
    type: Number,
    default: 0.00000000
  },
  recieve_amount: {
    type: Number,
    default: 0.00000000
  },
  send_amount: {
    type: Number,
    default: 0.00000000
  },
  is_active: {
    type: Number,
    default: 1
  },
  is_banned: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'THB'
  },
  deleted_at: {
    type: String,
    default: null
  },
  created_at: {
    type: String,
    default: '0000-00-00 00:00:00'
  },
  updated_at: {
    type: String,
    default: '0000-00-00 00:00:00'
  },
  invite_code: {
    type: String,
    default: null
  },
  my_code: {
    type: String,
    default: null
  },
  line: {
    type: String,
    default: null
  },
  call_center: {
    type: String,
    default: null
  },
  bank_account: {
    type: String,
    default: null
  },
  email: {
    type: String,
    default: null
  },
  affiliate_percentage:{
    type: Number,
    default: 0.00000000
  },
  affiliate_income:{
    type: Number,
    default: 0.00000000
  },
  affiliate_expense:{
    type: Number,
    default: 0.00000000
  },
  template_id: Number,
  default_affilidate_template_id: Number,
})


export default UsersSchema