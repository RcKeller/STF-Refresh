
import mongoose from 'mongoose'
const CommentSchema = new mongoose.Schema({
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  //  Default titles since this is a new feature
  title: { type: String, required: true, default: '' },
  body: { type: String, required: true },
  date: { type: Date, default: Date.now }

})
export default mongoose.model('Comment', CommentSchema)
/*
Comment
  proposal: String,
  internal: Boolean (for votes/metrics),
  user: [populate user],
  title: String (require),
  body: String (require),
  date: Date,
*/
