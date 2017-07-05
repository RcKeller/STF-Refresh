import REST from './rest'
import { Report } from '../models'

export default class Reports extends REST {
  constructor () {
    super(Report, '_id')
  }
}
