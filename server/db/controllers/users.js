import REST from './rest'
import { User } from '../models'

export default class Articles extends REST {
  constructor () {
    super(User, '_id')
  }
  /**
   * POST /logout
   */
  logout (req, res) {
    req.logout()
    res.sendStatus(200)
  }
}

// import passport from 'passport'
// import User from '../models/user'

// /**
//  * POST /logout
//  */
// export function logout (req, res) {
//   req.logout()
//   res.sendStatus(200)
// }
//
// export default { logout }
