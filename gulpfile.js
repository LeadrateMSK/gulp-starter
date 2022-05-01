let preprocessor = 'sass',
	fileswatch   = 'html,htm,txt,json,md,woff2' // List of files extensions for watching & hard reload

import pkg from 'gulp'
const { gulp, src, dest, parallel, series, watch } = pkg

import browserSync   from 'browser-sync'
import bssi          from 'browsersync-ssi'
import ssi           from 'ssi'
import webpackStream from 'webpack-stream'
import webpack       from 'webpack'
import TerserPlugin  from 'terser-webpack-plugin'
import gulpSass      from 'gulp-sass'
import dartSass      from 'sass'
import sassglob      from 'gulp-sass-glob'
const  sass          = gulpSass(dartSass)
import postCss       from 'gulp-postcss'
import cssnano       from 'cssnano'
import autoprefixer  from 'autoprefixer'
import concat        from 'gulp-concat'
import del           from 'del'
import sourcemaps    from 'gulp-sourcemaps'
import ftp           from 'vinyl-ftp'
import gutil         from 'gulp-util'

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'app/',
			middleware: bssi({ baseDir: 'app/', ext: '.html' })
		},
		ghostMode: { clicks: false },
		notify: false,
		online: true,
	})
}

function scripts() {
	return src(['app/js/*.js', '!app/js/*.min.js'])
		.pipe(webpackStream({
			mode: 'production',
			performance: { hints: false },
			devtool: 'eval-cheap-source-map',
			plugins: [
				// new webpack.ProvidePlugin({ ... }),
			],
			module: {
				rules: [
					{
						test: /\.js$/,
						exclude: /node_modules/,
						type: 'javascript/auto',
						use: {
							loader: 'babel-loader',
							options: {
								presets: [
									[
										'@babel/preset-env',
										{
											"useBuiltIns": "usage",
											"corejs": "3.0.0"
										}
									]
								],
								plugins: [
									'@babel/plugin-syntax-dynamic-import',
									'@babel/plugin-proposal-class-properties'
								],
								sourceMap: true,
							}
						}
					}
				]
			},
			optimization: {
				minimize: true,
				minimizer: [
					new TerserPlugin({
						terserOptions: { format: { comments: false } },
						extractComments: false
					})
				]
			},
		}, webpack)).on('error', function handleError() {
			this.emit('end')
		})
		.pipe(concat('app.min.js'))
		.pipe(dest('app/js'))
		.pipe(browserSync.stream())
}

function styles() {
	return src([`app/styles/*.*`, `!app/styles/_*.*`, `!app/styles/components/_*.*`])
		.pipe(sourcemaps.init())
		.pipe(eval(`${preprocessor}glob`)())
		.pipe(eval(preprocessor)({ 'include css': true }))
		.pipe(postCss([
			autoprefixer({ grid: true }),
			cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
		]))
		.pipe(concat('app.min.css'))
		.pipe(sourcemaps.write())
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}

function buildcopy() {
	return src([
		'{app/js,app/css}/*.min.*',
		'app/img/**/*.*',
		'app/fonts/**/*'
	], { base: 'app/' })
		.pipe(dest('public'))
}

async function buildhtml() {
	let includes = new ssi('app/', 'public/', '/**/*.html')
	includes.compile()
	del('public/parts', { force: true })
}

async function cleanpublic() {
	del('public/**/*', { force: true })
}

function startwatch() {
	watch(`app/styles/**/*`, { usePolling: true }, styles)
	watch(['app/js/**/*.js', '!app/js/**/*.min.js'], { usePolling: true }, scripts)
	watch('app/img/src/**/*', { usePolling: true })
	watch(`app/**/*.{${fileswatch}}`, { usePolling: true }).on('change', browserSync.reload)
}

/**
 * Деплой использовать с осторожностью!
 * Может разорваться соединение, так как
 * слишком частые передачи могут временно
 * заблокировать свой IP на хостинге
 */
/*export function deploy() {

	let conn = ftp.create( {
		host: '255.255.255.255',
		user: 'login',
		password: 'password',
		parallel: 10,
		log: gutil.log
	} );

	let globs = [
		'public/!**',
	];

	return src(globs, { base: '.', buffer: false })
		.pipe( conn.newer( '/public' ) )
		.pipe( conn.dest( '/www/test.ru' ) );
}*/

export { scripts, styles }
export let assets = series(scripts, styles)
export let build = series(cleanpublic, scripts, styles, buildcopy, buildhtml)
export default series(scripts, styles, parallel(browsersync, startwatch))
