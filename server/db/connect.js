import mongoose from 'mongoose'
import loadModels from './models'
import config from 'config'
const db = config.get('db')
export default () => {
  // Find the appropriate database to connect to, default to localhost if not found.
  const connect = () => {
    mongoose.Promise = require('bluebird')
    mongoose.connect(db, (err) => {
      if (err) {
        console.log(`===>  Error connecting to ${db}`)
        console.log(`Reason: ${err}`)
      } else {
        console.log(`===>  Succeeded in connecting to ${db}`)
      }
    })
  }
  connect()

  mongoose.connection.on('error', console.log)
  mongoose.connection.on('disconnected', connect)

  loadModels()
}
