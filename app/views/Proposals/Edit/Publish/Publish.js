import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Icon, Button, message } from 'antd'

import api from '../../../../services'

/*
PUBLICATION PANEL:
Please note, admins can publish at any time,
but authors can only publish if their primary/budget/dept
contacts have signed the proposal, AND submissions are open.

Nothing stops authors from editing proposals,
BUT they have a limited window to create OR publish proposals.
This is often unclear for authors who are more disconnected from the process
(not many read the RFP and our process policies)
*/
/*
NOTE:
Instead of instantiating 4 different forms for a single field, we're using AntD's
API for submission, but using connectForm to instantiate initial values.
*/
@connect(state => ({
  id: state.db.proposal._id,
  published: state.db.proposal.published,
  user: state.user,
  submissions: state.config.submissions,
  year: state.config.year,
  quarter: state.config.quarter
}),
  dispatch => ({ api: bindActionCreators(api, dispatch) })
)
class Publish extends React.Component {
  static propTypes = {
    api: PropTypes.object,
    id: PropTypes.string,
    published: PropTypes.bool,
    submissions: PropTypes.bool,
    year: PropTypes.number,
    quarter: PropTypes.string
  }
  handlePublish = () => {
    const { api, id, year, quarter } = this.props
    const proposal = { published: true, year, quarter }
    const params = {
      id,
      update: { proposal: (prev, next) => Object.assign(prev, { published: true }) }
    }
    api.patch('proposal', proposal, params)
    .then(message.warning(`Proposal is now live!`), 10)
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }
  render ({ form, proposal, published, submissions, user } = this.props) {
    const admin = user.stf && user.stf.admin
    return (
      <div id={proposal}>
        {!published
          ? <div>
            <h1>Publish Proposal</h1>
            <h6>This process is irreversible.</h6>
            <p>
              After you publish a proposal, the process is irreversible on your end to ensure the integrity of proposal data. We may still make minor changes if you ask STF admins (Proposal Officer, the developer, etc).
            </p>
            <p>
              Minor changes (in software versions, product availability, so on) happen all the time and generally speaking your proposal is solid if the major "ask" does not change, because we can always supplement or adjust proposals.
            </p>
            <p>
              Major changes in the ask will require a new proposal, however - please keep us in the loop and notify us of major changes that redirect this project.
            </p>
            <Button size='large' type='primary' ghost
              style={{ width: '100%' }}
              onClick={this.handlePublish}
              disabled={!submissions && !admin}
            >
              <Icon type='rocket' />{submissions || admin ? 'Publish !' : 'Submissions are Closed'}
            </Button>
          </div>
          : <div>
            <h1>This proposal is now live!</h1>
            <p>
              Your proposal is now live! We hope that the new proposal process (introduced Fall  2017) has been a pleasant experience. The STF administration would like to ask you to share any thoughts, concerns and suggestions for improving our new web platform.
            </p>
            <p>
              Please e-mail us at STFCweb@uw.edu and STFagent@uw.edu - we appreciate it!'
            </p>
          </div>
          }
      </div>
    )
  }
}

export default Publish
