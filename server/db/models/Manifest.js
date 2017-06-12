
import mongoose from 'mongoose'
const ManifestSchema = new mongoose.Schema({
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  // Is this the initial proposition? If not, it's a "partial" manifest for what was actually funded.
  original: { type: Boolean, default: false },
  // Items in the manifest.
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],

  subtotal: { type: Number, required: true, default: 0 },
  //  Tax rate, used to automatically account for tax.
  tax: { type: Number, required: true, default: 10.1, min: 0 },
  //  Total cost.
  total: { type: Number, required: true, default: 0 }
})
export default mongoose.model('Manifest', ManifestSchema)
