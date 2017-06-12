
import mongoose from 'mongoose'
const DecisionSchema = new mongoose.Schema({
  //  A decision can be for a proposal OR amendment.
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  amendment: { type: mongoose.Schema.Types.ObjectId, ref: 'Amendment' },
  //  Decisions are structured like brief, formal comments.
  date: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  body: { type: String, required: true },
  approved: { type: Boolean, required: true },
  //  If this decision is an award, it will have a grant amount and associated report.
  grant: Number,
  report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' }
})
export default mongoose.model('Decision', DecisionSchema)
