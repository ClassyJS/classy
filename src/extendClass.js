var define = require('./define')

module.exports = function(config){

    'use strict'

    //this refers to a Class

    config = config || {}
    config.extend = config.extend || this.alias

    return define(config)
}