import REST from './restify'
import { STF as Member } from '../models'

export default class Members extends REST {
  constructor () {
    super(Member)
  }
}
