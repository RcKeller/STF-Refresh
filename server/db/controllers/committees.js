import REST from './rest'
import { Committee } from '../models'

export default class Committees extends REST {
  constructor () {
    super(Committee, '_id')
  }
}
