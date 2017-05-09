import React, { PropTypes } from 'react'
import { Link } from 'react-router'

import Nav from 'react-bootstrap/lib/Nav'
import Navbar from 'react-bootstrap/lib/Navbar'
import NavItem from 'react-bootstrap/lib/NavItem'
import NavDropdown from 'react-bootstrap/lib/NavDropdown'
import MenuItem from 'react-bootstrap/lib/MenuItem'

// Import Style
import styles from './STFHeader.css'
// Import Images
import STFLogo from './stf.png'

export function STFHeader (props, context) {
  return (
    <Navbar>
      <Navbar.Header>
        <Link to='/' >
        {/* <Navbar.Link href='/'> */}
          <Navbar.Brand className={styles['navbar-brand']}>
            <img src={STFLogo} />
          </Navbar.Brand>
        {/* </Navbar.Link> */}
        </Link>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <NavDropdown eventKey={3} title='Proposals' id='basic-nav-dropdown'>
            <MenuItem eventKey={3.1}>Browse All</MenuItem>
            <MenuItem eventKey={3.2}>My Proposals</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={3.3}>Submit a Proposal</MenuItem>
          </NavDropdown>
          <NavItem eventKey={1} href='#'>Blocks</NavItem>
          <NavItem eventKey={2} href='#'>Calendar</NavItem>
          <NavDropdown eventKey={3} title='Documents' id='basic-nav-dropdown'>
            <MenuItem eventKey={3.1}>Public Documents</MenuItem>
            <MenuItem eventKey={3.2}>License Keyserver</MenuItem>
            <MenuItem eventKey={3.3}>Request for Proposals</MenuItem>
          </NavDropdown>
          {/* <Link to='#'> */}
            <MenuItem pullRight>
              NetID
          </MenuItem>
          {/* </Link> */}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
STFHeader.contextTypes = {
  router: React.PropTypes.object
}

export default STFHeader
