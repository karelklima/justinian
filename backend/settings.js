/**
 * Created by Karel on 11.3.14.
 */

var options = require('./options');

exports = module.exports =  {
    Options : options,
    BaseDirectory: __dirname + '/..',
    BuildDirectory: __dirname + '/build',
    CacheDirectory : __dirname + '/cache',
    FrontendDirectory : __dirname + '/../frontend',
    ModulesDirectory : __dirname + '/../modules'
}