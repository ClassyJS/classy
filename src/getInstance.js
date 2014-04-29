var BaseClass = require('./core').BaseClass
var getClass  = require('./getClass')

/**
 * @method getInstance
 *
 * Use this method to create instances. If a class is given, or an alias or an object with the alias set,
 * that class is resolved, and if it found, an instance of that class is created, with the config being
 * passed to the Class constructor (the init method)
 *
 * If config is an instance, that instance is simply returned
 *
 * @param {Object} config A string (a class alias), a config object with the alias property set
 * or a class.
 *
 * @return {Zpy.BaseClass} a new instance corresponding to the class denoted by config.
 */
module.exports = function(config){

    'use strict'

    if (config instanceof BaseClass){
        return config
    }

    config = typeof config == 'string'?
                { alias: config }:
                config || {}

    var klass = getClass(config)

    //<debug>
    if (!klass){
        console.warn('Cannot find class for ', config)
    }
    //</debug>

    if (klass && klass.prototype.singleton){
        return klass.getInstance()
    }

    return new klass(config)
}