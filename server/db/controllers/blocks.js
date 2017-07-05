import REST from './rest'
import { Block } from '../models'

export default class Blocks extends REST {
  constructor () {
    super(Block, '_id')
  }
}
