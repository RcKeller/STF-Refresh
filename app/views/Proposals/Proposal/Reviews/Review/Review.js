import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Alert, Collapse, Progress } from 'antd'
const Panel = Collapse.Panel

@connect((state, props) => ({
  author: state.db.proposal.reviews[props.index].author,
  body: state.db.proposal.reviews[props.index].body,
  approved: state.db.proposal.reviews[props.index].approved,
  score: state.db.proposal.reviews[props.index].score,
  ratings: state.db.proposal.reviews[props.index].ratings,
  date: state.db.proposal.reviews[props.index].date
}))
class Review extends React.Component {
  render ({ date, author, body, approved, score, ratings } = this.props) {
    return (
      <Alert type={approved ? 'success' : 'error'} showIcon banner
        message={`${author}: ${approved ? 'Approved' : 'Rejected'} | ${date}`}
        description={
          <span>
            <p>{body}</p>
            <Collapse bordered={false} style={{background: 'inherit'}}>
              <Panel style={{border: 'none'}} header={<h6>Overall Score: {score}%</h6>}>
                {ratings.map((r, i) =>
                  <div key={i}>
                    <em>{r.prompt}</em>
                    <Progress percent={r.score} />
                  </div>
                )}
                <em>{ratings[0].prompt}</em>
                <Progress percent={ratings[0].score} />
              </Panel>
            </Collapse>
          </span>
        }
      />
    )
  }
}

Review.propTypes = {
  reviews: PropTypes.object
}
export default Review
