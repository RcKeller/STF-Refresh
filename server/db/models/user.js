/**
 * Defining a User Model in mongoose
 * Code modified from https://github.com/sahat/hackathon-starter
 */
import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  netID: { type: String, unique: true, lowercase: true },
  email: { type: String, unique: true, lowercase: true },
  /*
  The auth(orization) object will not pass to the client unless
  there's some sort of elevated privlege. Delete this object to remove
  a member's entire association with this org, assign or adjust to change privlege.
  */
  auth: {
    spectator: Boolean,
    member: Boolean,
    admin: Boolean,
  },
  // Tokens and the google object are used by Oauth for the google (dev) strategy
  tokens: Array,
  google: {}
});
export default mongoose.model('User', UserSchema);
