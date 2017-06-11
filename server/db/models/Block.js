import mongoose from 'mongoose'
const BlockSchema = new mongoose.Schema({
  /*
  _id and _v(ersion) are populated by mongoose, but I think this
  might be a good field to fill manually, prevents namespace issues later.
  */
  date: { type: Date, default: Date.now },
  year: { type: Number, required: true },
  number: { type: Number, required: true },
  //  Overall data, probably renders everywhere.
  title: { type: String, unique: true, required: true },
  category: { type: String, required: true },
  uac: { type: Boolean, default: false }, // UAC === uniform access / tri-campus.
  organization: { type: String, required: true }, // === department in legacy code
  // Contacts - array of objects, can iterate over via client with Object.keys().forEach(k, i) {}
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
  /*
  Body contains the business case/details, de-coupled from the core doc so that searching proposals is more efficient.
  While it has its similarities, this is decoupled because Blocks are distinct entities we don't want associated with standard proposals. Coupling their subdocuments introduces undue complexity to the query process.
  (as of today, we've only funded 3 blocks).
  */
  body: {
    overview: {
      abstract: { type: String, required: true },
      objectives: { type: String, required: true },
    },
    plan: {
      state: { type: String, required: true },
      strategy: { type: String, required: true },
      risk: { type: String, required: true },
    }
  },
  //  Proposal status, differs from decisions in that this is "summary" data for table viewing.
  status: { type: String, default: 'In Review' },
  asked: Number,
  received: Number,

})
export default mongoose.model('Block', BlockSchema)
/*
Block
  _id (number) (require)
  year: Integer (require)
  number: Integer (require)

  title: String (require)
  organization: String (enum) ...
  contacts: [populate contact(s)]

  status: String (enum)

  asked: Integer
  received: Integer (optional)

  body: {
    overview: {
      abstract: String (required),
      objectives: [String] (required)
    },
    plan {
      state: String (req),
      strategy: String (req),
      risk: String (req)
    }
  }
*/
