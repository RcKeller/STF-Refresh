
import mongoose from 'mongoose'
const ItemSchema = new mongoose.Schema({
  //  Items are tied to manifests, tied to proposals.
  manifest: { type: mongoose.Schema.Types.ObjectId, ref: 'Manifest' },
  title: { type: String, required: true },
  // Description will contain the old "justification" element at the end,
  description: String,
  quantity: { type: Number, required: true, default: 1, min: 0 },
  price: { type: Number, required: true, min: 0 },
  //  Priority (legacy: group) is used to sort items by importance, lower is most imp.
  priority: { type: Number, min: 0 },
  taxExempt: { type: Boolean, default: false }
})
export default mongoose.model('Item', ItemSchema)
/*
Manifest
  original: Boolean (false if partial)
  Items: [{
    title: String,
    description: String,
    quantity: Integer,
    price: Integer,
    priority: Integer,
    taxExempt: Boolean (default false)
    }]
  tax: Integer (default 10.1),
  total: Integer (recalculate on changes using pre)
*/
