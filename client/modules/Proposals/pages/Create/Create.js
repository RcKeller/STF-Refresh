import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import { browserHistory, Link } from 'react-router'

import { Steps, Icon, Button } from 'antd'
const Step = Steps.Step

const steps = [
  {
    title: 'Introduction',
    content: 'Introduction',
    icon: 'team'
  }, {
    title: 'Proposal',
    content: 'Proposal',
    icon: 'solution'
  }, {
    title: 'Project Plan',
    content: 'Project Plan',
    icon: 'book'
  }, {
    title: 'Manifest',
    content: 'Manifest',
    icon: 'wallet'
  }, {
    title: 'Signatures',
    content: 'Signatures',
    icon: 'edit'
  }
]

// import styles from './Create.css'
class Create extends React.Component {
  constructor (props) {
    super(props)
    this.state = { current: 0 }
  }
  next () {
    let current = this.state.current + 1
    this.setState({ current })
  }
  prev () {
    let current = this.state.current - 1
    this.setState({ current })
  }
  render () {
    return (
      <article>
        <h1>Proposal Create</h1>
        <p>
          The Student Technology Fee Committee was created to ensure the best return on collected student dollars. By proposing to the committee, you agree to follow all requirements, current and future, set by the STFC. Included below are particularly relevant documents, along with brief summary and their full text.
        </p>
        <Steps current={this.state.current}>
          {steps.map((s, i) => (
            <Step key={i}
              icon={<Icon type={s.icon} />}
              title={s.title} description={s.description}
            />
          ))}
        </Steps>
        <div className='steps-content'>
          {steps[this.state.current].content}
        </div>
        <div className='steps-action'>
          {
          this.state.current < steps.length - 1
          &&
          <Button type='primary' onClick={() => this.next()}>Next</Button>
        }
          {
          this.state.current === steps.length - 1
          &&
          <Button type='primary' onClick={() => message.success('Processing complete!')}>Done</Button>
        }
          {
          this.state.current > 0
          &&
          <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
            Previous
          </Button>
        }
        </div>

      </article>
    )
  }
}

const mapStateToProps = (state) => { return {} }
const mapDispatchToProps = (dispatch) => { return {} }
// Create.propTypes = {}
export default connect(mapStateToProps, mapDispatchToProps)(Create)
