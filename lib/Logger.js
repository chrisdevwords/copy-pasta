'use strict';

var _ = require('underscore');
var chalk = require('chalk');
var beeper = require('beeper');

var Logger = function (isDebugging) {
	var self = this;
	this.isDebug = isDebugging;
	process.stdout.on('resize', function () {
  		self.updateBorder();
	});
	this.updateBorder();
};

_.extend(Logger.prototype, {

	theme : {
		bg 		: chalk.bgBlack,
		border 	: chalk.blue('---------'),
		msg   	: chalk.bold.green,
		error 	: chalk.bold.red,
		info 	: chalk.grey,
		status 	: chalk.cyan,
		debug 	: chalk.bgMagenta.black.bold,
		success : chalk.yellow.bold
	},

	updateBorder : function () {
		for (var i = 0, border = ''; i < process.stdout.columns; i++) {
  			border += '-';
  		}
  		this.theme.border = chalk.blue(border);
	},

	argsToMsg : function (argObj) {
		var msg = Array.prototype.slice.call(argObj).join(' ');
		while (msg.length < this.theme.border.length) {
			msg += ' ';
		}
		return msg;
	},

	log : function () {
		console.log(this.theme.bg(this.argsToMsg(arguments)));
	},
	error : function (msg, info) {
		msg = this.theme.error(msg);
		info = this.theme.info(info || '');
		console.error(msg, info);
		beeper();
	},
	success : function (msg, info) {
		msg = this.theme.success(msg);
		info = this.theme.info(info || '');
		this.log(msg, info);
	},
	info : function (msg, info) {
		msg = this.theme.msg(msg || '');
		info = this.theme.info(info || '');
		this.log(msg, info);
	},
	debug : function () {
		if(!this.isDebug) {
			return;
		}
		this.log(this.theme.debug(this.argsToMsg(arguments)));
	},
	br : function () {
		this.log('');
	},
	border : function (){
		this.log(this.theme.border);
	}

});

module.exports = Logger;