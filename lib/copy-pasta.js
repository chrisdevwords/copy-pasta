"use strict";

var _ = require('underscore');
var fs = require('fs');
var minify = require('minify');
var sass = require('node-sass');
var copyPaste = require("copy-paste");
var Logger = require('./Logger');
var logger;

var CopyPasta = function(srcFile, extension, outputFile, addWatch, debug) {
    
    var self = this;

    logger = new Logger(debug);

    if(!srcFile || !srcFile.length) {
        logger.border();
        logger.error('No input file specified. See copy-pasta -h for usage.');
        logger.border();
        return;
    }
    fs.exists(srcFile, function(exists) {
        if(exists) {
            self.init(srcFile, extension, outputFile, addWatch);      
        } else {
            logger.border();
            logger.error('Source File not found', srcFile);
            logger.info('current directory', process.cwd());
            logger.border();
        }
    });
}

_.extend(CopyPasta.prototype, {

    init : function (srcFile, extension, outputFile, addWatch) {
        
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
                logger.border();
                logger.error('Invalid file extension:', extension);
                logger.info('copy-pasta supports', 'js, css, scss');
                logger.border();
                return;
                break;
        }

        if (addWatch) {
            this.addWatch(srcFile, extension, outputFile);
        }
    },

    minify : function(srcFile, outputFile) {
        var self = this;
        var options = {
            returnStream : true
        };
        minify(srcFile, options, function(error, stream) {
            if (error) {
                logger.border();
                logger.error('Error minifying:', error.message);
                logger.border();
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
                logger.error('Sass Error:', error);
            }
        };
        sass.render(options)
    },

    onMinified : function(data, srcFile, outputFile) {
        copyPaste.copy(data, function() {
            logger.success('Copied to clipboard, minified file:', srcFile);
            if(!outputFile) {
                return;
            }
            fs.writeFile(outputFile, data, function(err) {
                if(err) {
                    logger.border();
                    logger.error('Error writing file:', err);
                    logger.border();
                } else {
                    logger.border();
                    logger.success('File saved to:', outputFile);
                    logger.border();
                }
            });
        });
    },

    addWatch : function(srcFile, extension, outputFile) {
        var self = this;
        fs.watch(srcFile, function (event, filename) {
            logger.debug('fs event:', logger.theme.status(event));
            if (filename) {
                logger.debug('filename provided:', filename);
                self.minify(srcFile, filename);
            } else {
                self.minify(srcFile, outputFile);
            }
        });
        this.notifyWatch(srcFile);
    },

    notifyWatch : function (srcFile) {
        logger.br();
        logger.border();
        logger.info('Watching:', srcFile);
        logger.info('copying to clipboard, minfying on change')
        logger.info('ctrl-C to quit.','...');
        logger.border();
        logger.br();
    }
    
});

module.exports = CopyPasta;