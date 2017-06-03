import passport from 'passport'
import User from '../models/user'

/**
 * POST /login
    Removed (part of local strategy)
 */

 /**
 * POST /signup
 Removed (part of local strategy)
 */

/**
 * POST /logout
 */
export function logout (req, res) {
  req.logout()
  res.sendStatus(200)
}

export default { logout }
