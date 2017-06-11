import Contact from './models/contact';
import config from 'config'

function dummyContacts (min) {

  Contact.count().exec((err, count) => {
      if (count < min) {
        try {
          // Contact.seed(min, false, errorCallback)
        } catch (err) { console.warn(`Seed error: ${err}`) }
    } else { return }
  })
}

export default function () {
  const min = config.has('lorem-ipsum') ? config.get('lorem-ipsum') : 5 //default
  console.log(`SEED: Lorem Ipsum Mode enabled. Seeding up to ${min} documents each...`)

  dummyContacts(min)
}
