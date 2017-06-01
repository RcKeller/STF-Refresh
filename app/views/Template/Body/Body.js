import React from 'react'

import { Breadcrumb } from 'antd'

const Body = ({routes, children}) => (
    <div>
      <Breadcrumb routes={routes} />
      {children}
    </div>
)
export default Body
