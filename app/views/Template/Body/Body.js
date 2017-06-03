import React from 'react'
import { Link } from 'react-router';
/*
https://ant.design/components/breadcrumb/#components-breadcrumb-demo-router
Modified so that undefined links to home (glitch?)
*/
function itemRender(route, params, routes, paths) {
  const last = routes.indexOf(route) === routes.length - 1;
  const path = paths.join('/')
  return last
    ? <span>{route.breadcrumbName}</span>
    : <Link to={path ? path : '/'}>{route.breadcrumbName}</Link>
}


import { Breadcrumb } from 'antd'

import styles from './Body.css'
const Body = ({routes, children}) => (
  <div>
    {routes[1].path && <Breadcrumb
      className={styles['breadcrumb']}
      routes={routes} itemRender={itemRender}
    />}
    {children}
  </div>
)
export default Body
