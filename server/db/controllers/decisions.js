import REST from './restify'
import { Decision } from '../models'

export default class Decisions extends REST {
  constructor () {
    super(Decision)
  }
  //  TODO: Update proposal received
}
