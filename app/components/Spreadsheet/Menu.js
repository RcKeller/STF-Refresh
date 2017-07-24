import React from 'react'
import PropTypes from 'prop-types'

import ReactDataGrid from 'react-data-grid'
// import { Toolbar } from 'react-data-grid-addons'
// const { Menu: { ContextMenu, MenuItem, SubMenu } } = require('react-data-grid-addons');
import { Menu } from 'react-data-grid-addons'
const { ContextMenu, MenuItem, SubMenu } = Menu

import styles from './Menu.css'
class MyMenu extends React.Component {

  onRowDelete = (e, data) => {
    if (typeof (this.props.onRowDelete) === 'function') {
      this.props.onRowDelete(e, data)
    }
  }

  onRowInsertAbove = (e, data) => {
    if (typeof (this.props.onRowInsertAbove) === 'function') {
      this.props.onRowInsertAbove(e, data)
    }
  }

  onRowInsertBelow = (e, data) => {
    if (typeof (this.props.onRowInsertBelow) === 'function') {
      this.props.onRowInsertBelow(e, data)
    }
  }

  render () {
    return (
      <ContextMenu>
        <MenuItem data={{rowIdx: this.props.rowIdx, idx: this.props.idx}} onClick={this.onRowDelete}>Delete Row</MenuItem>
        <SubMenu title='Insert Row'>
          <MenuItem data={{rowIdx: this.props.rowIdx, idx: this.props.idx}} onClick={this.onRowInsertAbove}>Above</MenuItem>
          <MenuItem data={{rowIdx: this.props.rowIdx, idx: this.props.idx}} onClick={this.onRowInsertBelow}>Below</MenuItem>
        </SubMenu>
      </ContextMenu>
    )
  }
}

// MyMenu.propTypes = {
//   onRowDelete: PropTypes.func.isRequired,
//   onRowInsertAbove: PropTypes.func.isRequired,
//   onRowInsertBelow: PropTypes.func.isRequired,
//   rowIdx: PropTypes.string.isRequired,
//   idx: PropTypes.string.isRequired
// }

export default MyMenu
