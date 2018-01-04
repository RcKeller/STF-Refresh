import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { makeManifestByID } from '../../../../../selectors'

import { Spin, Collapse } from 'antd'
const Panel = Collapse.Panel

@connect(
    //  Might seem counterintuitive, but we're connecting to a manifest and pulling its proposal data.
    (state, props) => {
      const manifest = makeManifestByID(props.id)(state)
      const { proposal: { comments } } = manifest
      return {
        manifest,
        comments,
        screen: state.screen
      }
    }
)
class Endorsements extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    manifest: PropTypes.object,
    comments: PropTypes.array,
    user: PropTypes.object
  }
  render (
    { screen, manifest, comments } = this.props
  ) {
    console.log('Endorsements', comments, manifest)
    return (
      <div>
        {!manifest
          ? <Spin size='large' tip='Loading...' />
          : <section>
            <Collapse bordered={false}
              defaultActiveKey={Object.keys(comments)}
              >
              {comments.map((c, i) => (
                <Panel key={i}
                  header={<b>{c.user.name || 'Endorsement'}</b>}
                  extra={c.user.netID || ''}
                  >
                  <p>{c.body}</p>
                </Panel>
              ))}
            </Collapse>
          </section>
        }
      </div>
    )
  }
}

export default Endorsements
