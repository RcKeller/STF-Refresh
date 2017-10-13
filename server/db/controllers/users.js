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

/*
import REST from './restify'
import { User } from '../models'

export default class Users extends REST {
  constructor () {
    super(User) //  heh
  }
}
*/
