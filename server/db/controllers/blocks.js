import REST from './restify'
import { Block } from '../models'

export default class Blocks extends REST {
  constructor () {
    super(Block)
  }
}
