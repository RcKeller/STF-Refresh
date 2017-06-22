// import passport from 'passport'
// import User from '../models/user'

/**
 * POST /logout
 */
export function logout (req, res) {
  req.logout()
  res.sendStatus(200)
}

export default { logout }
