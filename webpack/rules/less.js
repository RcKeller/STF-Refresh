/*
LESS is used to process ant design components and associated themes.
I would recommend against using it outside of that case (keep styles consistent!)
*/
module.exports = () => ({
    test: /\.less$/,
    loaders: [
      "style-loader",
      {loader: 'css-loader', options: {sourceMap: 1}},
      "postcss-loader",
      "less-loader"
    ]
});
