import React from 'react'
import PropTypes from 'prop-types'

import { Menu } from 'react-data-grid-addons'
const { ContextMenu, MenuItem, SubMenu } = Menu

import styles from './Menu.css' //  global, doesn't work if hashed.
class MyMenu extends React.Component {
  onRowDelete = (e, data) => {
    const { onRowDelete } = this.props
    if (typeof onRowDelete === 'function') {
      onRowDelete(e, data)
    }
  }
  onRowInsertAbove = (e, data) => {
    const { onRowInsertAbove } = this.props
    if (typeof onRowInsertAbove === 'function') {
      onRowInsertAbove(e, data)
    }
  }
  onRowInsertBelow = (e, data) => {
    const { onRowInsertBelow } = this.props
    if (typeof onRowInsertBelow === 'function') {
      onRowInsertBelow(e, data)
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

MyMenu.propTypes = {
  onRowDelete: PropTypes.func.isRequired,
  onRowInsertAbove: PropTypes.func.isRequired,
  onRowInsertBelow: PropTypes.func.isRequired,
  rowIdx: PropTypes.number,
  idx: PropTypes.number
}

export default MyMenu
