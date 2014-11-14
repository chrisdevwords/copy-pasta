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
    .option('-w, --write', 'Write a minified file to the file system.')
    .option('-d, --dest <file>', 'Minified file name/location (optional: defaults to <file>.min.<extension>)')
    .parse(process.argv);

var file = program.file || process.argv[2] || '';
var doWrite = program.write;
var extension = file.split('.').slice(-1)[0].toLowerCase();
var output = program.dest || file.slice(0, -1 * extension.length) + 'min.' + extension;

switch (extension) {
    case "js":
    case "css":
        minify(file, {returnStream  : true}, function(error, stream) {
            if (doWrite) {
                fs.createWriteStream(output);
            }
            if (error) {
                console.log(error.message);
            } else {
                copyPaste.copy(stream, function() {
                    console.log('Copied minified file', file, 'to clipboard.');
                    if(doWrite){
                        console.log('Output saved to', output);
                    }
                });
            }
        });
    break;
    default:
        if(!file.length) {
            console.log('No input file specified. See', pkg.name,'-h for usage.')
        } else {
            console.log('Invalid file extension:',extension);
        }
    break;
}


