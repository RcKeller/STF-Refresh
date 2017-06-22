import config from 'config'

import { restDummies } from './models'

export default function () {
  const min = config.has('lorem-ipsum') ? config.get('lorem-ipsum') : 5 // default
  console.log(`SEED: Lorem Ipsum Mode enabled. Seeding up to ${min} documents each...`)
  //  Activate dummy data generators, with specified minimums document counts.
  restDummies.map((model) => model(min))
}
