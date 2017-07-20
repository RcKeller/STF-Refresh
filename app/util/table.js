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
  handleChange (e) {
    const value = e.target.value
    this.setState({ value })
  }
  render (
    { value } = this.state,
    { editable } = this.props
  ) {
    return (
      <div>
        {editable
          ? <Input
            value={value}
            onChange={e => this.handleChange(e)}
          />
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
  renderColumn (text, record, dataIndex) {
    const { _editable, _key } = record
    return <EditableCell
      editable={_editable} value={text}
      onChange={value => this.handleChange(dataIndex, _key, value)}
    />
  }
  //  ToggleRow finds the record with the specified key and sets it to editable.
  toggleRowEditing = (record) => {
    let { data } = this.state
    for (let d of data) {
      if (d._key === record._key) d._editable = !record._editable
    }
    this.setState({ data })
  }
  //  Handlechange identifies the prop (dataIndex) modified in a col, updates the data val.
  handleChange (dataIndex, key, value) {
    let { data } = this.state
    for (let d of data) {
      if (d._key === key) d[dataIndex] = value
    }
    this.setState({ data })
  }
  //  Handlesubmit scrubs out _key and _editable when submitting to parent.
  handleSubmit = () => {
    console.log('submit in table')
    let { data } = this.state
    for (let d of data) {
      delete d._editable
      delete d._key
    }
    this.props.onSubmit(data)
  }
  render (
    { columns, toggleRowEditing, handleSubmit } = this,
    { data } = this.state,
    // { onSubmit } = this.props
  ) {
    return (
      <div>
        <Table bordered
          dataSource={data}
          columns={columns}
          onRowDoubleClick={toggleRowEditing}
        />
        <Button size='large' type='primary' onClick={handleSubmit}>
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
