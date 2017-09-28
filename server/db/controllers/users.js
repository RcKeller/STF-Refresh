import REST from './rest'
import { User } from '../models'

export default class Users extends REST {
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
