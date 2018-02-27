import React from 'react'

import 'ag-grid/dist/styles/ag-grid.css'
import 'ag-grid/dist/styles/theme-material.css'

import { AgGridReact } from 'ag-grid-react'
import NumericEditor from './numericEditor'
import createRowData from './createRowData'

class Grid extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      columnDefs: [
        {
          headerName: 'Name',
          field: 'name',
          width: 300
        },
        {
          headerName: 'Mood',
          field: 'mood',
          cellRenderer: 'moodRenderer',
          cellEditor: 'moodEditor',
          editable: true,
          width: 300
        },
        {
          headerName: 'Numeric',
          field: 'number',
          cellEditor: 'numericEditor',
          editable: true,
          width: 280
        }
      ],
      rowData: createRowData(),
      frameworkComponents: {
        numericEditor: NumericEditor
      }
    }
  }

  onGridReady (params) {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
    params.api.sizeColumnsToFit()
  }

  render () {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div style={{ height: '100%', boxSizing: 'border-box' }}>
          <div
            style={{
              boxSizing: 'border-box',
              height: '100%',
              width: '100%'
            }}
            className='ag-theme-fresh'
         >
            <AgGridReact
              id='myGrid'
              columnDefs={this.state.columnDefs}
              rowData={this.state.rowData}
              frameworkComponents={this.state.frameworkComponents}
              // onGridReady={this.onGridReady.bind(this)}
           />
          </div>
        </div>
      </div>
    )
  }
}
export default Grid
