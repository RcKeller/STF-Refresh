
import mongoose from 'mongoose'
/*
This is the body of a proposal - the business case.

Business cases are a new process for handling proposals.
They frame things as current vs. future state, so we evaluate
proposals framed as "changes" and "impact" on the community.

Legacy proposals are just a stream of Q/A, without any sort of structure
(totally flat), so to handle them we store the information in an array with
{ title: body }, then the client can use map() to render them.
*/
const BusinessCaseSchema = new mongoose.Schema({
  overview: {
    abstract: { type: string, required: true },
    //  Objectives are key notes/bullet points.
    objectives: [{ type: string, required: true }],
    //  Justification is a brief answer to "why", or info about urgent need.
    justification: { type: string, required: true }
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
    state: [{ type: string, required: true }],
    availability: [{ type: string, required: true }],
    strategy: [{ type: string, required: true }],
    outreact: [{ type: string, required: true }],
    risk: [{ type: string, required: true }]
  },
  legacy: [{
    title: { type: string, required: true },
    body: { type: string, required: true }
  }]
})
export default mongoose.model('BusinessCase', BusinessCaseSchema)
/*
BusinessCase:
  overview: {
    abstract: String (required),
    objectives: [String] (required),
    justification: String (required)
  },
  plan: {
    state: {
      current: String (req),
      future: String (req)
    },
    availability: {
      current: String (req),
      future: String (req)
    },
    strategy: {
      current: String (req),
      future: String (req)
    },
    outreach: {
      current: String (req),
      future: String (req)
    },
    risk: {
      current: String (req),
      future: String (req)
    },

  },
  //  Legacy contains old fields, stored in key-values and mapped to render.
  legacy: [{
    title: String
    body: String
  }],
*/
