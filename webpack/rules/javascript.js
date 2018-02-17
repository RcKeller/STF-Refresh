const PATHS = require('../paths')

module.exports = ({ production = false, browser = false } = {}) => {
  const enableHotModuleReplacement = !production && browser
  const createPresets = enableHotModuleReplacement => {
    const presets = ['latest', 'react', 'stage-0']
    return enableHotModuleReplacement ? ['react-hmre', ...presets] : presets
  }
  const presets = createPresets(enableHotModuleReplacement)
  /*
  NEW - I'm adding decorators for @connect in redux.
  Core build only includes plugins in production.
  Instead, I'm pushing them into an array.
  */
  let plugins = [
    'transform-runtime',
    'transform-decorators-legacy',
    /*
    babel-plugin-import:
    Only imports the parts of libs and antd
    that are actually used. Code splitting on imports.
    30-40% performance gain on building.

    NOTE: DO NOT SPECIFY A STYLE OPTION.
    Doing so will load styles modularly, and due to
    the isomorphic app structure, the window object
    will not exist and thus the build will break.
    https://github.com/ant-design/ant-design/issues/3146
    https://github.com/ant-design/babel-plugin-import/issues/58
    https://github.com/ant-design/babel-plugin-import#style
    */
    ['import', { libraryName: 'antd' }]
  ]
  if (production) {
    plugins.push([
      'transform-react-remove-prop-types',
      'transform-react-constant-elements',
      'transform-react-inline-elements'
    ])
  }

  return {
    test: /\.js$|\.jsx$/,
    loader: 'babel-loader',
    options: {
      presets,
      plugins
    },
    exclude: PATHS.modules
  }
}
