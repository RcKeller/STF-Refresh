import REST from './rest'
import Block from '../models/block'

export default class Blocks extends REST {
  constructor () {
    super(Block, '_id')
    console.log('Block class instantiated')
  }
}
