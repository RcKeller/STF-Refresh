import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../../services'

// FINANCIALS (Sunburts)
import Allocated from './Allocated/Allocated'

/*
FUNDING VISUALIZATIONS
Higher order component for data fetching
and hydrating/framing financial visualizations
*/
@compose(
  connect(state => ({
    funding: state.db.funding,
    annualFunds: state.config.annualFunds,
    blockFunds: state.config.blockFunds,
    year: state.config.year,
    screen: state.screen
  })),
  connectRequest(
    (props) => api.get('proposals', {
      query: { published: true, year: props.year },
      populate: [
        { path: 'manifest', populate: { path: 'items' } }
      ],
      transform: funding => ({ funding }),
      update: ({ funding: (prev, next) => next }),
      force: true
    })
  )
)
class Funding extends React.Component {
  static propTypes = {
    annualFunds: PropTypes.number.isRequired,
    blockFunds: PropTypes.number.isRequired,
    funding: PropTypes.array.isRequired,
    year: PropTypes.number.isRequired,
    screen: PropTypes.object
  }
  static defaultProps = {
    funding: [],
    year: 2018
  }
  render (
    { year, funding, annualFunds, blockFunds } = this.props
  ) {
    const data = {
      annualFunds,
      blockFunds,
      funding
    }
    return (
      <section>
        {funding &&
          <Allocated {...data} year={year} />
        }
      </section>
    )
  }
}

export default Funding
