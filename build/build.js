require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')
var sass = require('node-sass')
var fs = require('fs')
var shell = require('shelljs')

var spinner = ora('building for production...')
spinner.start()

/* homepage as site index */
shell.rm('-rf', 'dist')
shell.mkdir('-p', 'dist')

shell.cp('homepage/index.html', 'dist/index.html')

var scssFile = './homepage/index.scss'
var cssFile = './dist/index.css'
var mapFile = './dist/index.css.map'

var result = sass.renderSync({
  file: scssFile,
  outputStyle: 'compressed',
  outFile: cssFile,
  sourceMap: true
})

fs.writeFileSync(cssFile, result.css)
fs.writeFileSync(mapFile, result.map)
/* homepage - END */

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
