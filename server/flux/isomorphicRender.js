import React from 'react'
import Helmet from 'react-helmet'

import serverConfig from '../config'

//Bundles to include in page rendering.

// Render Initial HTML
export const renderPage = (html, initialState) => {
  const head = Helmet.rewind()
  // Import Manifests
  const assetsManifest = process.env.webpackAssets && JSON.parse(process.env.webpackAssets)
  const chunkManifest = process.env.webpackChunkAssets && JSON.parse(process.env.webpackChunkAssets)
  return `
    <!doctype html>
    <html>
      <head>
        ${head.base.toString()}
        ${head.title.toString()}
        ${head.meta.toString()}
        ${head.link.toString()}
        ${head.script.toString()}
        ${serverConfig.env === 'production' ? `<link rel='stylesheet' href='${assetsManifest['/app.css']}' />` : ''}
        ${serverConfig.env === 'production' ? `<link rel='shortcut icon' href='${assetsManifest['/favicon.ico']}' type="image/png" />` : '<link rel="shortcut icon" href="http://res.cloudinary.com/hashnode/image/upload/v1455629445/static_imgs/mern/mern-favicon-circle-fill.png" type="image/png" />'}
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
          ${serverConfig.env === 'production'
          ? `//<![CDATA[
          window.webpackManifest = ${JSON.stringify(chunkManifest)};
          //]]>` : ''}
        </script>
        <script src='${serverConfig.env === 'production' ? assetsManifest['/vendor.js'] : '/vendor.js'}'></script>
        <script src='${serverConfig.env === 'production' ? assetsManifest['/app.js'] : '/app.js'}'></script>
      </body>
    </html>
  `
}

export const renderError = err => {
  const softTab = '&#32;&#32;&#32;&#32;'
  const errTrace = serverConfig.env !== 'production'
  ? `<pre style="color:red">${softTab}${err.stack.replace(/\n/g, `<br>${softTab}`)}</pre>`
  : ''
  return renderPage(`Server Error : ${errTrace}`, {})
}
