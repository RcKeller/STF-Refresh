import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// import { Row, Col, Alert, Form, Switch, message } from 'antd'

// import { layout, feedback, help, rules, disableSubmit } from '../../../../util/form'
import api from '../../../../services'
import EditableTable from '../../../../util/table'

const columns = [{
  title: 'name',
  dataIndex: 'name',
  width: '25%'
}, {
  title: 'age',
  dataIndex: 'age',
  width: '15%'
}, {
  title: 'address',
  dataIndex: 'address',
  width: '40%'
}]

const dataSource = [{
  key: '0',
  name: {
    editable: false,
    value: 'Edward King 0'
  },
  age: {
    editable: false,
    value: '32'
  },
  address: {
    value: 'London, Park Lane no. 0'
  }
}]

@connect(
  state => ({ manifest: state.db.proposal.manifests[0] }),
  dispatch => ({ api: bindActionCreators(api, dispatch) })
)
class Signatures extends React.Component {
  render ({ manifest } = this.props) {
    console.log('LOADED MANIFEST', manifest)
    return (
      <div>
        <EditableTable
          columns={columns}
          dataSource={dataSource}
        />
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
