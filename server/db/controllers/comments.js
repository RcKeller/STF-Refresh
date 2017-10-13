import REST from './restify'
import { Comment } from '../models'

export default class Comments extends REST {
  constructor () {
    super(Comment)
  }
}
