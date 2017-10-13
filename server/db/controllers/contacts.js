import REST from './restify'
import { Contact } from '../models'

export default class Contacts extends REST {
  constructor () {
    super(Contact)
  }
}
