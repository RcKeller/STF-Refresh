import config from 'config'

import { dummyUsers } from './models/user'
import { restDummies } from './models'

export default function () {
  const min = config.has('lorem-ipsum') ? config.get('lorem-ipsum') : 5 // default
  console.log(`SEED: Lorem Ipsum Mode enabled. Seeding up to ${min} documents each...`)
  //  Activate dummy data generators, with specified minimums document counts.
  //  BUG: Using these accounts makes auth fail. Unsure of cause.
  // dummyUsers()
  restDummies.map((model) => model(min))
}
