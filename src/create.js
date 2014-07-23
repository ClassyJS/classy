var SLICE = Array.prototype.slice

var getClass = require('./getClass')
var newify   = require('newify')

/**
 * @method create
 *
 * Use Zpy.create to create instances.
 * The first parameter you should pass in is an alias (or anything accepted by {@link #getClass}), and the rest
 * of the parameters are passed on to the class constructor
 * example:
 *
 *     Zpy.create('animal', 'dog', 'puffy')
 *     //will look for a class with the alias == 'animal'
 *     //and call it's constructor with the 'dog' and 'puffy' paramaters
 *
 *     //equivalent to
 *     new Animal('dog','puffy')
 *
 * @param  {Class/String/Object} alias The class alias, or anything accepted by {@link #getClass}
 * @return {Object} an instance of the specified class.
 */
module.exports = function(alias /* args... */){

    'use strict'

    var Class = getClass(alias)
    var args  = SLICE.call(arguments, 1)

    return newify(Class, args)
}