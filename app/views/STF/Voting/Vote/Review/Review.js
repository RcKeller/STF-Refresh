import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { layout } from '../../../../../util/form'
import api from '../../../../../services'

import { Spin, Form, Row, Col, Switch, Checkbox, Slider, InputNumber, Button, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

class SliderAndNumber extends React.Component {
  render (
    { min, max, step, value } = this.props
  ) {
    return (
      <Row>
        <Col span={12}>
          <Slider {...this.props} />
        </Col>
        <Col span={4}>
          <InputNumber {...this.props} style={{ marginLeft: 16 }} />
        </Col>
      </Row>
    )
  }
}

//  Questions to ask for metrics
const questions = ['Proposal Quality', 'Academic Merit']

@compose(
  connect(
    (state, props) => ({
      proposal: state.db.manifests
        .find(manifest => manifest._id === props.id).proposal._id,
      manifest: state.db.manifests
        .find(manifest => manifest._id === props.id),
      review: state.db.manifests
        .find(manifest => manifest._id === props.id).reviews
        .find(review => review.author._id === state.user._id) || {},
      user: state.user,
      stf: state.user.stf
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Review extends React.Component {
  componentDidMount () {
    const { form, review } = this.props
    if (form && review) {
      //  Consistent fields
      const { score, approved } = review
      //  Dynamic fields - metric prompts change all the time. Normalize
      //  rc-form format: { metrics: { prompt: score }}
      let metrics = { }
      if (review.ratings && review.ratings.length > 0) {
        for (const q of review.ratings) {
          metrics[q.prompt] = q.score
        }
      }
      let fields = { score, approved, metrics }
      form.setFieldsValue(fields)
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let { form, api, proposal, manifest, review, user } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        console.warn('Submitting', values)
        const { metrics, score, approved } = values
        let denormalizedMetrics = []
        //  Denormalize prompts into scores: [{ prompt, score }]
        Object.keys(metrics).forEach((key, i) => {
          denormalizedMetrics.push({ prompt: key, score: metrics[key] })
        })
        const submission = {
          proposal,
          manifest: manifest._id,
          author: user._id,
          ratings: denormalizedMetrics,
          score,
          approved
        }
        console.warn('Review', submission)
        //  TODO: Add custom update func
        review._id
          ? api.patch('review', submission, { id: review._id })
          .then(message.success('Review updated!'))
          .catch(err => {
            message.warning('Review failed to update - Unexpected client error')
            console.warn(err)
          })
          : api.post('review', submission)
          .then(message.success('Review posted!'))
          .catch(err => {
            message.warning('Review failed to post - Unexpected client error')
            console.warn(err)
          })
      }
    })
  }
  render (
    { form, manifest, user, stf } = this.props
  ) {
    const { metrics, voting } = manifest.docket
    return (
      <section>
        {!manifest
          ? <Spin size='large' tip='Loading...' />
          : <Form onSubmit={this.handleSubmit}>
            <h2>Your Review</h2>
            <h4>{voting ? 'This proposal is up for review - you may score this proposal as you like (0-100).' : 'Review submissions are closed'}</h4>
            <h4>{voting ? 'Voting is now open. Be forewarned, these decisions are final!' : 'Voting is currently closed'}</h4>
            {questions.map(q => (
              <FormItem key={q} label={q} {...layout} >
                {form.getFieldDecorator(`metrics[${q}]`)(
                  // FIXME: Disabling it causes the value to become null by default: disabled={!metrics}... or does it?
                  <SliderAndNumber disabled={!metrics} min={0} max={100} step={1} />
                )}
              </FormItem>
            ))}
            <br />
            <FormItem label={<b>Overall Score</b>} {...layout} >
              {form.getFieldDecorator('score')(
                <SliderAndNumber disabled={!metrics} min={0} max={100} step={1} />
              )}
            </FormItem>
            {stf.member
              ? <FormItem label={<b>Approve this budget</b>} {...layout}>
                {form.getFieldDecorator('approved', { valuePropName: 'checked' })(
                  //  Valueprop is a selector for antd switches, it's in the docs.
                  <Checkbox disabled={!voting} size='large' />
                )}
              </FormItem>
              : <em>As a non-voting member, you may review a proposal which helps inform our decisions, but final votes may only be taken by appointed members.</em>
            }
            <FormItem label='Submit' {...layout}>
              <Button size='large' type='primary'
                htmlType='submit' ghost disabled={!metrics && !voting}
                >Update your Review</Button>
            </FormItem>
          </Form>
          }
      </section>
    )
  }
}
Review.propTypes = {
  form: PropTypes.object,
  api: PropTypes.object,
  id: PropTypes.string.isRequired,
  proposal: PropTypes.string,
  manifest: PropTypes.object,
  review: PropTypes.object,
  user: PropTypes.object
}
export default Review
