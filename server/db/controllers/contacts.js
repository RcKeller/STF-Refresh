import REST from './rest'
import { Contact } from '../models'

export default class Contacts extends REST {
  constructor () {
    super(Contact, '_id')
  }
}
