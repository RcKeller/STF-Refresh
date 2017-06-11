import Contact from './models/contact'
import config from 'config'
import faker from 'faker'

function dummyContacts (min) {
  Contact.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Contact schema: ${err}`)
    } else if (count < min) {
      try {
        const contactA = new Contact({
          // proposal: '',
          role: 'primary',
          netID: faker.internet.userName(),
          name: faker.name.findName(),
          title: faker.name.jobTitle(),
          phone: faker.phone.phoneNumber(),
          mailbox: faker.address.secondaryAddress(),
          signature: false
        })
        console.log(contactA)
        Contact.create([contactA], (error) => {
          if (!error) { console.log(`SEED: Created fake contacts`) }
        })

          // const post1 = new Post({ name: 'Admin', title: 'Hello MERN', slug: 'hello-mern', cuid: 'cikqgkv4q01ck7453ualdn3hd', content: content1 });
          // const post2 = new Post({ name: 'Admin', title: 'Lorem Ipsum', slug: 'lorem-ipsum', cuid: 'cikqgkv4q01ck7453ualdn3hf', content: content2 });
          //
          // Post.create([post1, post2], (error) => {
          //  if (!error) {
          //    // console.log('ready to go....');
          //  }
          // });
      } catch (err) { console.warn(`Seed error: ${err}`) }
    }
  })
}

export default function () {
  const min = config.has('lorem-ipsum') ? config.get('lorem-ipsum') : 5 // default
  console.log(`SEED: Lorem Ipsum Mode enabled. Seeding up to ${min} documents each...`)

  dummyContacts(min)
}
