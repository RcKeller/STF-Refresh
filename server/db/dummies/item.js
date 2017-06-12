import mongoose from 'mongoose'
import faker from 'faker'
import Item from '../models/item'

/*
FAKE DATA GENERATOR: Item
*/
export default function dummyItems (min) {
  //  Check the db for existing data satisfying min required
  Item.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Item schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Item({
          manifest: new mongoose.Types.ObjectId(),  // THIS IS RANDOM
          title: faker.company.bsNoun(),
          description: faker.lorem.paragraph(),
          quantity: faker.random.number(),
          price: faker.random.number(),
          priority: faker.random.number(),
          taxExempt: faker.random.boolean()
        })
      }
      //  Create will push our fakes into the DB.
      Item.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Item (${fakes.length})`) }
      })
    }
  })
}
