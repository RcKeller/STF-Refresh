import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import ReactDataSheet from 'react-datasheet'
// // Be sure to include styles at some point, probably during your bootstrapping
// import 'react-datasheet/lib/react-datasheet.css'

// const calculateTotal = (price, quantity, tax = 0) =>
//   (price * quantity) * (100 / tax)

class Spreadsheet extends React.Component {
  constructor (props) {
    super(props)
    console.error(props)
    let { headers, data } = {
      headers: ['Name', 'Description', 'Price', 'Tax', 'Quantity', 'TOTAL'],
      data: [
        [{value: 'Some Item'}, {value: 'Description Here'}, {value: 1}, {value: 10.1}, {value: 5}],
        [{value: 'Some Item'}, {value: 'Description Here'}, {value: 1}, {value: 10.1}, {value: 5}],
        [{value: 'Some Item'}, {value: 'Description Here'}, {value: 1}, {value: 10.1}, {value: 5}],
        [{value: 'Some Item'}, {value: 'Description Here'}, {value: 1}, {value: 10.1}, {value: 5}],
        [{value: 'Some Item'}, {value: 'Description Here'}, {value: 1}, {value: 10.1}, {value: 5}]
      ]
    }
    // Structure the value prop for cells
    data = data.map(row => {
      let transformedRow = row.map(value => ({ value }))
      transformedRow.push({ value: 0, readOnly: true })
      return transformedRow
    })
    //  Add headers
    data.unshift(
      headers.map(value => ({ value, readOnly: true }))
    )
    // Append grand total row
    data.push([
      { value: 'Grand Total', readOnly: true, colSpan: (headers.length - 1) },
      { value: 0, readOnly: true }
    ])
    console.warn('GRID:', data)
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
        [{value: 'Some Item'}, {value: 'Description Here'}, {value: 1}, {value: 10.1}, {value: 5}, {value: 0, readOnly: true}],
        [{value: 'Some Item'}, {value: 'Description Here'}, {value: 1}, {value: 10.1}, {value: 5}, {value: 0, readOnly: true}],
        [{value: 'Some Item'}, {value: 'Description Here'}, {value: 1}, {value: 10.1}, {value: 5}, {value: 0, readOnly: true}],
        [{value: 'Some Item'}, {value: 'Description Here'}, {value: 1}, {value: 10.1}, {value: 5}, {value: 0, readOnly: true}],
        [{value: 'Some Item'}, {value: 'Description Here'}, {value: 1}, {value: 10.1}, {value: 5}, {value: 0, readOnly: true}],
        // Final Row = Grand Total
        [{value: 'Grand Total', readOnly: true, colSpan: 5}, {value: 0, readOnly: true}]
      ]
    }
  }
  generateGrid () {
    const { grid } = this.state

    // Make a mutable copy of the grid with values only
    let header = grid[0]
    let rows = grid.slice(1, grid.length - 1)
    let footer = grid[grid.length - 1]

    // Shift pops the first element of the grid off, which contains headers
    // We'll use these headers as enums in price calculations.
    let types = {}
    for (const [index, cell] of header.entries()) {
      const type = cell.value.toLowerCase()
      types[type] = index
    }

    // Update totals, incrementing a grandTotal counter at the same time.
    let grandTotal = 0
    for (let row of rows) {
      const price = row[types.price].value
      const quantity = row[types.quantity].value
      const tax = row[types.tax]
        ? row[types.tax].value
        : 0
      const total = parseFloat(
          ((price * quantity) * ((tax / 100) + 1))
          .toFixed(2)
        )
      row[types.total] = { value: total, readOnly: true }
      grandTotal += (total || 0)
    }
    // Update Grand Total
    footer[1] = { value: grandTotal, readOnly: true }
    return grid

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
  }
  onCellsChanged = (changes) => {
    const grid = this.state.grid.map(row => [...row])
    changes.forEach(({cell, row, col, value}) => {
      grid[row][col] = {...grid[row][col], value}
    })
    this.setState({grid})
  }
  render () {
    return (
      <div>
        <ReactDataSheet
          // data={this.state.grid}
          data={this.generateGrid()}
          valueRenderer={(cell) => (cell.value).toString()}
          onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
          onCellsChanged={changes => {
            const grid = this.state.grid.map(row => [...row])
            changes.forEach(({cell, row, col, value}) => {
              grid[row][col] = {...grid[row][col], value}
            })
            this.setState({grid})
          }}
        />
      </div>
    )
  }
}

export default Spreadsheet
