import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'

import styles from './Proposal.css'
@compose(
  connect(
    state => ({ proposal: state.entities.proposal }),
    dispatch => ({ api: bindActionCreators(api, dispatch)
    })
  ),
  connectRequest(() => api.get('proposal', '594b49998dabd50e2c71762d', {
    populate: 'body,decision,contacts,manifests,reports,amendments,comments,'
  }))
)
class Proposal extends React.Component {
  render ({ proposal, actions } = this.props) {
    return (
      <article className={styles['article']}>
        {proposal &&
          <div>
            <h1>Proposal {proposal.year}-{proposal.number}</h1>
            <h2>{proposal.title}</h2>
            <hr />
            <p>{JSON.stringify(proposal)}</p>
            {/* <button style={{padding: 20}} onClick={(proposal) => post(proposal)} /> */}
          </div>
        }
      </article>
    )
  }
}

Proposal.propTypes = {
  proposal: PropTypes.object
}
export default Proposal
