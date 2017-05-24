/* *****
DATA MODEL
***** */
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const Post = mongoose.model('Post', new Schema({
  name: { type: 'String', required: true },
  title: { type: 'String', required: true },
  content: { type: 'String', required: true },
  slug: { type: 'String', required: true },
  cuid: { type: 'String', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true }
})
)
export default Post

/* *****
CONTROLLERS - server-side data retrieval
***** */
import cuid from 'cuid'
import slug from 'limax'
import sanitizeHtml from 'sanitize-html'

 /* *** Get all posts *** */
export function getPosts (req, res) {
  Post.find().sort('-dateAdded').exec((err, posts) => {
    if (err) { res.status(500).send(err) }
    res.json({ posts })
  })
}


 /* *** Get a single post *** */
export function getPost (req, res) {
  Post.findOne({ cuid: req.params.cuid }).exec((err, post) => {
    if (err) { res.status(500).send(err) }
    res.json({ post })
  })
}

/* *** Save a post *** */
export function addPost (req, res) {
  if (!req.body.post.name || !req.body.post.title || !req.body.post.content) {
    res.status(403).end()
  }

  const newPost = new Post(req.body.post)
  // Let's sanitize inputs
  newPost.title = sanitizeHtml(newPost.title)
  newPost.name = sanitizeHtml(newPost.name)
  newPost.content = sanitizeHtml(newPost.content)

  newPost.slug = slug(newPost.title.toLowerCase(), { lowercase: true })
  newPost.cuid = cuid()
  newPost.save((err, saved) => {
    if (err) { res.status(500).send(err) }
    res.json({ post: saved })
  })
}

 /* *** Delete a post *** */
export function deletePost (req, res) {
  Post.findOne({ cuid: req.params.cuid }).exec((err, post) => {
    if (err) { res.status(500).send(err) }
    post.remove(() => {
      res.status(200).end()
    })
  })
}

/* *****
ROUTES - API endpoints for the client
***** */
import { Router } from 'express'
const PostRouter = new Router()

// Get all Posts
PostRouter.route('/posts').get(getPosts)
// Get one post by cuid
PostRouter.route('/posts/:cuid').get(getPost)
// Add a new Post
PostRouter.route('/posts').post(addPost)
// Delete a post by cuid
PostRouter.route('/posts/:cuid').delete(deletePost)

export { PostRouter }
