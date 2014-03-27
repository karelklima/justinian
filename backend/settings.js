/**
 * Created by Karel on 11.3.14.
 */

var options = require('./options');

exports = module.exports =  {
    Options : options,
    BaseDirectory: __dirname + '/..',
    BuildDirectory: __dirname + '/build',
    CacheDirectory : __dirname + '/cache',
    ModulesDirectory : __dirname + '/../modules'
}