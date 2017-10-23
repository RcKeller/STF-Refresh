import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { makeManifestByID, makeManifestReview } from '../../../../../selectors'

// import { layout } from '../../../../../util/form'
import api from '../../../../../services'

import { Spin, Form, Row, Col, Slider, InputNumber, Button, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

class SliderAndNumber extends React.Component {
  render (
    { min, max, step, value } = this.props
  ) {
    return (
      <Row>
        <Col xs={16} sm={18} md={20} lg={22}>
          <Slider {...this.props} />
        </Col>
        <Col span={4} lg={2}>
          <InputNumber {...this.props} style={{ marginLeft: 16 }} />
        </Col>
      </Row>
    )
  }
}

//  Questions to ask for metrics
// const questions = ['Proposal Quality', 'Academic Merit']

@compose(
  connect(
    (state, props) => {
      const manifest = makeManifestByID(props.id)(state)
      const review = makeManifestReview(manifest)(state)
      const { docket, proposal, reviews } = manifest
      return {
        review,
        manifest: manifest._id,
        active: docket.metrics,
        proposal: proposal._id,
        questions: state.config.enums.questions.review || [],
        author: state.user._id
      }
    },
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Metrics extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    api: PropTypes.object,
    id: PropTypes.string.isRequired,
    proposal: PropTypes.string,
    manifest: PropTypes.string,
    review: PropTypes.object,
    author: PropTypes.string
  }
  componentDidMount () {
    const { form, review } = this.props
    if (form && review) {
      //  Consistent fields
      const { score, ratings } = review
      //  Dynamic fields - metric prompts change all the time. Normalize
      //  rc-form format: { metrics: { prompt: score }}
      let metrics = { }
      if (ratings && ratings.length > 0) {
        for (const q of review.ratings) {
          metrics[q.prompt] = q.score
        }
      }
      let fields = { score, metrics }
      form.setFieldsValue(fields)
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let { form, api, proposal, manifest, review, author } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const { _id: id } = review
        const { metrics, score } = values
        let denormalizedMetrics = []
        //  Denormalize prompts into scores: [{ prompt, score }]
        Object.keys(metrics).forEach((key, i) => {
          denormalizedMetrics.push({ prompt: key, score: metrics[key] })
        })
        const submission = {
          manifest,
          proposal,
          author,
          score,
          ratings: denormalizedMetrics
        }
        console.warn('Review', submission)
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
          .then(message.success('Metrics updated!'), 10)
          .catch(err => {
            message.warning('Metrics failed to update - Unexpected client error')
            console.warn(err)
          })
          : api.post('review', submission, params)
          .then(message.success('Metrics posted!'))
          .catch(err => {
            message.warning('Metrics failed to post - Unexpected client error')
            console.warn(err)
          })
      }
    })
  }
  render (
    { form, active, manifest, questions } = this.props
  ) {
    return (
      <section>
        <br />
        {!manifest
          ? <Spin size='large' tip='Loading...' />
          : <Form onSubmit={this.handleSubmit}>
            {!active && <h4>Metric submissions are closed, but you may view previous scores</h4>}
            {questions.map(q => (
              <FormItem key={q} label={q}>
                {form.getFieldDecorator(`metrics[${q}]`)(
                  <SliderAndNumber disabled={!active} min={0} max={100} step={1} />
                )}
              </FormItem>
            ))}
            <br />
            <FormItem label={<b>Overall Score</b>}>
              {form.getFieldDecorator('score')(
                <SliderAndNumber disabled={!active} min={0} max={100} step={1} />
              )}
            </FormItem>
            {active &&
              <FormItem>
                <Button size='large' type='primary'
                  style={{ width: '100%' }}
                  htmlType='submit' ghost disabled={!active}
                  >Save Metrics</Button>
              </FormItem>
            }
          </Form>
          }
      </section>
    )
  }
}

export default Metrics
