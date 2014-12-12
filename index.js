#!/usr/bin/env node
var path = require('path');
var program = require('commander');
var pkg = require(path.join(__dirname, 'package.json'));
var CopyPasta = require('./lib/copy-pasta');

program
    .version(pkg.version)
    .option('-f, --file <file>', 'File which you want to minify and copy')
    .option('-w, --write', 'Write a minified file to the file system.')
    .option('-d, --dest <file>', 'Minified file name/location (optional: defaults to <file>.min.<extension>)')
    .option('-l, --listen', 'Watch the file for updates. Minify and/or copy to clipboard on change.')
    .parse(process.argv);

var file = program.file || process.argv[2] || '';
var extension = file.split('.').slice(-1)[0].toLowerCase();
var output = program.dest || file.slice(0, -1 * extension.length) + 'min.' + extension;
module.exports = new CopyPasta(
    file,
    extension,
    (program.dest || program.write) ? output : null,
    program.listen
);



