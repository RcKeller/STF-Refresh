import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../../services'

import PercentFunded from './PercentFunded'

/*
STATISTICAL VISUALIZATIONS
Higher order component for general
non-fiscal data (% projects funded, types funded...)

- Percentage of projects funded (this year)
- Categories of funded projects
- Current Quarter Status (#drafts, in review, etc)

*/
@compose(
  connect(state => ({
    statistics: state.db.statistics,
    year: state.config.year,
    quarter: state.config.quarter,
    categories: state.config.enums.categories,
    statuses: state.config.enums.statuses,
    screen: state.screen
  })),
  connectRequest(
    (props) => api.get('proposals', {
      query: { year: props.year },
      select: ['title', 'year', 'number', 'quarter', 'status', 'organization', 'category', 'asked', 'received'],
      transform: statistics => ({ statistics }),
      update: ({ statistics: (prev, next) => next })
    })
  )
)
class Statistics extends React.Component {
  static propTypes = {
    statistics: PropTypes.array.isRequired,
    quarter: PropTypes.string,
    categories: PropTypes.array.isRequired,
    statuses: PropTypes.array.isRequired,
    year: PropTypes.number.isRequired,
    screen: PropTypes.object
  }
  static defaultProps = {
    statistics: [],
    year: 2018,
    quarter: 'Autumn',
    categories: [],
    statuses: []
  }
  render (
    { statistics, quarter, year, categories, statuses } = this.props
  ) {
    const data = {
      statistics
    }
    return (
      <section>
        {statistics &&
          <div>
            <PercentFunded {...data} year={year} />
          </div>
        }
      </section>
    )
  }
}

export default Statistics
