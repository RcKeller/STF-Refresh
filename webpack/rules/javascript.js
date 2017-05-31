const PATHS = require('../paths');

module.exports = ({ production = false, browser = false } = {}) => {
  const enableHotModuleReplacement = !production && browser;
  const createPresets = enableHotModuleReplacement => {
    const presets = ['es2015', 'react', 'stage-0'];
    return enableHotModuleReplacement ? ['react-hmre', ...presets]: presets;
  };
  const presets = createPresets(enableHotModuleReplacement);
  /*
  NEW - I'm adding decorators for @connect in redux.
  Core build only includes plugins in production.
  Instead, I'm pushing them into an array.
  */
  let plugins = ['transform-decorators-legacy']
  if (production) {
    plugins.push([
        'transform-react-remove-prop-types',
        'transform-react-constant-elements',
        'transform-react-inline-elements',
        /*
        babel-plugin-import:
        Only imports the parts of libs and antd
        that are actually used. Code splitting on imports.
        30-40% performance gain on building.
        */
        ['import', {
          libraryName: 'antd',
          style: true,
        }]
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
  };
};
