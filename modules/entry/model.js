import mongoose from 'mongoose'
const Schema = mongoose.Schema
const tenantSchema = new Schema(
  {
    tenantId: {
      type: String,
      trim: true
    },
    Domain: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
)
export const TenantModel = mongoose.model('tenants', tenantSchema)
