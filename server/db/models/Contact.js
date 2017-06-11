
import mongoose from 'mongoose'
const ContactSchema = new mongoose.Schema({
  // Contact info for associated proposal
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  //  Role is the person's association - Primary (contact), Budget, official (dean), Student
  role: { type: String, required: true },
  netID: { type: String, required: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  //  Client can handle string->number logic, since it's JS this is trivial.
  phone: String,
  mailbox: String,
  //  Have they signed the proposal?
  signature: Boolean
})
export default mongoose.model('Contact', ContactSchema)

/*
Contact:
  type: String (enum) - Primary, Budget, Dean, Student
  netID: String (unique)
  name: String (required)
  title: String (required)
  phone: String
  mailbox: String
  signature: Boolean (required, default false)
*/
