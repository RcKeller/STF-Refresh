import REST from './rest'
import { Manifest } from '../models'

export default class Manifests extends REST {
  constructor () {
    super(Manifest, '_id')
  }
}
