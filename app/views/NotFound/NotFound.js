import React from 'react'

import { Alert } from 'antd'

/*
404 PAGE: (Generic)
*/
import styles from './NotFound.css'
class NotFound extends React.Component {
  render () {
    return (
      <article className={styles['page']}>
        <Alert type='warning' showIcon
          message='Uh-Oh!'
          description={<div>
            <p>The requested page does not exist. If you believe this is an error, e-mail the webmaster at STFCweb@uw.edu</p>
          </div>}
        />
      </article>
    )
  }
}

export default NotFound
