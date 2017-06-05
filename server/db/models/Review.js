
import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema({
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  body: String,
  decision: Boolean,
  score: Number,
  // Ratings are simple key-value stores, key is criteria, value is score.
  ratings: []
})
export default mongoose.model('Review', ReviewSchema)
/*

Review
  proposal: String,
  user: [populate user]
  body: String
  decision: Boolean (require),
  score: Int (require),
  ratings: [{
    // breakdown scores go here.
  }]

*/
