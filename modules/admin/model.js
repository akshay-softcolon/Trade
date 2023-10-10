import mongoose from 'mongoose'
import Constant from '../../utilities/constant.js'
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema
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
    allowedExchange: [
      {
        type: ObjectId,
        ref: 'exchange'
      }
    ],
    Domain: {
      type: String,
      trim: true
    },
    exchangeGroup: [{
      type: Number,
      trim: true
    }],
    leverageX: {
      type: Number
    },
    leverageY: {
      type: Number
    },
    insertCustomBet: {
      type: Boolean
    },
    editBet: {
      type: Boolean
    },
    deleteBet: {
      type: Boolean
    },
    accessTokenId: {
      type: String,
      trim: true
    },
    refreshTokenId: {
      type: String,
      trim: true
    },
    limitOfAddSuperMaster: {
      type: Number
    },
    limitOfAddMaster: {
      type: Number
    },
    limitOfAddUser: {
      type: Number
    },
    brokerage: {
      type: Number
    },
    investorPassword: {
      type: String,
      trim: true
    },
    createdBy: {
      type: ObjectId,
      ref: 'users'
    }
  },
  { timestamps: true }
)

export const UserModel = mongoose.model('users', userSchema)
