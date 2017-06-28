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
  /*
  There is no key to link to a proposal. We will never have to reverse engineer a proposal from its low level content.
  If that ever happens, implementing the relationship should be trivial.
  The overview contains high level details, the plan contains the actual strategy. These are separated so that the overview can be shown on weekly meeting dockets, and each part can be cut into components for rendering.
  */
  overview: {
    abstract: { type: String, required: true },
    //  Objectives are key notes/bullet points. Not stored in array for consistency.
    objectives: { type: String, required: true },
    //  Justification is a brief answer to "why", or info about urgent need.
    justification: { type: String, required: true },
    //  The impact on students in various aspects
    impact: {
      academic: { type: String, required: true },
      research: { type: String, required: true },
      career: { type: String, required: true }
    }
  },
  /*
  Projects are framed in the sense of current vs. fututre state.
  This is to reflect questions that consistently come up in QA sessions
  and the fact that our org evaluates proposals as "Changes" to the UW system.

  While very opionionated, a key part of the refresh site's UI is
  re-framing the proposal process to be comparative, and related data
  (e.g. current vs. future state) should be viewable side-by-side.
  */
  plan: {
    state: {
      current: { type: String, required: true },
      future: { type: String, required: true }
    },
    availability: {
      current: { type: String, required: true },
      future: { type: String, required: true }
    },
    strategy: {
      current: { type: String, required: true },
      future: { type: String, required: true }
    },
    outreach: {
      current: { type: String, required: true },
      future: { type: String, required: true }
    },
    risk: {
      current: { type: String, required: true },
      future: { type: String, required: true }
    }
  },
  /*
  Legacy proposals are in a straightforward Q-A format, with a lot of inconsistency
  in our datasets. Our soultion for handling this is to collecting these is an array,
  then map() over them so they are rendered as a block of text, not unlike before the
  STF Refresh website. This is an elegant solution that prevents us from being opinionated
  about legacy proposals and requiring lots of join statements.

  To verify if a proposal is legacy or not, just use JS to test the truthiness
  of the legacy prop: if (proposal.legacy) {proposal.legacy.map((prompt, i)) => (...))}
  */
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
            objectives: faker.lorem.paragraph(),
            justification: faker.lorem.paragraph(),
            impact: {
              academic: faker.lorem.paragraph(),
              research: faker.lorem.paragraph(),
              career: faker.lorem.paragraph()
            }
          },
          plan: {
            state: {
              current: faker.lorem.paragraph(),
              future: faker.lorem.paragraph()
            },
            availability: {
              current: faker.lorem.paragraph(),
              future: faker.lorem.paragraph()
            },
            strategy: {
              current: faker.lorem.paragraph(),
              future: faker.lorem.paragraph()
            },
            outreach: {
              current: faker.lorem.paragraph(),
              future: faker.lorem.paragraph()
            },
            risk: {
              current: faker.lorem.paragraph(),
              future: faker.lorem.paragraph()
            }
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
