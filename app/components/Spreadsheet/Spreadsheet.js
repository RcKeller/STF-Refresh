import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { Button, Icon } from 'antd'
const ButtonGroup = Button.Group

import Instructions from './Instructions'

import ReactDataSheet from 'react-datasheet'
// // Be sure to include styles at some point, probably during your bootstrapping
// import 'react-datasheet/lib/react-datasheet.css'

// const calculateTotal = (price, quantity, tax = 0) =>
//   (price * quantity) * (100 / tax)

class FinancialSpreadsheet extends React.Component {
  static propTypes = {
    //  Column config api is preserved, but editable is REQUIRED
    columns: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.node.isRequired,
      key: PropTypes.string.isRequired,
      editable: PropTypes.bool.isRequired,
      editor: PropTypes.func,
      width: PropTypes.number
    })).isRequired,
    //  Your dataset is never mutated and can even be ref'd.
    data: PropTypes.array.isRequired,
    //  NewData is a prop representing what a brand new field / row should be like (defaults).
    newData: PropTypes.object,
    //  onSubmit is your callback for receiving well formed data.
    onSubmit: PropTypes.func.isRequired,
    //  Financial will calculate and show subtotals as necessary
    financial: PropTypes.bool,
    //  Prompt will override the default submit button text (which is "Save")
    prompt: PropTypes.string,
    //  Initial total, disposed of once rows update.
    total: PropTypes.number
  }
  // headers = ['Name', 'Description', 'Price', 'Tax', 'Quantity', 'TOTAL']
  header = [
    { value: 'Name', readOnly: true, width: '20%' },
    { value: 'Description / Vendor', readOnly: true, width: '50%' },
    { value: 'Price', readOnly: true, width: '10%' },
    { value: 'Tax', readOnly: true, width: '5%' },
    { value: 'Quantity', readOnly: true, width: '5%' },
    { value: 'Total', readOnly: true, width: '10%' }
  ]
  newRow = [{value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}, { _id: '', value: '', readOnly: true }]
  footer = [{value: '', readOnly: true, colSpan: 5}, {value: 0, readOnly: true}]
  constructor (props) {
    super(props)
    console.error(props)
    const { data, newData } = props
    /*
    serializeManifest:
    Denormalizes items from a manifest to confirm to react-datasheet's data scheme
    Scheme has records that are like [ {value}, {value}, {value}]...
    The final cell is a "summary" cell containing subtotals and item _ids for future ref
    */
    let grid = this.serializeManifest(data)
    // console.warn('serializeManifest', grid)
    this.state = { grid }
  }
  serializeManifest = (manifest) => {
    let data = []
    for (let item of manifest) {
      const { _id, name, price, tax, description, quantity } = item || {}
      //  Create a record in the order of headers
      const record = [name, description, price, tax, quantity]
        .map(value => ({ value }))
      // Push our "summary" cell, containing subtotals and the _id
      record.push({ _id, value: 0, readOnly: true })
      data.push(record)
    }
    //  Add Header / footer
    data.unshift(this.header)
    data.push(this.footer)
    return data
  }
  deserializeManifest = (data) => {
    // console.warn('deserializeManifest - start', data)
    const rows = data.slice(1, data.length - 1)
    let normalizedData = []
    for (let row of rows) {
      const summaryCell = row.length - 1
      const [name, description, price, tax, quantity] = row.map(cell => cell.value)
      const { _id } = row[summaryCell]
      normalizedData.push({ _id, name, description, price, tax, quantity })
    }
    // console.log('deserializeManifest - end', normalizedData)
    return data
  }
  /*
  onCellsChanged:
  - Applies changes to the grid
    - Deletes rows of 0 quantity
  - Recalculates totals
  -
  */
  onCellsChanged = (changes) => {
    let grid = this.state.grid.slice()
    let grandTotal = 0
    /*
    TASK: Apply changes to the grid (immutably using slice())
    */
    for (let change of changes) {
      const { row, col, value } = change
      grid[row][col] = {...grid[row][col], value}
    }
    let rows = grid.slice(1, grid.length - 1)
    console.warn('Initial Rows', rows)
    /*
    TASK: Delete rows with 0 quantity
    */
    // FILTER ROWS THAT HAVE DATA
    // rows = rows
    //   .filter((row, i) => {
    //     console.log(i, row)
    //     return row[4] && row[4].value >= 1
    //   })
    // console.error('Filtered rows', rows)
    // ACCUMULATE SUBTOTALS / CURRY _ID
    rows = rows.map(row => {
      const summaryCell = row.length - 1
      const [name, description, price, tax, quantity] = row.map(cell => cell.value)
      const { _id } = row[summaryCell]
      const value = parseFloat(
          ((price * quantity) * ((tax / 100) + 1))
          .toFixed(2)
        )
      row[summaryCell] = { _id, value, readOnly: true }
      grandTotal += (value || 0)
      return row
    })
    console.log('Core rows', rows)
    /*
    TASK: Initialize new row
    Check the last row to see if an item has a user-defined quantity
    If so, initialize a new row!
    */
    // const lastRow = rows[rows.length - 1]
    // if (
    //     (!lastRow) ||
    //     (lastRow[4] && lastRow[4].value >= 1)
    //   ) {
    //   rows.push(this.newRow)
    // }
    // console.log('Rows with new row', rows)

    let footer = this.footer
    footer[1].value = grandTotal
    rows.unshift(this.header)
    rows.push(this.newRow)
    rows.push(footer)

    console.log('Committing rows', rows)
    /*
    TASK: Redefine state to trigger rerender
    */
    this.setState({ grid: rows })
  }
  render (
    { prompt, disabled } = this.props
  ) {
    let data = this.state.grid
    return (
      <div style={{ width: '100%', marginTop: 8 }}>
        <small><em>Editable Datasheet - Please complete as accurately as you can. </em></small>
        <ButtonGroup size='small' style={{ float: 'right' }}>
          <Button ghost type='danger'>
            <Icon type='close' />Delete
          </Button>
          <Button type='primary'
            // onClick={() => console.log(selected)}
          >
            Add<Icon type='plus' />
          </Button>
        </ButtonGroup>
        <ReactDataSheet
          ref='datasheet'
          // data={this.state.grid}
          data={data}
          // valueRenderer={(cell, i) => <span className={this.cellClasses[i]}>{(cell.value).toString()}</span>}
          valueRenderer={(cell) => (cell.value).toString()}
          onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
          onCellsChanged={this.onCellsChanged}
        />
        <Button
          disabled={disabled}
          type='primary' size='small'
          style={{ width: '100%', borderRadius: 'none' }}
        >
          <span><Icon type='cloud-upload-o' />{prompt || 'Submit'}</span>
        </Button>
        <small><span id='foot-1'>[1]</span> <i>A few groups on campus have tax exemption issued via certification from the UW, including a few research groups, and The Daily newspaper. If you have this exemption, you should already be aware of it, and do not need to add tax on your requested items.</i></small>
      </div>
    )
  }
}

export default FinancialSpreadsheet
