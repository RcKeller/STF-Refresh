import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'

import FundingAllocated from './Finances/Allocated'
import FundingChances from './Finances/Chances'
import FundingRemaining from './Finances/Remaining'

import FundedItems from './Funded/Items'
import FundedProjects from './Funded/Projects'

/*
FRONTPAGE DATA VISUALIZATIONS
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
class Visualizations extends React.Component {
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
    { funding } = this.props
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
              <FundingAllocated {...data} />
              {/* <FundingRemaining /> */}
              {/* <FundingChances /> */}
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

export default Visualizations
