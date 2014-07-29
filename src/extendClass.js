
module.exports = function(config){

    'use strict'

    var define = require('./define')

    //this refers to a Class

    config = config || {}
    config.extend = config.extend || this.prototype.alias

    return define(config)
}