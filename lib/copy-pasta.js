"use strict";

var _ = require('underscore');
var fs = require('fs');
var minify = require('minify');
var sass = require('node-sass');
var copyPaste = require("copy-paste");

var CopyPasta = function(srcFile, extension, outputFile) {

    var self = this;
    switch (extension) {
        case "js":
        case "css":
            self.minify(srcFile, outputFile);
            break;
        case "scss" :
            outputFile = outputFile ? outputFile.replace('.scss','.css') : null;
            self.renderSass(srcFile, outputFile);
            break;
        default:
            if(!srcFile.length) {
                console.log('No input file specified. See', pkg.name,'-h for usage.')
            } else {
                console.log('Invalid file extension:', extension);
                console.log(pkg.name, 'supports js, css, scss');
            }
            break;
    }
};

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
    }
});

module.exports = CopyPasta;