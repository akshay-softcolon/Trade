import mongoose from 'mongoose'
import Constant from '../../utilities/constant.js'
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    ID: {
      type: String,
      trim: true
    },
    password: {
      type: String,
      trim: true
    },
    name: {
      type: String,
      trim: true
    },
    surname: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: Constant.ROLE
    },
    accessTokenId: {
      type: String,
      trim: true
    },
    refreshTokenId: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
)

export const UserModel = mongoose.model('users', userSchema)
