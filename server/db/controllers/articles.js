import REST from './rest'
import { Article } from '../models'

export default class Articles extends REST {
  constructor () {
    super(Article, '_id')
  }
}
