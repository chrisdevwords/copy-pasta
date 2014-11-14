#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var minify = require('minify');
var copyPaste = require("copy-paste");
var program = require('commander');
var pkg = require(path.join(__dirname, 'package.json'));

program
    .version(pkg.version)
    .option('-f, --file <file>', 'File which you want to minify and copy')
    .option('-o, --output <file>', 'Minified file name (optional: defaults to <file>.min.<extension>)')
    .parse(process.argv);

var file = program.file || '';
var extension = file.split('.').slice(-1)[0].toLowerCase();
var output = program.output || file.slice(0, -1 * extension.length) + 'min.' + extension;

switch (extension) {
    case "js":
    case "css":
        minify(file, {returnStream  : true}, function(error, stream) {
            var streamWrite = fs.createWriteStream(output);
            //console.log(stream);
            if (error) {
                console.error(error.message);
            } else {
                copyPaste.copy(stream, function() {
                    console.log('Copied minified file', file, 'with extension', extension, 'output as', output);
                });
            }
        });
    break;
}
