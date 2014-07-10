module.exports = function(){

    'use strict'

    var Class = function(){}

    return function(parent, child){

        Class.prototype = parent.prototype

        //set the prototype
        child.prototype = new Class()

        //restore the constructor
        child.prototype.constructor = child

        //set-up $ownClass and $superClass both on proto and on the returned fn
        child.prototype.$ownClass   = child
        child.prototype.$superClass = parent
        child.$ownClass   = child
        child.$superClass = parent

        return child
    }
}()