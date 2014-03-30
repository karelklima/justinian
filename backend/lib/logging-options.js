var winston = require('winston');
var expressWinston = require('express-winston');

var loggingLevels = {
	levels : { debug : 0, info : 1, warn : 2, err : 3 }, // list of logging levels ordered by their priority
	colors : { debug : 'blue', info : 'green', warn : 'yellow', err : 'red'	} // list of associated colors
}

// options for the main logger:
var logger	= {
	levels: loggingLevels.levels,			// list of all possible logging levels
	level: 'debug',							// the lowest logging level we care about
	transports: [							// where the logs should go
	    new winston.transports.Console({level : 'debug', levels: loggingLevels.levels, colorize : true}),
	    new winston.transports.File({filename : './nodejs.log', json:false, level : 'debug', levels: loggingLevels.levels})
	],

	// what to do with uncaught exceptions:
	/* exceptionHandlers: [
	    new winston.transports.File({filename : './exceptions.log', json:false})
	]
	*/
}

// options for the request logger middleware:
var requestLogger = {
	// where the logs should go:
	transports: [
      new winston.transports.Console({
        json: true,
        colorize: true
      })
    ],
    meta: false, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "{{res.statusCode}} {{req.method}} {{req.url}} {{res.responseTime}}ms" // optional: customize the default logging message. E.g. 
}

// options for the error logger middleware
var errorLogger = {
	transports: [
	  new (winston.transports.Console)({
		json: true,
	    colorize: true
	  })
	]
}

module.exports.loggingLevels = loggingLevels;
module.exports.logger = logger;
module.exports.requestLogger = requestLogger;
module.exports.errorLogger = errorLogger;

