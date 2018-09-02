const path = require('path');
const webpack = require('webpack');

module.exports = {
	//target: 'electron-renderer',
	entry: './src/scripts/main.ts',
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist/scripts')
	},
	plugins: [new webpack.IgnorePlugin(/electron/)]
};
