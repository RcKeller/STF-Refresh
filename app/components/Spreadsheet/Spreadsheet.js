import React from 'react'
import PropTypes from 'prop-types'

import ReactDataGrid from 'react-data-grid'
import { Toolbar } from 'react-data-grid-addons'
import { Button, Icon } from 'antd'
const { Group } = Button

import Menu from './Menu'

// import { Editors, Formatters } from 'react-data-grid-addons'
// const { DropDownEditor } = Editors
// const { DropDownFormatter } = Formatters

import { SimpleText, SimpleNumber } from './Editors'

class SpreadSheet extends React.Component {
  constructor (props) {
    super(props)
    const { columns, data } = this.props
    this.columns = columns
    for (let col of columns) {
      col.resizable = true
      // col.draggable = true
    }
    this.state = ({ rows: data })
  }

  rowGetter = (i) =>
    this.state.rows[i]

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    let rows = this.state.rows.slice()
    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i]
      let updatedRow = Object.assign(rowToUpdate, updated)
    }

    this.setState({ rows })
  }

  deleteRow = (e, { rowIdx }) => {
    console.log('deleteRow', e, rowIdx)
    let { rows } = this.state
    rows.splice(rowIdx, 1)
    this.setState({rows})
  }

  insertRowAbove = (e, { rowIdx }) => {
    console.log('insertRowAbove', e, rowIdx)
    this.insertRow(rowIdx)
  }

  insertRowBelow = (e, { rowIdx }) => {
    console.log('insertRowBelow', e, rowIdx)
    this.insertRow(++rowIdx)
  }

  insertRow = (rowIdx) => {
    console.log('insertRow', rowIdx)
    let { rows } = this.state
    const newRow = {}
    rows.splice(rowIdx, 0, newRow)
    this.setState({ rows })
  }

  handleSubmit = () => {
    let { rows } = this.state
    const { onSubmit } = this.props
    onSubmit(rows)
  }

  render (
    { rowGetter, handleGridRowsUpdated, handleAddRow, handleSubmit } = this,
    { columns } = this.props,
    { rows: { length } } = this.state
) {
    return <div>
      <ReactDataGrid
        enableCellSelect cellNavigationMode='changeRow'
        contextMenu={<Menu
          onRowDelete={this.deleteRow}
          onRowInsertAbove={this.insertRowAbove}
          onRowInsertBelow={this.insertRowBelow}
        />}

        // minHeight={500}
        // toolbar={<Toolbar onAddRow={handleAddRow} />}
        columns={columns}
        rowGetter={rowGetter}
        rowsCount={length}
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

export default SpreadSheet
