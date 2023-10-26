import mongoose from 'mongoose'
import constant from '../../utilities/constant.js'
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema
const exchangeSchema = new Schema(
  {
    name: {
      type: String,
      trim: true
    },
    symbols: [{
      type: ObjectId,
      ref: 'symbol'
    }],
    status: {
      type: String,
      enum: constant.EXCHANGE_STATUS,
      default: constant.EXCHANGE_STATUS[0]
    },
    stopLoss: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)
export const ExchangeModel = mongoose.model('exchange', exchangeSchema)
