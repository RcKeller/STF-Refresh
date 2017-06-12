
import mongoose from 'mongoose'
/*
This is the body or "Business Case" of a proposal - the business case.

Business cases are a new process for handling proposals.
They frame things as current vs. future state, so we evaluate
proposals framed as "changes" and "impact" on the community.

Legacy proposals are just a stream of Q/A, without any sort of structure
(totally flat), so to handle them we store the information in an array with
{ title: body }, then the client can use map() to render them.
*/
const CaseSchema = new mongoose.Schema({
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
    outreact: [{ type: String, required: true }],
    risk: [{ type: String, required: true }]
  },
  legacy: [{
    title: { type: String, required: true },
    body: { type: String, required: true }
  }]
})
export default mongoose.model('Case', CaseSchema)
