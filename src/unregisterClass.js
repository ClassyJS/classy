var REGISTRY = require('./Registry')

module.exports = function unregisterClass(){

    'use strict'

    //this refers to a Class

    var alias = this.prototype.alias
    REGISTRY[alias] = null

    delete REGISTRY[alias]
}