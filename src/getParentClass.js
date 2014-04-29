var BaseClass = require('./core').BaseClass
var getClass  = require('./getClass')

/**
 * @method getParentClass
 *
 * @param  {String/Object/Class} alias an argument specifying the class (as expected by {@link #getClass})
 * @return {Class} the top parent class (all the way up in the class hierarchy), if there is one.
 *
 * NOTE: All framework classes inherit from BaseClass, but is not returned from this call.
 */
module.exports = function(alias){

    'use strict'

    var Class = getClass(alias)

    if (Class && Class != BaseClass && Class.$superClass != BaseClass){
        while (Class.$superClass && Class.$superClass != BaseClass){
            Class = Class.$superClass
        }

        return Class
    }
}