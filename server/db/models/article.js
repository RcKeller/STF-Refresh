import mongoose from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
import faker from 'faker'

const ArticleSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  year: { type: Number, required: true },
  number: { type: Number, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true },
  position: String,
  //  Metadata
  title: { type: String, required: true },
  category: { type: String, required: true },
  //  Publication status
  published: { type: Boolean, required: true, default: false },
  public: { type: Boolean, required: true, default: false },
  //  The actual content of the articles
  body: String,
  //  Related proposals, for linking to at the bottom.
  proposals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' }]
})
ArticleSchema.plugin(autopopulate)
const Article = mongoose.model('Article', ArticleSchema)
export default Article

/* *****
FAKE DATA GENERATOR: Contact
***** */
const dummyArticles = (min, ids) => {
  //  Check the db for existing data satisfying min required
  Article.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Article schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Article({
          _id: ids.article[i],
          date: faker.date.recent(),
          year: 2017,
          number: faker.random.number(),
          author: ids.user[i],
          title: faker.company.catchPhrase(),
          category: faker.name.jobArea(),
          published: faker.random.boolean(),
          public: false,
          body: [faker.lorem.paragraph(), faker.lorem.paragraph(), faker.lorem.paragraph()].join(),
          proposals: [
            ids.proposal[i]
          ]
        })
      }
      //  Create will push our fakes into the DB.
      Article.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Article (${fakes.length})`) }
      })
    }
  })
}

export { dummyArticles }
