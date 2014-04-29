var getClass = require('./getClass')

/**
 * @method override
 *
 * Zpy.override allows you to override a class. This can be often used to override default values
 *
 * Example:
 *      Zpy.override('z.visualcmp', {
 *          titleHeight: 40,
 *
 *          getTitle: function(){
 *              return this.callOverriden() + '!'
 *          }
 *      })
 *
 * @param  {Class/String} Class The class you want to override, or an alias of an existing class
 * @param  {Object} classConfig The object with the overrides
 * @return {Class} returns the class that has just beedn overriden
 */
module.exports = function(Class, classConfig){

    'use strict'

    var TheClass = getClass(Class)

    TheClass && TheClass.override(classConfig)

    return TheClass
}