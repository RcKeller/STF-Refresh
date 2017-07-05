import REST from './rest'
import { Amendment } from '../models'

export default class Amendments extends REST {
  constructor () {
    super(Amendment, '_id')
  }
}
