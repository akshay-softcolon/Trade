import mongoose from 'mongoose'
const Schema = mongoose.Schema

const symbolSchema = new Schema(
  {
    name: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
)
export const SymbolModel = mongoose.model('symbol', symbolSchema)
