import REST from './restify'
import { Item } from '../models'

export default class Items extends REST {
  constructor () {
    super(Item)
  }
}
