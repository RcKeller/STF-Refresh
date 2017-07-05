import REST from './rest'
import { Item } from '../models'

export default class Items extends REST {
  constructor () {
    super(Item, '_id')
  }
}
