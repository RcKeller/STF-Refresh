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
    /*
    TASK: Delete rows with 0 quantity
    */
    let rows = grid
      // SELECT ROWS WITH DATA
      .slice(1, grid.length - 1)
      // FILTER ROWS THAT HAVE DATA
      .filter((row, i) =>
        row[4] && row[4].value >= 1
      )
      // ACCUMULATE SUBTOTALS / CURRY _ID
      .map(row => {
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
    const lastRow = rows[rows.length - 1]
    if (
        (!lastRow) ||
        (lastRow[4] && lastRow[4].value >= 1)
      ) {
      rows.push(this.newRow)
    }
    console.log('Rows with new row', rows)

    const header = this.header
    let footer = this.footer
    footer[1].value = grandTotal
    rows.unshift(header)
    rows.push(footer)

    console.log('Committing rows', rows)
    /*
    TASK: Redefine state to trigger rerender
    */
    this.setState({ grid: rows })
  }
  calculateDataWithTotals () {
    const { grid } = this.state

    // Make a mutable copy of the grid with values only
    let rows = grid.slice(1, grid.length - 1)
    let footer = grid[grid.length - 1]

    // Update totals, incrementing a grandTotal counter at the same time.
    let grandTotal = 0
    for (let row of rows) {
      const summaryCell = row.length - 1
      const [name, description, price, tax, quantity] = row.map(cell => cell.value)
      const { _id } = row[summaryCell]
      const value = parseFloat(
          ((price * quantity) * ((tax / 100) + 1))
          .toFixed(2)
        )
      row[summaryCell] = { _id, value, readOnly: true }
      grandTotal += (value || 0)
    }
    // Update Grand Total
    footer[1] = { value: grandTotal, readOnly: true }
    return grid
  }
  ensureNewRow (grid) {
    const finalRow = grid[grid.length - 2]
    const hasData = finalRow.findIndex(cell => cell.value) >= 0
    if (hasData) {
      const empty = { value: '' }
      grid.splice(
        grid.length - 1,
        0,
        [empty, empty, empty, empty, empty, { _id: '', value: '', readOnly: true }]
      )
    }
  }
  render (
    { prompt, disabled } = this.props
  ) {
    // let data = this.calculateDataWithTotals()
    let data = this.state.grid
    // this.deserializeManifest(data)
    // this.deleteZeroQuantityRows(data)
    // this.ensureNewRow(data)
    // const finalRow = data[data.length - 2]
    // if (finalRow[5] > 0) {
    //   this.initializeNewRow()
    // }
    // console.log(newDataRow)
    // console.warn('DOM REF', ReactDOM.findDOMNode('datasheet'))
    // const selected = (this.refs.datasheet)
    //   ? this.refs.datasheet.state && this.refs.datasheet.state.start
    //   : {}

    // console.log('SELECTED', selected)
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

/*
constructor (props) {
  super(props)
  console.error(props)
  const { data, newData } = props

  function serializeManifest (manifest) {
    let data = []
    for (let item of manifest) {
      const { _id, name, price, tax, description, quantity } = item || {}
      //  Create a record in the order of headers
      const record = [name, description, price, tax, quantity]
        .map(value => ({ value }))
      // Push our "summary" cell, containing subtotals and the _id
      record.push({ _id, value: 0, readOnly: true })
      console.log(record)
      data.push(record)
    }
    // Add Header: [{ value: 'TITLE' }, ... ]
    data.unshift(
      this.headers.map(value => ({ value }))
    )
    // Add Footer w/ proper span
    data.push([
      { value: 'Grand Total', readOnly: true, colSpan: (this.headers.length - 1) },
      { value: 0, readOnly: true }
    ])
  }
  let transformedData = []
  for (let item of data) {
    const { _id, name, price, tax, description, quantity } = item || {}
    //  Create a record in the order of headers
    const record = [name, description, price, tax, quantity]
      .map(value => ({ value }))
    // Push our "summary" cell, containing subtotals and the _id
    record.push({ _id, value: 0, readOnly: true })
    console.log(record)
    transformedData.push(record)
  }
  // Add Header: [{ value: 'TITLE' }, ... ]
  transformedData.unshift(
    this.headers.map(value => ({ value }))
  )
  // Add Footer w/ proper span
  transformedData.push([
    { value: 'Grand Total', readOnly: true, colSpan: (this.headers.length - 1) },
    { value: 0, readOnly: true }
  ])
  console.error(transformedData)
  this.state = {
    grid: [
      [
        {value: 'Name', readOnly: true},
        {value: 'Description / Vendor', readOnly: true},
        {value: 'Price', readOnly: true},
        {value: 'Tax', readOnly: true},
        {value: 'Quantity', readOnly: true},
        {value: 'TOTAL', readOnly: true}
      ],
      // Final cell = subtotal
      [{value: 'Some Item', TEST: 'uuid'}, {value: 'Description Here'}, {value: 1}, {value: 10.1}, {value: 5}, {value: 0, readOnly: true}],
      [{value: 'Some Item'}, {value: 'Description Here'}, {value: 1}, {value: 10.1}, {value: 5}, {value: 0, readOnly: true}],
      [{value: 'Some Item'}, {value: 'Description Here'}, {value: 1}, {value: 10.1}, {value: 5}, {value: 0, readOnly: true}],
      [{value: 'Some Item'}, {value: 'Description Here'}, {value: 1}, {value: 10.1}, {value: 5}, {value: 0, readOnly: true}],
      [{value: 'Some Item'}, {value: 'Description Here'}, {value: 1}, {value: 10.1}, {value: 5}, {value: 0, readOnly: true}],
      // Final Row = Grand Total
      [{value: 'Grand Total', readOnly: true, colSpan: 5}, {value: 0, readOnly: true}]
    ]
  }
}
*/

/*
// const taxes = typeof types['tax'] === 'string'
// for (let row of rows) {
//   const price = row[types['price']]
//   const quantity = row[types['quantity']]
//   const subtotal = taxes
//     ? price * quantity * ((row[types['tax']] / 100) + 1)
//     : price * quantity
// }

// const types = {}
// for (const [index, cell] of grid[0].entries()) {
//   const type = cell.value.toLowerCase()
//   types[type] = index
// }
// console.log('TYPES', types)
// for (let row = 1; row < grid.length, row++) {
//   let subtotal = 0
//   subtotal += (row[types["price"]] * row[types["quantity"]) * (row[types["tax"]])
// }
// let rows = grid.slice()
// let header = rows.shift()
// const types = {}
// for (const [index, cell] of header.entries()) {
//   types[index] = cell.value.toLowerCase()
// }
// console.log('TYPES', types)
// const types = grid[0].map(cell => cell.value)
// Typemap becomes a map of enums to cell indexes for grid rows (e.g. row[1] is price, etc)

// Types - enums for row cells that can be referenced using a cell index
// const types = grid[0].map(cell => cell.value)

// for (let t)
// console.warn('TYPES', types)

// Calculate Subtotals using cell types (Price, Tax, Quantity)
// for (let row of grid) {
//   let subtotal = 0
//   const subtotalCell = row.length - 1
//   for (let cell = 0; cell < subtotalCell; cell++) {
//
//     if types[cell] === 'Tax' {
//
//     }
//     // let value = Number.parseFloat(row[cell].value)
//     // subtotal += (Number.isNaN(value) ? 0 : value)
//   }
//   console.log('SUBTOTAL', subtotal)
//   row[subtotalCell] = { value: subtotal, readOnly: true }
// }
//
// // Calculate Grand Total by reducing subtotals
// let grandTotal = 0
// const totalRowIndex = grid.length - 1
// const totalCellIndex = grid[totalRowIndex].length - 1
// for (let row of grid) {
//   const subtotalCell = row.length - 1
//   let value = Number.parseFloat(row[subtotalCell].value)
//   grandTotal += (Number.isNaN(value) ? 0 : value)
// }
// grid[totalRowIndex][totalCellIndex].value = grandTotal
*/
