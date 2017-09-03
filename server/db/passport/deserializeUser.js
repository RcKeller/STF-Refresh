import User from '../models/user'

export default (id, done) => {
  console.warn('db/passport/deserializeUser:', id)
  User.findById(id, (err, user) => {
    done(err, user)
  })
}
