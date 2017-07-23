import React from 'react'
import PropTypes from 'prop-types'

import ReactDataGrid from 'react-data-grid'
import { Table, Input, InputNumber, Switch, Button, Icon } from 'antd'
const { Group } = Button

import { Editors, Formatters } from 'react-data-grid-addons'
const { DropDownEditor } = Editors
const { DropDownFormatter } = Formatters

// import TextArea from './textarea'
import SimpleTextEditor from './editors'

const uuidv4 = require('uuid/v4')

class EditableTable extends React.Component {
  constructor (props) {
    super(props)
    this._columns = [
      {
        key: 'id',
        name: 'ID',
        width: 80
      },
      {
        key: 'task',
        name: 'Title',
        editable: true,
        editor: SimpleTextEditor
        // editor: TextArea
      },
      {
        key: 'priority',
        name: 'Priority',
        editable: true
      },
      {
        key: 'issueType',
        name: 'Issue Type',
        editable: true
      },
      {
        key: 'complete',
        name: '% Complete',
        editable: true
      },
      {
        key: 'startDate',
        name: 'Start Date',
        editable: true
      },
      {
        key: 'completeDate',
        name: 'Expected Complete',
        editable: true
      }
    ]
    const rows = this.createRows(100)
    this.state = ({ rows })
  }

  getRandomDate = (start, end) =>
    new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString()

  createRows = (numberOfRows) => {
    console.log('createRows')
    let rows = []
    for (let i = 1; i < numberOfRows; i++) {
      rows.push({
        id: i,
        task: `Task ${i}`,
        complete: Math.min(100, Math.round(Math.random() * 110)),
        priority: ['Critical', 'High', 'Medium', 'Low'][Math.floor((Math.random() * 3) + 1)],
        issueType: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor((Math.random() * 3) + 1)],
        startDate: this.getRandomDate(new Date(2015, 3, 1), new Date()),
        completeDate: this.getRandomDate(new Date(), new Date(2016, 0, 1))
      })
    }
    return rows
  }

  rowGetter = (i) =>
    this.state.rows[i]

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    // console.log('handleGridRowsUpdated')
    let rows = this.state.rows.slice()
    // let { rows } = this.state.rows

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i]
      // console.log('ARGS', fromRow, toRow, updated)
      // console.log('rowToUpdate', rowToUpdate)
      let updatedRow = Object.assign(rowToUpdate, updated)
      // let updatedRow = React.addons.update(rowToUpdate, {$merge: updated})
      // rows[i] = updatedRow
    }

    this.setState({ rows })
  }
  handleSubmit = () => {
    let { rows } = this.state
    const { onSubmit } = this.props
    onSubmit(rows)
  }

  render (
    { _columns, rowGetter, handleGridRowsUpdated, handleSubmit } = this,
    { rows } = this.state
) {
    return <div>
      <ReactDataGrid
        enableCellSelect cellNavigationMode='changeRow'
        columns={_columns}
        rowGetter={rowGetter}
        rowsCount={rows.length}
        minHeight={500}
        onGridRowsUpdated={handleGridRowsUpdated}
      />
      <Group size='large'>
        {/* <Button size='large' type='primary' ghost onClick={toggleEditAll}>
          <Icon type='edit' />Toggle Editing
        </Button>
        <Button size='large' type='primary' ghost onClick={addRow}>
          <Icon type='plus-circle-o' />Add Row
        </Button> */}
        <Button size='large' type='primary' ghost onClick={handleSubmit}>
          <Icon type='upload' />Save
        </Button>
      </Group>
    </div>
  }
}

export default EditableTable
