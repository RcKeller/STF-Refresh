import React from 'react'
import { connect } from 'react-redux'

import { Timeline, Alert } from 'antd'
const Item = Timeline.Item

@connect(state => ({
  stage: state.config.stage,
  news: state.config.news,
  timeline: state.config.timeline
}))
class Events extends React.Component {
  render (
    { news, timeline, endorsements } = this.props
  ) {
    let past = Array.isArray(timeline) ? timeline.slice() : []
    let future = past.pop()
    return (
      <div>
        <Alert type='info' showIcon banner
          message='Weekly Meetings'
          description={<ul>
            <li>Every Monday</li>
            <li>3:30-5:30PM</li>
            <li>HUB 303</li>
          </ul>}
        />
        <h2>Announcements</h2>
        <p>{news || 'No news for now.'}</p>
        {past && future
          ? <Timeline pending={future}>
            {past.map((e, i) => (
              <Item key={i} color='green'>{e}</Item>
            ))}
          </Timeline>
          : <em>We are currently developing our schedule.</em>
        }
      </div>
    )
  }
}

export default Events
