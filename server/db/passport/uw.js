import User from '../models/user'

const serializeUser = (...args) => {
  console.log('Called db/passport/uw.serializeUser', args)
  return {}
}

const deserializeUser = (id, done) => {
  console.warn('db/passport/uw.deserializeUser:', id)
  User.findById(id, (err, user) => {
    done(err, user)
  })
}

export default { serializeUser, deserializeUser }
/* eslint-enable no-param-reassign */
