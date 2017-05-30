/*
LESS is used to process ant design components and associated themes.
I would recommend against using it outside of that case (keep styles consistent!)
*/
const PATHS = require('../paths');
module.exports = ({ production = false, browser = false } = {}) => ({
    test: /\.less$/,
    use: ["style-loader",
    {
      loader: 'css-loader',
      options: {sourceMap: 1}
    },
    // "postcss-loader",
    "less-loader"
  ],
    // include: [PATHS.app, PATHS.modules]
});
