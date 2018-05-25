import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// import { Link } from 'react-router'

import { Icon, Menu } from 'antd'
const SubMenu = Menu.SubMenu
const Item = Menu.Item
const ItemGroup = Menu.ItemGroup

@connect(state => ({
  //  Nextlocation is the route of new pages router is transitioning to.
  nextLocation: state.routing.locationBeforeTransitions
    ? state.routing.locationBeforeTransitions.pathname
    : '1',
  links: state.config.links,
  stf: (state.user && state.user.stf) || {}
}))
class UIMenu extends React.Component {
  static propTypes = {
    mobile: PropTypes.bool,
    nextLocation: PropTypes.string,
    router: PropTypes.object,
    links: PropTypes.shape({
      rfp: PropTypes.string,
      drive: PropTypes.string,
      keyserver: PropTypes.string
    })
  }
  render (
    { children, nextLocation, router, stf, links, mobile } = this.props
  ) {
    return (
      <Menu
        theme='dark'
        // mode={screen.lessThan.large ? 'inline' : 'horizontal'}
        mode={mobile ? 'inline' : 'horizontal'}
        selectedKeys={[nextLocation]}
        // onClick={this.handleNavigate}
        onClick={({ key }) => key.startsWith('/') && router.push(key)}
      >
        <Item key='/proposals'>
          <Icon type='solution' /><span className='nav-text'>Proposals</span>
        </Item>
        <Item key='/blocks'>
          <Icon type='desktop' /><span className='nav-text'>Block Funding</span>
        </Item>
        <Item key='/members'>
          <Icon type='team' /><span className='nav-text'>Members</span>
        </Item>
        <Item key='/faq'>
          <Icon type='question' /><span className='nav-text'>F.A.Q.</span>
        </Item>
        <Item key='/contact'>
          <Icon type='info' /><span className='nav-text'>Contact Us</span>
        </Item>
        <SubMenu key='sub2' title={<span><Icon type='folder-open' /><span>Documents</span></span>}>
          <Item key='rfp'>
            <a href={links.rfp} target='_blank'>Request For Proposals</a>
          </Item>
          <Item key='drive'>
            <a href={links.drive} target='_blank'>Committee Docs</a>
          </Item>
          <Item key='keyserver'>
            <a href={links.keyserver} target='_blank'>License Keyserver</a>
          </Item>
        </SubMenu>
        {Object.keys(stf).length > 0 && // if associated in any way with STF
          <SubMenu key='sub1' title={<span><Icon type='safety' /><span>Committee</span></span>}>
            <Item key='/dashboard'>
              <Icon type='area-chart' /><span className='nav-text'>Dashboard</span>
            </Item>
            <Item key='/voting'>
              <Icon type='check-circle-o' /><span className='nav-text'>Voting</span>
            </Item>
            {stf.admin &&
              <ItemGroup key='g1' title='Admin Tools'>
                <Item key='/docket'>
                  <Icon type='schedule' /><span className='nav-text'>Docket</span>
                </Item>
                <Item key='/config'>
                  <Icon type='tool' /><span className='nav-text'>Site Config</span>
                </Item>
              </ItemGroup>
            }
          </SubMenu>
        }
      </Menu>
    )
  }
}

export default UIMenu
