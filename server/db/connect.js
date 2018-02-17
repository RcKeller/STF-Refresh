import mongoose from 'mongoose'
import loadModels from './models'
import dummyData from './dummy'
import config from 'config'
const db = config.get('db')
// FOR TESTING: Change your connection string in config OR here.
// E.g. a docker container:
// const db = 'mongodb://192.168.99.100:27017/test'

export default () => {
  // Find the appropriate database to connect to, default to localhost if not found.
  const connect = () => {
    mongoose.Promise = require('bluebird')
    mongoose.connect(db, (err) => {
      if (err) {
        console.warn(`===>  Error connecting to ${db}\n${err}`)
      } else {
        console.log(`===>  Succeeded in connecting to ${db}`)
      }
    })
  }
  connect()

  mongoose.connection.on('error', console.log)
  mongoose.connection.on('disconnected', connect)

  //  Load models (not that mongo dependencies are loaded)
  loadModels()
  //  Load lorem ipsum if this feature is enabled.
  if (config.has('lorem-ipsum')) dummyData()
}
