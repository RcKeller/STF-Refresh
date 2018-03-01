import React from 'react'
import PropTypes from 'prop-types'

import { Card, Icon, Avatar } from 'antd'
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
    user: PropTypes.shape({
      name: 'Name',
      netID: ''
    }).isRequired
  }
  render ({ _id, user, body } = this.props) {
    const { name, netID } = user || {}
    console.log(this.props)
    const initials = name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
    return (
      <Card id={_id}
        style={{ marginBottom: 26 }}
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
