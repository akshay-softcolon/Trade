import mongoose from 'mongoose'
import db from '../../database/index.js'

function connectDB () {
  return new Promise((resolve, reject) => {
    // const mongoURL = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_IP}:${process.env.MONGO_PORT}/?authSource=admin`
    const mongoURL = 'mongodb://localhost:27017'
    mongoose
      .connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then((conn) => {
        console.log('connected')
        resolve(conn)
      })
      .catch((error) => reject(error))
  })
}

export const switchDB = async (dbName, dbSchema) => {
  console.log(dbSchema)

  const mongoose = await connectDB()

  console.log(mongoose.connection.readyState, 'mj')

  if (mongoose.connection.readyState === 1) {
    console.log('sa12')
    const db = mongoose.connection.useDb(dbName, { useCache: true })
    // Prevent from schema re-registration
    console.log(Object.keys(db.models).length)
    console.log(db)

    if (!Object.keys(db.models).length) {
      dbSchema.forEach((schema, modelName) => {
        db.model(modelName, schema)
      })
    }
    return db
  }
  throw new Error('err')
}

export const getDBModel = async (db, modelName) => {
  return db.model(modelName)
}

export const dbChange = async (dbName, schemaName) => {
  const database = db.useDb(dbName)
  const schema = await database.collection(schemaName)
  return schema
}
