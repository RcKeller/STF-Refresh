import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../../services'

// FINANCIALS (Sunburts)
import FundingAllocated from './Allocated'
// import FundingRemaining from './Remaining'
// PROJECT / PURCHASE DATA (Treemaps)
// import FundedItems from './Items'
// import FundedProjects from './Projects'

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
      update: ({ funding: (prev, next) => next })
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
      // {/* Data Vis
      // - Funding Allocated this Year
      // - Funding Remaining
      // - Chance of funding
      // - Projects Visualized
      // - Items Visualized */}
    //  TODO: Abstract higher level facts to config
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
          <div>
            <div>
              <FundingAllocated {...data} year={year} />
              {/* <FundingRemaining /> */}
            </div>
            <div>
              {/* <FundedProjects /> */}
              {/* <FundedItems /> */}
            </div>
          </div>
        }
      </section>
    )
  }
}

export default Funding
