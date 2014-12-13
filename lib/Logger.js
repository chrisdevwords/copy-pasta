'use strict';

var _ = require('underscore');
var chalk = require('chalk');

var Logger = function (isDebugging) {
	this.isDebug = isDebugging;
};

_.extend(Logger.prototype, {

	theme : {
		bg : chalk.bgBlack,
		border: chalk.blue('--------------------------------------------'),
		msg   : chalk.bold.green,
		error : chalk.bold.red,
		info : chalk.grey,
		status : chalk.cyan,
		debug : chalk.bgMagenta.black.bold,
		success : chalk.yellow.bold
	},

	argsToMsg : function(argObj) {
		var msg = Array.prototype.slice.call(argObj).join(' ');
		while(msg.length < this.theme.border.length) {
			msg += ' ';
		}
		return msg;
	},

	log : function() {
		console.log(this.theme.bg(this.argsToMsg(arguments)));
	},
	error : function(msg, info) {
		msg = this.theme.error(msg);
		info = this.theme.info(info || '');
		this.log(msg, info);
	},
	success : function (msg, info) {
		msg = this.theme.success(msg);
		info = this.theme.info(info || '');
		this.log(msg, info);
	},
	info : function(msg, info) {
		msg = this.theme.msg(msg || '');
		info = this.theme.info(info || '');
		this.log(msg, info);
	},
	debug : function() {
		if(!this.isDebug) {
			return;
		}
		this.log(this.theme.debug(this.argsToMsg(arguments)));
	},
	br : function() {
		this.log('');
	},
	border : function(){
		this.log(this.theme.border);
	}

});


module.exports = Logger;