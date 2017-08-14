import REST from './rest'
import { Config } from '../models'

export default class Items extends REST {
  constructor () {
    super(Config, '_id')
  }
}
