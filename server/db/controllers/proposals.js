import REST from './rest'
import { Proposal } from '../models'

export default class Proposals extends REST {
  constructor () {
    super(Proposal, '_id')
  }
}
