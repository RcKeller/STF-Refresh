import React from 'react'
import PropTypes from 'prop-types'
// import _ from 'lodash'

import { Table, Alert } from 'antd'

const columns = [
  { title: 'Prompt', dataIndex: 'prompt', key: 'prompt' },
  { title: 'Score', dataIndex: 'score', key: 'score', width: 60 }
]

/*
SUBTABLE COMPONENT:
Table views for budgeting data
*/
class SubTable extends React.Component {
  static propTypes = {
    reviews: PropTypes.arrayOf(PropTypes.shape({
      author: PropTypes.shape({
        name: PropTypes.string,
        netID: PropTypes.string
      }),
      approved: PropTypes.boolean,
      ratings: PropTypes.arrayOf(PropTypes.shape({
        prompt: PropTypes.string,
        score: PropTypes.number
      }))
    }))
  }
  render (
    { reviews } = this.props
  ) {
    console.log(this.props)
    return (
      <div style={{ backgroundColor: '#fff' }}>
        {Array.isArray(reviews) && reviews.map(review => (
          <div key={review._id}>
            <Alert banner showIcon={false}
              style={{ paddingLeft: 8 }}
              type={typeof review.approved === 'boolean'
                ? review.approved ? 'success' : 'error'
                : 'info'
              }
              message={review.author
                ? <h6>{`${review.author.name} - ${review.author.netID}`}</h6>
                : <h6>Anonymous</h6>
              }
            />
            <Table size='small'
              dataSource={review.ratings}
              rowKey={record => record._id}
              sort
              columns={columns}
              pagination={false}
            />
          </div>
        ))}
      </div>
    )
  }
}

export default SubTable
