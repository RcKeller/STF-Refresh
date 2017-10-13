import REST from './restify'
import { Project } from '../models'

export default class Projects extends REST {
  constructor () {
    super(Project)
  }
}
