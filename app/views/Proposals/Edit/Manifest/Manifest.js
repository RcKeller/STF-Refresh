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
  // key: '9',
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
}, {
  // key: '7',
  name: {
    editable: false,
    value: 'King Snowden'
  },
  age: {
    editable: false,
    value: '12'
  },
  address: {
    value: 'London, Park Lane no. 1'
  }
}]

@connect(
  state => ({ manifest: state.db.proposal.manifests[0] }),
  dispatch => ({ api: bindActionCreators(api, dispatch) })
)
class Signatures extends React.Component {
  handleSubmit (values) {
    console.log('HANDLE SUBMIT', values)
    // for (record of values) {
    //   Object.keys(record).forEach((prop, i) => {
    //     //  Replace props with just their values
    //     record[prop] = record[prop].value
    //   })
    //   delete record.key
    // }
  }

  render ({ manifest } = this.props) {
    console.log('LOADED MANIFEST', manifest)
    return (
      <div>
        <EditableTable
          columns={columns}
          dataSource={dataSource}
          onSubmit={(values) => this.handleSubmit(values)}
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
