
import mongoose from 'mongoose'
const ReportSchema = new mongoose.Schema({
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  date: { type: Date, default: Date.now },
  // TODO: Iron out these details with a proposal officer.
})
export default mongoose.model('Report', ReportSchema)
