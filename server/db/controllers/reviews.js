import REST from './restify'
import { Review } from '../models'

export default class Reviews extends REST {
  constructor () {
    super(Review)
  }
}
