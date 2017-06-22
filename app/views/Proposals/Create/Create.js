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
// @connect(state => ({ query: { id }} =  state.routing.locationBeforeTransitions.query))
// @connect(state => ({ id: state.routing.locationBeforeTransitions.query || '' }))
class Create extends React.Component {
  // render ({ id } = this.props) {
  render () {
    return (
      <article className={styles['create']}>
        <Wizard />
        {/* {!id ? <Agreement /> : <Wizard id={id} />} */}
      </article>
    )
  }
}

export default Create
