import REST from './rest'
import { Decision } from '../models'

export default class Decisions extends REST {
  constructor () {
    super(Decision, '_id')
  }
}
