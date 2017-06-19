import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import { browserHistory, Link } from 'react-router'

import Introduction from './Introduction/Introduction'
import Overview from './Overview/Overview'
import ProjectPlan from './ProjectPlan/ProjectPlan'
import Manifest from './Manifest/Manifest'
import Signatures from './Signatures/Signatures'

import { Steps, Icon, Button } from 'antd'
const Step = Steps.Step

const steps = [
  {
    title: 'Introduction',
    content: <Introduction />,
    icon: 'team'
  }, {
    title: 'Overview',
    content: <Overview />,
    icon: 'solution'
  }, {
    title: 'Project Plan',
    content: <ProjectPlan />,
    icon: 'book'
  }, {
    title: 'Manifest',
    content: <Manifest />,
    icon: 'wallet'
  }, {
    title: 'Signatures',
    content: <Signatures />,
    icon: 'edit'
  }
]

import styles from './Create.css'
class Create extends React.Component {
  constructor (props) {
    super(props)
    this.state = { current: 0 }
  }
  //  Mechanism for controlling movement to next steps.
  next () { this.setState({ current: ++this.state.current }) }
  prev () { this.setState({ current: --this.state.current }) }
  render () {
    return (
      <article className={styles['create']}>
        <h1>Creating Proposal</h1>
        <Steps current={this.state.current}>
          {steps.map((s, i) => (
            <Step key={i} title={s.title}
              icon={<Icon type={s.icon} />}
            />
          ))}
        </Steps>
        <div>
          {steps[this.state.current].content}
        </div>
        <section className='steps-action'>
          {this.state.current < steps.length - 1 && // Next
            <Button size='large' type='primary' onClick={() => this.next()}>Next</Button>
          }
          {this.state.current === steps.length - 1 && // Submit
            <Button size='large' type='primary' onClick={() => console.log('Processing complete!')}>Submit Proposal!</Button>
          }
          {this.state.current > 0 &&  // Previous
            <Button size='large' style={{ marginLeft: 8 }} onClick={() => this.prev()}>Previous</Button>
          }
        </section>
      </article>
    )
  }
}

const mapStateToProps = (state) => { return {} }
const mapDispatchToProps = (dispatch) => { return {} }
// Create.propTypes = {}
export default connect(mapStateToProps, mapDispatchToProps)(Create)
