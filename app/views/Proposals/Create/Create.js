import React from 'react'
import { browserHistory } from 'react-router'

import { Row, Col, Alert, Button, Icon, message } from 'antd'

import Agreements from './Agreements/Agreements'

import styles from './Create.css'
class Create extends React.Component {
  initializeProposal () {
    console.log('test')
    let id = '5951710b0d789f25e4061adc'
    message.success(`Successfully created new proposal! Your ID: ${id}`, 10)
    browserHistory.push(`/edit/${id}`)
  }
  render () {
    return (
      <article className={styles['page']}>
        <h1>Proposal Agreement</h1>
        <p>
          The Student Technology Fee Committee was created to ensure the best return on collected student dollars. By proposing to the committee, you agree to follow all requirements, current and future, set by the STFC. Included below are particularly relevant documents, along with brief summary and their full text.
        </p>
        <Agreements />
        <Button size='large' type='primary'
          onClick={() => this.initializeProposal()}
        >
          I Agree<Icon type='right' />
        </Button>
      </article>
    )
  }
}

export default Create
