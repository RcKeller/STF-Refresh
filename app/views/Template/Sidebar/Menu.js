import React from 'react'
import { Menu, Icon } from 'antd'
const SubMenu = Menu.SubMenu

class AppMenu extends React.Component {
  render () {
    const collapsedNav = false
    const menuTheme = 'dark' // light
    const mode = collapsedNav ? 'vertical' : 'inline'
    // const currentPathname = hashHistory.getCurrentLocation().pathname;
    return (
      <Menu
        theme={menuTheme}
        mode={mode}
        // defaultSelectedKeys={[currentPathname]}
      >
        <Menu.Item key='/app/dashboard'>
          <a href='#/app/dashboard'>
            <Icon type='home' />
            <span className='nav-text'>Dashboard</span>
          </a>
        </Menu.Item>
        <SubMenu
          key='/app/ui'
          title={<span><Icon type='shop' /><span className='nav-text'>UI Kit</span></span>}
        >
          <Menu.Item key='/app/ui/button'><a href='#/app/ui/button'><span>Button</span></a></Menu.Item>
          <Menu.Item key='/app/ui/card'><a href='#/app/ui/card'><span>Card</span></a></Menu.Item>
          <Menu.Item key='/app/ui/box'><a href='#/app/ui/box'><span>Box</span></a></Menu.Item>
          <Menu.Item key='/app/ui/components'><a href='#/app/ui/components'><span>UI Components</span><span className='badge badge-pill badge-primary'>8</span></a></Menu.Item>
          <Menu.Item key='/app/ui/feedback'><a href='#/app/ui/feedback'><span>Feedback</span><span className='badge badge-pill badge-info'>6</span></a></Menu.Item>
          <Menu.Item key='/app/ui/navigation'><a href='#/app/ui/navigation'><span>Navigation</span><span className='badge badge-pill badge-success'>5</span></a></Menu.Item>
          <Menu.Item key='/app/ui/icon'><a href='#/app/ui/icon'><span>Icon</span></a></Menu.Item>
          <Menu.Item key='/app/ui/icon-box'><a href='#/app/ui/icon-box'><span>Icon Box</span></a></Menu.Item>
          <Menu.Item key='/app/ui/color'><a href='#/app/ui/color'><span>Color</span></a></Menu.Item>
          <Menu.Item key='/app/ui/grid'><a href='#/app/ui/grid'><span>Grid</span></a></Menu.Item>
          <Menu.Item key='/app/ui/typography'><a href='#/app/ui/typography'><span>Typography</span></a></Menu.Item>
        </SubMenu>
        <SubMenu
          key='/app/form'
          title={<span><Icon type='edit' /><span className='nav-text'>Forms</span></span>}
        >
          <Menu.Item key='/app/form/components'><a href='#/app/form/components'><span>Components</span><span className='badge badge-pill badge-success'>16</span></a></Menu.Item>
          <Menu.Item key='/app/form/steps'><a href='#/app/form/steps'><span>Steps</span></a></Menu.Item>
          <Menu.Item key='/app/form/validation'><a href='#/app/form/validation'><span>Validation</span></a></Menu.Item>
          <Menu.Item key='/app/form/layout'><a href='#/app/form/layout'><span>Form Layout</span></a></Menu.Item>
          <Menu.Item key='/app/form/form'><a href='#/app/form/form'><span>Form Examples</span></a></Menu.Item>
        </SubMenu>
        <SubMenu
          key='/app/table'
          title={<span><Icon type='bars' /><span className='nav-text'>Tables</span></span>}
        >
          <Menu.Item key='/app/table/table'><a href='#/app/table/table'><span>Table</span></a></Menu.Item>
          <Menu.Item key='/app/table/data-table'><a href='#/app/table/data-table'><span>Data Table</span></a></Menu.Item>
        </SubMenu>
        <SubMenu
          key='/app/chart'
          title={<span><Icon type='line-chart' /><span className='nav-text'>Charts</span></span>}
        >
          <Menu.Item key='/app/chart/line'><a href='#/app/chart/line'><span>Line & Area</span></a></Menu.Item>
          <Menu.Item key='/app/chart/bar'><a href='#/app/chart/bar'><span>Bar</span></a></Menu.Item>
          <Menu.Item key='/app/chart/pie'><a href='#/app/chart/pie'><span>Pie</span></a></Menu.Item>
          <Menu.Item key='/app/chart/scatter'><a href='#/app/chart/scatter'><span>Scatter</span></a></Menu.Item>
          <Menu.Item key='/app/chart/radar'><a href='#/app/chart/radar'><span>Radar</span></a></Menu.Item>
          <Menu.Item key='/app/chart/funnel'><a href='#/app/chart/funnel'><span>Funnel</span></a></Menu.Item>
          <Menu.Item key='/app/chart/more'><a href='#/app/chart/more'><span>More</span></a></Menu.Item>
        </SubMenu>
        <SubMenu
          key='/app/page'
          title={<span><Icon type='file' /><span className='nav-text'>Pages</span></span>}
        >
          <Menu.Item key='/app/page/about'><a href='#/app/page/about'><span>About</span></a></Menu.Item>
          <Menu.Item key='/app/page/services'><a href='#/app/page/services'><span>Services</span></a></Menu.Item>
          <Menu.Item key='/app/page/careers'><a href='#/app/page/careers'><span>Careers</span></a></Menu.Item>
          <Menu.Item key='/app/page/contact'><a href='#/app/page/contact'><span>Contact</span></a></Menu.Item>
          <Menu.Item key='/app/page/faqs'><a href='#/app/page/faqs'><span>FAQs</span></a></Menu.Item>
          <Menu.Item key='/app/page/blog'><a href='#/app/page/blog'><span>Blog</span></a></Menu.Item>
          <Menu.Item key='/app/page/terms'><a href='#/app/page/terms'><span>Terms of Services</span></a></Menu.Item>
        </SubMenu>
        <SubMenu
          key='/app/ecommerce'
          title={<span><Icon type='shopping-cart' /><span className='nav-text'>eCommerce</span></span>}
        >
          <Menu.Item key='/app/ecommerce/products'><a href='#/app/ecommerce/products'><span>Products</span></a></Menu.Item>
          <Menu.Item key='app/ecommerce/horizontal-products'><a href='#/app/ecommerce/horizontal-products'><span>Products (Honrizonal)</span></a></Menu.Item>
          <Menu.Item key='/app/ecommerce/invoice'><a href='#/app/ecommerce/invoice'><span>Invoice</span></a></Menu.Item>
        </SubMenu>
        <Menu.Divider />
        <SubMenu
          key='i'
          title={<span><Icon type='ellipsis' /><span className='nav-text'>Extra Pages</span></span>}
        >
          <Menu.Item key='/login'><a href='#/login'><span>Login</span></a></Menu.Item>
          <Menu.Item key='/sign-up'><a href='#/sign-up'><span>Sign Up</span></a></Menu.Item>
          <Menu.Item key='/forgot-password'><a href='#/forgot-password'><span>Forgot Password</span></a></Menu.Item>
          <Menu.Item key='/404'><a href='#/404'><span>404 Error</span></a></Menu.Item>
          <Menu.Item key='/500'><a href='#/500'><span>500 Error</span></a></Menu.Item>
        </SubMenu>
        <SubMenu
          key='/app/pglayout'
          title={<span><Icon type='desktop' /><span className='nav-text'>Page Layouts</span></span>}
        >
          <Menu.Item key='/app/pglayout/full-width'><a href='#/app/pglayout/full-width'><span>Full Width</span></a></Menu.Item>
          <Menu.Item key='/app/pglayout/centered'><a href='#/app/pglayout/centered'><span>Centered</span></a></Menu.Item>
          <Menu.Item key='/fullscreen'><a href='#/fullscreen'><span>Fullscreen</span></a></Menu.Item>
        </SubMenu>
        <SubMenu
          key='level1'
          title={<span><Icon type='plus' /><span className='nav-text'>Menu Levels</span></span>}
        >
          <Menu.Item key='level21'><a href='javascript:;'><span>Level 2</span></a></Menu.Item>
          <SubMenu
            key='level22'
            title={<span>Level 2</span>}
          >
            <Menu.Item key='level31'><a href='javascript:;'><span>Level 3</span></a></Menu.Item>
            <SubMenu
              key='level32'
              title={<span>Level 3</span>}
            >
              <Menu.Item key='level41'><a href='javascript:;'><span>Level 4</span></a></Menu.Item>
              <Menu.Item key='level42'><a href='javascript:;'><span>Level 4</span></a></Menu.Item>
            </SubMenu>
          </SubMenu>
        </SubMenu>
        <Menu.Item key='/app/calendar'>
          <a href='#/app/calendar'>
            <Icon type='calendar' />
            <span className='nav-text'>Calendar</span>
          </a>
        </Menu.Item>
      </Menu>
    )
  }
}
export default AppMenu
