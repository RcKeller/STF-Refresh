import REST from './rest'
import { STF as Model } from '../models'

export default class STF extends REST {
  constructor () {
    super(Model, '_id')
  }
}
