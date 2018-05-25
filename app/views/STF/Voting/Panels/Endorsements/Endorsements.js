import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Collapse } from 'antd'
const Panel = Collapse.Panel

import { makeManifestByID } from '../../../../../selectors'
import { Loading } from '../../../../../components'

/*
ENDORSEMENTS PANEL:
Renders a summary of student endorsements
*/
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
    return (
      <section>
        <Loading render={manifest} title='Voting Panel'>
          <div>
            {comments && comments.length > 0
              ? <Collapse bordered={false}
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
              : <p><i>No endorsements available.</i></p>
            }
          </div>
        </Loading>
      </section>
    )
  }
}

export default Endorsements
