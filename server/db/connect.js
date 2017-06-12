import mongoose from 'mongoose'
import loadModels from './models'
import dummyData from './dummies'
import config from 'config'
const db = config.get('db')

export default () => {
  // Find the appropriate database to connect to, default to localhost if not found.
  const connect = () => {
    mongoose.Promise = require('bluebird')
    mongoose.connect(db, (err) => {
      if (err) {
        console.warn(`===>  Error connecting to ${db}\n${err}`)
      } else {
        console.log(`===>  Succeeded in connecting to ${db}`)
        if (config.has('lorem-ipsum')) { dummyData() }
      }
    })
  }
  connect()

  mongoose.connection.on('error', console.log)
  mongoose.connection.on('disconnected', connect)

  loadModels()
}
