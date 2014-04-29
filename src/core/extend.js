module.exports = function(){

    'use strict'

    var Class = function(){}

    return function(parent, child){

        Class.prototype = parent.prototype

        child.prototype = new Class()
        child.prototype.constructor = child
        child.prototype.$ownClass   = child
        child.prototype.$superClass = parent

        child.$ownClass   = child
        child.$superClass = parent

    }
}()