import React from 'react'
import PropTypes from 'prop-types'

import ReactDataGrid from 'react-data-grid'
import { Toolbar } from 'react-data-grid-addons'
import { Button, Icon } from 'antd'
const { Group } = Button

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

  handleAddRow = () => {
    let { rows } = this.state
    rows.push({})
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
        // minHeight={500}
        toolbar={<Toolbar onAddRow={handleAddRow} />}
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
