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
    funding: PropTypes.array.isRequired,
    year: PropTypes.number.isRequired,
    screen: PropTypes.object
  }
  static defaultProps = {
    funding: [],
    year: 2018
  }
  render (
    { funding, year } = this.props
  ) {
    const blockFunding = 1100032
    const annualFunds = 6000000
    const data = {
      annualFunds,
      blockFunding,
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
