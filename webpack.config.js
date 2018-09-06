const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: './dist/renderer/scripts/main.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist/browser/scripts')
	},
	plugins: [new webpack.IgnorePlugin(/electron/)]
};
