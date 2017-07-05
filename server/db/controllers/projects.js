import REST from './rest'
import { Project } from '../models'

export default class Projects extends REST {
  constructor () {
    super(Project, '_id')
  }
}
