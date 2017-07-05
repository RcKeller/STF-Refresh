import REST from './rest'
import { Comment } from '../models'

export default class Comments extends REST {
  constructor () {
    super(Comment, '_id')
  }
}
