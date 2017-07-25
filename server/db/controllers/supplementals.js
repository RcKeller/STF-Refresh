import REST from './rest'
import { Supplemental } from '../models'

export default class Supplementals extends REST {
  constructor () {
    super(Supplemental, '_id')
  }
}
