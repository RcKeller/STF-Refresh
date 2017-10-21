import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { layout } from '../../../../../util/form'
import api from '../../../../../services'

import { Spin, Form, Row, Col, Switch, Slider, InputNumber, Button, message } from 'antd'
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
    (state, props) => ({
      active: state.db.manifests
        .find(manifest => manifest._id === props.id)
        .docket.metrics,
      proposal: state.db.manifests
        .find(manifest => manifest._id === props.id)
        .proposal._id,
      manifest: state.db.manifests
        .find(manifest => manifest._id === props.id),
      review: state.db.manifests
        .find(manifest => manifest._id === props.id)
        .reviews
        .find(review => review.author._id === state.user._id) || {},
      user: state.user,
      questions: state.config.enums.questions.review || [],
      stf: state.user.stf
    }),
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
    manifest: PropTypes.object,
    review: PropTypes.object,
    user: PropTypes.object
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
          .then(message.success('Metrics updated!'), 10)
          .catch(err => {
            message.warning('Metrics failed to update - Unexpected client error')
            console.warn(err)
          })
          : api.post('review', submission)
          .then(message.success('Metrics posted!'))
          .catch(err => {
            message.warning('Metrics failed to post - Unexpected client error')
            console.warn(err)
          })
      }
    })
  }
  render (
    { form, active, manifest, user, stf, questions } = this.props
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
