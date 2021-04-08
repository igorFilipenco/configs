const merge = require('webpack-merge');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonWebpackConfig = require('./webpack.common.config.js');

let buildWebpackConfig;
let buildDir;

switch (process.env.MODULE) {
	case 'app2' :
		buildDir = path.resolve(__dirname, 'build/app2_build');

		buildWebpackConfig = merge(commonWebpackConfig, {
			entry: {
				hr_dash: "./js/hr_dashboard/index.jsx",
			},

			output: {
				filename: ("production" === process.env.NODE_ENV) ? 'js/[name]-[chunkhash].min.js' : 'js/[name].min.js',
				publicPath: '/build/hr_build',
				path: buildDir
			},

			plugins: [
				new CleanWebpackPlugin(
					[buildDir]
				),
				new HtmlWebpackPlugin({
					title: ' app2 | title ',
					template: './templates/app2.html',
					filename: '../../templates/app2.html',
					chunks: ['main', 'app2']
				})
			]
		});
		break;
	default:
		buildDir = path.resolve(__dirname, 'build/employee_build');

		buildWebpackConfig = merge(commonWebpackConfig, {
			entry: {
				employee_dash: "./js/index.js"
			},

			output: {
				filename: ("production" === process.env.NODE_ENV) ? 'js/[name]-[chunkhash].min.js' : 'js/[name].min.js',
				publicPath: '/build/employee_build',
				path: buildDir
			},

			plugins: [
				new CleanWebpackPlugin(
					[buildDir]
				),
				new HtmlWebpackPlugin({
					title: ' app1 | title ',
					template: './templates/app1.html',
					filename: '../../templates/app1.html',
					chunks: ['main', 'app1']
				})
			]
		});
		break;
}

// export buildWebpackConfig
module.exports = new Promise((resolve, reject) => {
	resolve(buildWebpackConfig)
});