/**
 * Created by Karel on 31. 3. 2014.
 */

var winston = require('winston');
var loggingOptions = require('./logging-options');

winston.addColors(loggingOptions.loggingLevels.colors);

// exportujeme instanci, ktera se cachuje, tudiz je to "singleton"
module.exports = new winston.Logger(loggingOptions.logger);
