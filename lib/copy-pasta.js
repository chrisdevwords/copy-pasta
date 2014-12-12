"use strict";

var _ = require('underscore');
var fs = require('fs');
var minify = require('minify');
var sass = require('node-sass');
var copyPaste = require("copy-paste");

var CopyPasta = function(srcFile, extension, outputFile, addWatch) {

    switch (extension) {
        case "js":
        case "css":
            this.minify(srcFile, outputFile);
            break;
        case "scss" :
            outputFile = outputFile ? outputFile.replace('.scss','.css') : null;
            this.renderSass(srcFile, outputFile);
            break;
        default:
            if(!srcFile.length) {
                console.log('No input file specified. See', pkg.name,'-h for usage.')
            } else {
                console.log('Invalid file extension:', extension);
                console.log(pkg.name, 'supports js, css, scss');
            }
            return;
            break;
    }
    if (addWatch) {
        this.addWatch(srcFile, extension, outputFile);
    }
}

_.extend(CopyPasta.prototype, {

    minify : function(srcFile, outputFile) {
        var self = this;
        var options = {
            returnStream : true
        };
        minify(srcFile, options, function(error, stream) {
            if (error) {
                console.log(error.message);
            } else {
                self.onMinified(stream, srcFile, outputFile);
            }
        });
    },

    renderSass : function(srcFile, outputFile) {
        var self = this;
        var options = {
            file : srcFile,
            success: function (css) {
                self.onMinified(css, srcFile, outputFile);
            },
            error: function (error) {
                console.log('Error', error);
            }
        };
        sass.render(options)
    },

    onMinified : function(data, srcFile, outputFile) {
        copyPaste.copy(data, function() {
            console.log('Copied minified file', srcFile, 'to clipboard.');
            if(!outputFile) {
                return;
            }
            fs.writeFile(outputFile, data, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log('File saved to', outputFile);
                }
            });
        });
    },

    addWatch : function(srcFile, extension, outputFile) {
        var self = this;
        fs.watch(srcFile, function (event, filename) {
            console.log('event is: ' + event);
            if (filename) {
                console.log('filename provided: ' + filename);
                self.minify(srcFile, filename);
            } else {
                self.minify(srcFile, outputFile);
            }
        });
        console.log('watching:', srcFile, ' copying to clipboard on change');
        console.log('ctrl-C to quit.');
    }
});

module.exports = CopyPasta;