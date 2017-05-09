import React from 'react'
import { Link } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'

import Nav from 'react-bootstrap/lib/Nav'
import Navbar from 'react-bootstrap/lib/Navbar'
import NavItem from 'react-bootstrap/lib/NavItem'
import NavDropdown from 'react-bootstrap/lib/NavDropdown'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import Image from 'react-bootstrap/lib/Image'
// Import Style
import styles from './STFHeader.css'
// Import Images
// import STFLogo from './stf.png'

export function STFHeader (props, context) {
  return (
    <Navbar>
      <Navbar.Header>
        <Link to='/'>
          {/* <Navbar.Brand className={styles['navbar-image']}> */}
          {/* <img src={STFLogo} /> */}
          <Navbar.Brand>
            <div className={styles['stf-logo']} />
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle />

      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <NavDropdown eventKey={3} title='Proposals' id='basic-nav-dropdown'>
            <LinkContainer to='/proposals/browse/' >
              <MenuItem eventKey={3.1}>Browse All</MenuItem>
            </LinkContainer>
            <LinkContainer to='/proposals/edit/' >
              <MenuItem eventKey={3.2}>My Proposals</MenuItem>
            </LinkContainer>
            <MenuItem divider />
            <LinkContainer to='/proposals/new/' >
              <MenuItem eventKey={3.3}>Submit a Proposal</MenuItem>
            </LinkContainer>
          </NavDropdown>
          <NavItem eventKey={1} href='#'>Blocks</NavItem>
          <NavItem eventKey={2} href='#'>Calendar</NavItem>
          <NavDropdown eventKey={3} title='Documents' id='basic-nav-dropdown'>
            <LinkContainer to='/documents/' >
              <MenuItem eventKey={3.1}>Public Documents</MenuItem>
            </LinkContainer>
            <MenuItem href='http://itconnect.uw.edu/wares/acquiring-software-and-hardware/keyserver-help-for-it-staff/' eventKey={3.2}>License Keyserver</MenuItem>
            <LinkContainer to='/docs/rfp.pdf' >
              <MenuItem eventKey={3.3}>Request for Proposals</MenuItem>
            </LinkContainer>
          </NavDropdown>
          <NavItem>
            <Image className={styles['netid-avatar']} src='http://placehold.it/100x100' circle />
          </NavItem>
          <LinkContainer to='/shib/'>
            <NavItem pullRight>
                 NetID
            </NavItem>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
STFHeader.contextTypes = {
  router: React.PropTypes.object
}

export default STFHeader
