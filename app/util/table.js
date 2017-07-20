import React from 'react'
import PropTypes from 'prop-types'

import { Table, Input, Button } from 'antd'

class EditableTable extends React.Component {
  constructor (props) {
    super(props)
    let { columns, dataSource } = this.props
    //  Apply custom renderers that enable data editing.
    for (let column of columns) {
      column.render = (text, record, index) => this.renderColumn(text, record, index)
    }
    //  Add unique keys to your data. These serve as unique identifiers.
    //  Then set editing to false. Double clicking activates a callback, inverting this value.
    for (let i = 0; i < dataSource.length; i++) {
      dataSource[i].key = i
      dataSource[i].editable = false
    }
    this.columns = columns
    this.state = { data: dataSource }
  }
  renderColumn (text, record, index) {
    return <span>{text}</span>
  }
  render (
    { columns, toggleRowEditing } = this,
    { data } = this.state,
    { onSubmit } = this.props
  ) {
    return (
      <div>
        <Table bordered
          dataSource={data}
          columns={columns}
          onRowDoubleClick={toggleRowEditing}
        />
        <Button size='large' type='primary' onClick={() => onSubmit(data)}>
          Update
        </Button>
      </div>
    )
  }
}
EditableTable.PropTypes = {
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  onSubmit: PropTypes.function
}
export default EditableTable
