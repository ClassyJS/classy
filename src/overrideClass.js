module.exports = function(config){

    'use strict'

    //this refers to a Class
    return require('./core').overrideClass(this, config)
}