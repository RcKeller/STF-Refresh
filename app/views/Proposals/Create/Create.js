import React from 'react'
import {Field, reduxForm} from 'redux-form'

import Introduction from './Introduction/Introduction'
import Overview from './Overview/Overview'
import ProjectPlan from './ProjectPlan/ProjectPlan'
import Manifest from './Manifest/Manifest'
import Signatures from './Signatures/Signatures'

import { Steps, Icon, Button } from 'antd'
const Step = Steps.Step

const steps = [
  { title: 'Introduction', content: <Introduction />, icon: 'team' },
  { title: 'Overview', content: <Overview />, icon: 'solution' },
  { title: 'Plan', content: <ProjectPlan />, icon: 'book' },
  { title: 'Manifest', content: <Manifest />, icon: 'wallet' },
  { title: 'Signatures', content: <Signatures />, icon: 'edit' }
]

import styles from './Create.css'
@reduxForm({
  form: 'create',
  destroyOnUnmount: false,
  validate: (values) => {
    const errors = {}
    return errors
  }
})
class Create extends React.Component {
  constructor (props) {
    super(props)
    this.state = { current: 0 }
  }
  //  Load roles for contacts
  componentDidMount () {

  }
  //  Mechanism for controlling movement to next steps.
  next () { this.setState({ current: ++this.state.current }) }
  prev () { this.setState({ current: --this.state.current }) }
  render ({handleSubmit, load, pristine, reset, submitting} = this.props) {
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
          <form onSubmit={handleSubmit}>
            {steps[this.state.current].content}
          </form>
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
export default Create
