import React from 'react'
import PropTypes from 'prop-types'

import { Table, Input, InputNumber, Switch, Button, Icon } from 'antd'
const { Group } = Button

const uuidv4 = require('uuid/v4')

class EditableCell extends React.Component {
  constructor (props) {
    super(props)
    const { components, value } = this.props
    this.Edit = components.edit
    this.Cell = components.cell
    this.state = { value }
  }
  componentWillReceiveProps (nextProps) {
    //  Editing disabled - update data via callback and clear cache.
    const { editing, onChange } = this.props
    if (editing && !nextProps.editing) {
      onChange(this.state.value)
    }
  }
  handleChange = (value) => this.setState({ value })
  render (
    { Edit, Cell, handleChange } = this,
    { value } = this.state,
    { editing } = this.props
  ) {
    return (
      <div>
        {editing
          ? <Edit
            value={value} handleChange={this.handleChange}
            size='large'
          />
          : <Cell value={value} />
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
    //  We're just using a loop for compute efficiency, uuid's can be used later.
    for (let i = 0; i < dataSource.length; i++) {
      dataSource[i]._key = i
    }
    //  Apply custom renderers that enable data editing.
    columns.forEach((column, i) => {
      //  Include the data index of the column - this is the prop associated with the data obj
      //  Also, include the type, giving EditableCell the ability to choose a proper component.
      const components = column.render
      column.render = (text, record) =>
        this.renderColumn(text, record, column.dataIndex, components)
    })
    this.columns = columns
    this.state = { data: dataSource, editing: false }
  }
  //  RenderColumn passes cell data and callbacks to display elements.
  renderColumn = (text, record, dataIndex, components) => {
    const { _key } = record
    const { editing } = this.state
    const callback = value => this.handleChange(dataIndex, _key, value)
    return <EditableCell
      editing={editing}
      value={text} components={components}
      onChange={callback}
    />
  }
  toggleEditAll = () => {
    let { data, editing } = this.state
    editing = !editing
    for (let record of data) {
      // record._editable = !record._editable
      record._editable = !editing
    }
    this.setState({ data, editing })
    // console.log('Placeholder func')
  }
  addRow = () => {
    //  Add unique ID's
    let { data } = this.state
    const _key = uuidv4()
    data.push({ _key })
    this.setState({ data })
  }
  deleteRow = () => {
    let { data } = this.state
    console.log('Placeholder func')
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
  handleSubmit = () => {
    //  Set state to false, which will also force subcomponents to save changes to table data.
    this.setState({ editing: false })
    let { data } = this.state
    const { onSubmit } = this.props
    //  Remove unique ID's (keys) from data.
    const values = data.map((item) => {
      const obj = {}
      Object.keys(item).forEach((key) => {
        if (key !== '_key') {
          obj[key] = item[key]
        }
      })
      return obj
    })
    onSubmit(values)
  }
  render (
    { columns, toggleEditAll, addRow, handleSubmit } = this,
    { data } = this.state
  ) {
    const footer = () => (
      <div>
        <p>
          <em>Double click a row to edit it.</em>
        </p>
        <Group size='large'>
          <Button size='large' type='primary' ghost onClick={toggleEditAll}>
            <Icon type='edit' />Edit All
          </Button>
          <Button size='large' type='primary' ghost onClick={addRow}>
            <Icon type='plus-circle-o' />Add Row
          </Button>
          <Button size='large' type='primary' ghost onClick={handleSubmit}>
            <Icon type='upload' />Update
          </Button>
        </Group>
      </div>
    )
    return <Table bordered size='small' pagination={false}
      footer={footer}
      dataSource={data}
      columns={columns}
      // onRowDoubleClick={toggleEditRow}
    />
  }
}
EditableTable.PropTypes = {
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  onSubmit: PropTypes.function
}
export default EditableTable
