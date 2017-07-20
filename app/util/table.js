import React from 'react'
import PropTypes from 'prop-types'

import { Table, Input, Button } from 'antd'

class EditableCell extends React.Component {
  constructor (props) {
    super(props)
    const { value } = this.props
    this.state = { value }
  }
  componentWillReceiveProps (nextProps) {
    //  Editing disabled - update data via callback and clear cache.
    const { editable, onChange } = this.props
    if (editable && !nextProps.editable) {
      onChange(this.state.value)
    }
  }
  //  Handle the change in child state, then bubble the event to the parent component.
  handleChange = (e) => {
    const value = e.target.value
    this.setState({ value })
  }
  render (
    { handleChange } = this,
    { value } = this.state,
    { editable } = this.props
  ) {
    return (
      <div>
        {editable
          ? <Input value={value} onChange={handleChange} />
          : <span>{value}</span>
        }
      </div>
    )
  }
}
EditableCell.PropTypes = {
  value: PropTypes.string,  //  casting?
  editable: PropTypes.bool,
  handleUpdate: PropTypes.function
}

class EditableTable extends React.Component {
  constructor (props) {
    super(props)
    let { columns, dataSource } = this.props
    //  Add unique keys to your data. These serve as unique identifiers.
    //  Then set editing to false. Double clicking activates a callback, inverting this value.
    for (let i = 0; i < dataSource.length; i++) {
      dataSource[i]._key = i
      dataSource[i]._editable = false
    }
    //  Apply custom renderers that enable data editing.
    columns.forEach((column, i) => {
      //  Include the data index of the column - this is the prop associated with the data obj
      column.render = (text, record) =>
        this.renderColumn(text, record, columns[i].dataIndex)
    })
    this.columns = columns
    this.state = { data: dataSource }
  }
  //  RenderColumn passes cell data and callbacks to display elements.
  renderColumn = (text, record, dataIndex) => {
    console.log('renderColumn')
    const { _editable, _key } = record
    return <EditableCell
      editable={_editable} value={text}
      onChange={value => this.handleChange(dataIndex, _key, value)}
    />
  }
  //  ToggleRow finds the record with the specified key and sets it to editable.
  toggleRowEditing = (record) => {
    console.log('toggleRowEditing')
    let { data } = this.state
    const key = record._key
    data.forEach((d, i) => {
      if (d._key === key) {
        data[i]._editable = !record._editable
        this.setState({ data })
      }
    })
  }
  //  Handlechange identifies the prop (dataIndex) modified in a col, updates the data val.
  handleChange = (dataIndex, key, value) => {
    let { data } = this.state
    data.forEach((d, i) => {
      if (d._key === key) {
        data[i][dataIndex] = value
        this.setState({ data })
      }
    })
  }
  //  Handlesubmit scrubs out _key and _editable when submitting to parent.
  handleSubmit = (d) => {
    let { data } = this.state
    // for (let r of values) {
    //   // delete r._key
    //   // delete r._editable
    // }
    data.forEach(function (record, i) {
      console.log(record)
      record._key = 'TEST'
    })
    // this.props.onSubmit(newData)
  }
  render (
    { columns, toggleRowEditing, handleSubmit } = this,
    { data } = this.state
  ) {
    const footer = () => (
      <div>
        <p>
          <em>Double click a row to edit it.</em>
        </p>
        <Button size='large' type='primary' onClick={() => handleSubmit(this.state.data)}>Update</Button>
      </div>
    )
    return <Table bordered footer={footer}
      dataSource={data}
      columns={columns}
      onRowDoubleClick={toggleRowEditing}
    />
  }
}
EditableTable.PropTypes = {
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  onSubmit: PropTypes.function
}
export default EditableTable
