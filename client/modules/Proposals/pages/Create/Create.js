import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { Link } from 'react-router'

import { Steps, Icon, Button } from 'antd'
const Step = Steps.Step

// Introduction
// -Department Info/metadata
// -Key contacts
// Proposal
// -Abstract
// -Description
// Project Plan
// -Current state
// -Future State
// -Insurance, implementation
// Inventory
// -
// Signature Page

const steps = [
  {
    title: 'Introduction',
    content: 'Introduction'
  }, {
    title: 'Proposal',
    content: 'Proposal'
  }, {
    title: 'Project Plan',
    content: 'Project Plan'
  }, {
    title: 'Manifest',
    content: 'Manifest'
  }, {
    title: 'Signatures',
    content: 'Signatures'
  }
]

// import styles from './Create.css'
class Create extends React.Component {
  render () {
    return (
      <article>
        <h1>Proposal Create</h1>
        <p>
          The Student Technology Fee Committee was created to ensure the best return on collected student dollars. By proposing to the committee, you agree to follow all requirements, current and future, set by the STFC. Included below are particularly relevant documents, along with brief summary and their full text.
        </p>
        <Steps>
          <Step status='finish' icon={<Icon type='team' />}
            title='Introduction' description='Background Info & Contacts'
          />
          <Step status='finish' icon={<Icon type='solution' />}
            title='Proposal' description='Abstract & Brief Description'
          />
          <Step status='process' icon={<Icon type='book' />}
            title='Project Plan' description='Current & Future State'
          />
          <Step status='wait' icon={<Icon type='wallet' />}
            title='Manifest' description='Assets & Budget Request'
          />
          <Step status='wait' icon={<Icon type='smile-o' />}
            title='Signatures'
          />
        </Steps>

      </article>
    )
  }
}

const mapStateToProps = (state) => { return {} }
const mapDispatchToProps = (dispatch) => { return {} }
// Create.propTypes = {}
export default connect(mapStateToProps, mapDispatchToProps)(Create)
