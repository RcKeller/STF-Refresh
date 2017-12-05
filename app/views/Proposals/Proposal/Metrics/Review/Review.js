import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'

import { Spin, Table, Button, Alert, Progress } from 'antd'

const currency = value => `$${Number.parseInt(value).toLocaleString()}`

class Review extends React.Component {
  // static propTypes = {
  //   _id: PropTypes.string,
  //   netID: PropTypes.string,
  //   email: PropTypes.string,
  //   name: PropTypes.string,
  //   stf: PropTypes.object
  // }
  static defaultProps = {
    asked: 0,
    title: 'Untitled Budget',
    decision: { body: 'A decision has not been issued.' },
    reviews: []
  }
  render ({ asked, _id: id, type, title, items, total, decision, reviews } = this.props) {
    //  { _id: id, netID, email, name, stf } = this.props
    console.warn('Author', this.props)
    const { body } = decision
    const status = typeof decision.approved === 'undefined'
      ? 'active'
      : (decision.approved ? 'success' : 'error')
    return (
      <div>
        {/* <h1>{_.capitalize(title)}</h1> */}
        <Alert banner showIcon={false}
          type={status}
          // type={decision.approved === true ? 'success' : 'error'}
          message={<h3>Asked: {`${currency(total)}`}</h3>}
          description={<div>
            <Progress
              status='active'
              percent={parseInt(total / asked * 100)}
            />
            <span><b>Decision: </b>{body}</span>
          </div>
          } />
        {/* <div>{body}</div> */}
        {reviews.map(r => (
          <div key={r._id}>
            <span>AUTHOR: {r.author.name}</span>
            <span>Score: {r.score}</span>
            {/* <span>Ratings: {r.ratings}</span> */}
          </div>
        ))}
      </div>
    )
  }
}

export default Review
