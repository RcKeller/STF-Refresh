import mongoose from 'mongoose'
import faker from 'faker'

/*
This is the body or "Business Case" of a proposal - the business case.

Business cases are a new process for handling proposals.
They frame things as current vs. future state, so we evaluate
proposals framed as "changes" and "impact" on the community.

Legacy proposals are just a stream of Q/A, without any sort of structure
(totally flat), so to handle them we store the information in an array with
{ title: body }, then the client can use map() to render them.
*/
const ProjectSchema = new mongoose.Schema({
  //  No link to a proposal. We will never have to reverse engineer a proposal.
  //  If that ever happens, implementing the relationship should be trivial.
  overview: {
    abstract: { type: String, required: true },
    //  Objectives are key notes/bullet points.
    objectives: [{ type: String, required: true }],
    //  Justification is a brief answer to "why", or info about urgent need.
    justification: { type: String, required: true }
  },
  /*
  Current vs. future state questions in the project plan are arrays.
  This is so the client can map over them in rendering, and to reduce
  the amount of complexity/nesting in the DB.

  While very opionionated, a key part of the refresh site's UI is
  re-framing the proposal process to be comparative, and related data
  (e.g. current vs. future state) should be viewable side-by-side.
  */
  plan: {
    state: [{ type: String, required: true }],
    availability: [{ type: String, required: true }],
    strategy: [{ type: String, required: true }],
    outreach: [{ type: String, required: true }],
    risk: [{ type: String, required: true }]
  },
  legacy: [{
    title: { type: String, required: true },
    body: { type: String, required: true }
  }]
})
const Project = mongoose.model('Project', ProjectSchema)
export default Project

/* *****
FAKE DATA GENERATOR: Contact
***** */
const dummyProjects = (min) => {
  //  Check the db for existing data satisfying min required
  Project.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Project schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Project({
          overview: {
            abstract: faker.lorem.paragraph(),
            objectives: [
              faker.lorem.sentence(),
              faker.lorem.sentence()
            ],
            justification: faker.lorem.paragraph()
          },
          plan: {
            state: [
              faker.lorem.paragraph(),
              faker.lorem.paragraph()
            ],
            availability: [
              faker.lorem.paragraph(),
              faker.lorem.paragraph()
            ],
            strategy: [
              faker.lorem.paragraph(),
              faker.lorem.paragraph()
            ],
            outreach: [
              faker.lorem.paragraph(),
              faker.lorem.paragraph()
            ],
            risk: [
              faker.lorem.paragraph(),
              faker.lorem.paragraph()
            ]
          },
          legacy: [
            {
              title: faker.company.catchPhrase(),
              body: faker.lorem.paragraph()
            },
            {
              title: faker.company.catchPhrase(),
              body: faker.lorem.paragraph()
            }
          ]
        })
      }
      //  Create will push our fakes into the DB.
      Project.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Project (${fakes.length})`) }
      })
    }
  })
}

export { dummyProjects }
