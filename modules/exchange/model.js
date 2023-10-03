import mongoose from 'mongoose'
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
    }]
  },
  { timestamps: true }
)
export const ExchangeModel = mongoose.model('exchange', exchangeSchema)
