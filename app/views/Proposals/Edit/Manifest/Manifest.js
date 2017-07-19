import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// import { Row, Col, Alert, Form, Switch, message } from 'antd'

// import { layout, feedback, help, rules, disableSubmit } from '../../../../util/form'
import api from '../../../../services'
import EditableTable from '../../../../util/table'

@connect(
  state => ({ manifest: state.db.proposal.manifests[0] }),
  dispatch => ({ api: bindActionCreators(api, dispatch) })
)
class Signatures extends React.Component {
  render ({ manifest } = this.props) {
    console.log('LOADED MANIFEST', manifest)
    return (
      <div>
        <EditableTable />
      </div>
    )
  }
}
Signatures.propTypes = {
  form: PropTypes.object,
  api: PropTypes.object,
  contacts: PropTypes.array,
  user: PropTypes.object
}
export default Signatures
