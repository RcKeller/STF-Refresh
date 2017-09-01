import REST from './rest'
import { Review } from '../models'

export default class Reviews extends REST {
  constructor () {
    super(Review, '_id')
  }
}
