/**
 * @method destroyClass
 *
 * Calls the static destroy method on the given class, and unregisters the class from the framework registry.
 *
 * @param  {String/Object/Class} Class a class - as expected by {@link #getClass}
 *
 */

var getClass   = require('./getClass')
var core       = require('./core')
var BaseClass  = core.BaseClass

module.exports = function(Class){

    'use strict'

    Class = getClass(Class)

    if (Class && (Class != BaseClass)){
        Class.destroy()
    }
}