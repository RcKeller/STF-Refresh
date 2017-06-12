
import mongoose from 'mongoose'
const AmendmentSchema = new mongoose.Schema({
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  contact: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
  title: { type: String, require: true },
  body: { type: String, require: true },
  decision: { type: mongoose.Schema.Types.ObjectId, ref: 'Decision' }
})
export default mongoose.model('Amendment', AmendmentSchema)
