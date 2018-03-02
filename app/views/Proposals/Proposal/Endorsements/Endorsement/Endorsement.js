import React from 'react'
import PropTypes from 'prop-types'

import { Card, Avatar } from 'antd'
const { Meta } = Card

class Endorsement extends React.Component {
  static propTypes = {
    body: PropTypes.string.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      netID: PropTypes.string.isRequired
    }).isRequired
  }
  static defaultProps = {
    body: 'General Endorsement',
    user: {
      name: 'Name',
      netID: ''
    }
  }
  render ({ _id, user, body } = this.props) {
    const { name, netID } = user || {}
    const initials = name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
    return (
      <Card id={_id}
        style={{ marginTop: 26 }}
      >
        <Meta
          avatar={
            <Avatar size='large' style={{ backgroundColor: '#4b2e83' }}>
              {initials}
            </Avatar>
          }
          title={`${name} (${netID})`}
          description={body}
        />
      </Card>
    )
  }
}

export default Endorsement
