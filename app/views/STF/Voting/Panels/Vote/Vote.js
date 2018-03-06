import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Spin, Form, Alert, Switch, Button, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

import { layout } from '../../../../../util/form'
import api from '../../../../../services'
import { makeManifestByID, makeManifestReview } from '../../../../../selectors'

/*
VOTE PANEL:
Allows members to cast their FINAL, OVERALL VOTES
NOTE: The requirements for voting changed at the end of the project,
so this is slightly unintuitive. Please refactor when bandwith is avail.
*/
@compose(
  connect(
    (state, props) => {
      const manifest = makeManifestByID(props.id)(state)
      const review = makeManifestReview(manifest)(state) || {}
      const { docket, proposal } = manifest
      return {
        review,
        manifest: manifest._id,
        author: state.user._id,
        active: docket.voting,
        proposal: proposal._id
        // review: reviews
        //   .find(review => review.author._id === state.user._id) || {},
      }
    },
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Vote extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    api: PropTypes.object,
    id: PropTypes.string.isRequired,
    proposal: PropTypes.string,
    review: PropTypes.object,
    manifest: PropTypes.string,
    author: PropTypes.string
  }
  componentDidMount () {
    const { form, review } = this.props
    if (form && review) {
      //  Consistent fields
      let { approved } = review
      if (typeof approved === 'undefined') approved = false
      form.setFieldsValue({ approved })
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let { form, api, proposal, manifest, review, author } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const { _id: id } = review
        const submission = {
          proposal,
          manifest,
          author,
          ...values
        }
        const params = {
          id,
          populate: ['author'],
          transform: manifests => ({ manifests }),
          update: ({ manifests: (prev, next) => {
            let change = prev.slice()
            let manifestIndex = change.findIndex(m => m._id === manifest)
            let reviewIndex = manifestIndex >= 0
              ? change[manifestIndex].reviews
                  .findIndex(r => r._id === id)
              : -1
            reviewIndex >= 0
              ? change[manifestIndex].reviews[reviewIndex] = next
              : change[manifestIndex].reviews.push(next)
            return change
          }})
        }
        params.id
          ? api.patch('review', submission, params)
          .then(message.success('Vote updated!'), 10)
          .catch(err => {
            message.warning('Vote failed to update - Unexpected client error')
            console.warn(err)
          })
          : api.post('review', submission, params)
          .then(message.success('Vote posted!'))
          .catch(err => {
            message.warning('Vote failed to post - Unexpected client error')
            console.warn(err)
          })
      }
    })
  }
  render (
    { form, active, questions, manifest, review } = this.props
  ) {
    console.warn('REVIEW', review)
    return (
      <section>
        {!manifest
          ? <Spin size='large' tip='Loading...' />
          : <div>
            {review && typeof review.approved === 'boolean' &&
              <Alert showIcon banner
                type={review.approved ? 'success' : 'error'}
                message={`You have voted ${review.approved ? 'in favor' : 'against'} this budget`}
                description='You may change this value later if this was a mistake.'
              />
            }
            <Form onSubmit={this.handleSubmit} style={{ paddingTop: 16 }}>
              <FormItem label={<b>Final Vote</b>} {...layout} >
                {form.getFieldDecorator('approved', { valuePropName: 'checked' })(
                  //  Valueprop is a selector for antd switches, it's in the docs.
                  <Switch checkedChildren='APPROVE' unCheckedChildren='DENY' />
                )}
              </FormItem>
              <FormItem label='Submit' {...layout}>
                <Button size='large' type='primary'
                  htmlType='submit' ghost disabled={!active}
                  >Save Vote</Button>
              </FormItem>
            </Form>
          </div>
          }
      </section>
    )
  }
}

export default Vote
