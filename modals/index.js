import mongoose from 'mongoose'
// import encrypt from 'mongoose-encryption'
import Constant from '../utilities/constant.js'
// import config from '../config/index.js'
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

// userSchema.plugin(encrypt, { secret: config.DATABASE.MONGO_FIELD_SECRET, encryptedFields: ['ID'] })

// userSchema.plugin(fieldEncryption, {
//   fields: ['ID'],
//   secret: config.DATABASE.MONGO_FIELD_SECRET,
//   saltGenerator: (secret) => {
//     return '7987498749844645'
//   }
// })

export const UserModel = mongoose.model('users', userSchema)
