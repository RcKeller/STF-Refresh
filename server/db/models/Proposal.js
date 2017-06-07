
import mongoose from 'mongoose'
const ProposalSchema = new mongoose.Schema({
  /*
  _id and _v(ersion) are populated by mongoose, but I think this
  might be a good field to fill manually, prevents namespace issues later.
  */
  _id: { type: String, unique: true },
  date: { type: Date, default: Date.now },
  year: { type: Number, required: true },
  number: { type: Number, required: true },
  quarter: String,
  //  Overall data, probably renders everywhere.
  title: { type: String, unique: true, required: true },
  category: { type: String, required: true },
  uac: { type: Boolean, default: false }, // UAC === uniform access / tri-campus.
  organization: { type: String, required: true }, // === department in legacy code
  //  Proposal status, differs from decisions in that this is "summary" data for table viewing.
  status: { type: String, default: 'In Review' },
  asked: Number,
  received: Number,
  // Contacts - array of objects, can iterate over via client with Object.keys().forEach(k, i) {}

  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
  // Body contains the business case/details, de-coupled from the core doc so that searching proposals is more efficient.
  body: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessCase' },
  /*
  Manifests are the items requested. One is listed as the "original" (Boolean),
  the others are partial or revised manifests that reflect what is actually funded.
  */
  manifests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Manifest' }],
  /*
  Amendments, AKA "supplementals", are revisions to the original propsal.
  These will be shown as "updates" or revisions to the proposal, but don't
  necessarily mean the entire proposal was re-done.
  It's usually just a blurb, plus decision. In rare instances there are multiple.
  */
  amendments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amendment' }],
  // TODO: Reports (they're unclear to me). Renders in another tab.
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }],
  //  The decision contains details about the actual award, provisions, etc.
  decision: { type: mongoose.Schema.Types.ObjectId, ref: 'Decision' },
  /*
  Comments are user endorsements of a proposal. They're abstracted out
  so that we can view "feeds" of endorsements and examine trends in user activity.
  */
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
})
export default mongoose.model('Proposal', ProposalSchema)

/*
Proposal:
  _id (year-number) (require)
  year: Integer (require)
  number: Integer (require)
  quarter: String (enum) (autumn, winter, spring, summer)

  title: String (require)
  category: String (enum) ...
  uac: Boolean (default false)
  organization: String (enum) ...
  contacts: [populate contact(s)]

  content: [Populate content(s)]

  status: String (enum)
  asked: Integer
  received: Integer (optional)

  manifests: [populate manifest(s)],

  comments: [populate comment(s)]

  amendments : [populate amendment(s)]

  reports: [populate report(s)]

*/
