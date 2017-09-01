import session from 'express-session'
import connectMongo from 'connect-mongo'
import config from 'config'
const url = config.get('db')

const MongoStore = connectMongo(session)
export default () => new MongoStore({ url, autoReconnect: true })
