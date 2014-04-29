/**
 * @method getClass
 *
 * This method can be used to get a reference to an existing class. Pass in either a class alias (a string),
 * an instance of a class, or the class itself. It will return the class.
 *
 * @param  {String/Object/Class} alias The alias for the class you are looking for, an instance of a class or the class itself
 *
 * @return {Class}       The class or undefined if no class is found
 */

var REGISTRY   = require('./Registry')
var BASE_CLASS = require('./core').BaseClass

module.exports = function getClass(alias){
    if (!alias){
        return BASE_CLASS
    }

    if (typeof alias != 'string'){
        //alias is probably an instance or a Class
        alias = alias.alias || (alias.prototype? alias.prototype.alias: alias)
    }

    return REGISTRY[alias]

}