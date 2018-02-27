import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import ReactDataSheet from 'react-datasheet'
// Be sure to include styles at some point, probably during your bootstrapping
import 'react-datasheet/lib/react-datasheet.css'

class Spreadsheet extends React.Component {
  constructor (props) {
    super(props)
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
        [{value: 1}, {value: 3}, {value: 3}, {value: 3}, {value: 0, readOnly: true}],
        [{value: 2}, {value: 4}, {value: 4}, {value: 4}, {value: 0, readOnly: true}],
        [{value: 1}, {value: 3}, {value: 3}, {value: 3}, {value: 0, readOnly: true}],
        [{value: 2}, {value: 4}, {value: 4}, {value: 4}, {value: 0, readOnly: true}],
        // Final Row = Grand Total
        [{value: 'Grand Total', readOnly: true, colSpan: 4}, {value: 0, readOnly: true}]
      ]
    }
  }
  generateGrid () {
    let { grid } = this.state

    // Types - enums for row cells that can be referenced using a cell index
    const types = grid[0].map(cell => cell.value)
    console.warn('TYPES', types)

    // Calculate Subtotals using cell types (Price, Tax, Quantity)
    for (let row of grid) {
      let subtotal = 0
      const subtotalCell = row.length - 1
      for (let cell = 0; cell < subtotalCell; cell++) {
        let value = Number.parseFloat(row[cell].value)
        subtotal += (Number.isNaN(value) ? 0 : value)
      }
      console.log('SUBTOTAL', subtotal)
      row[subtotalCell] = { value: subtotal, readOnly: true }
    }

    // Calculate Grand Total by reducing subtotals
    let grandTotal = 0
    const totalRowIndex = grid.length - 1
    const totalCellIndex = grid[totalRowIndex].length - 1
    for (let row of grid) {
      const subtotalCell = row.length - 1
      let value = Number.parseFloat(row[subtotalCell].value)
      grandTotal += (Number.isNaN(value) ? 0 : value)
    }
    grid[totalRowIndex][totalCellIndex].value = grandTotal
    return grid
  }
  render () {
    return (
      <ReactDataSheet
        // data={this.state.grid}
        data={this.generateGrid()}
        valueRenderer={(cell) => cell.value}
        onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
        onCellsChanged={changes => {
          const grid = this.state.grid.map(row => [...row])
          changes.forEach(({cell, row, col, value}) => {
            grid[row][col] = {...grid[row][col], value}
          })
          this.setState({grid})
        }}
      />
    )
  }
}

export default Spreadsheet
