import React from 'react'
import { connect } from 'react-redux'

import Agreement from './Agreement/Agreement'
import Wizard from './Wizard/Wizard'

import styles from './Create.css'
/*
This simple container serves as a gateway - if the route has an ?id=...,
we open up that proposal. The proposal wizard will kick out unauthorized users.
The state connection is weird - it's connecting to our router's queries.
*/
@connect(state => ({...state.routing.locationBeforeTransitions.query}))
class Create extends React.Component {
  render ({ id } = this.props) {
    return (
      <article className={styles['create']}>
        {!id ? <Agreement /> : <Wizard id={id} />}
      </article>
    )
  }
}

export default Create
