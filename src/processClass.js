var copyKeys = require('./utils/copy').copyKeys

function aliasMethods(config){
    //this refers to a class
    copyKeys(this.prototype, this.prototype, config)
    
    return this
}

var extendClass     = require('./extendClass')
var overrideClass   = require('./overrideClass')
var unregisterClass = require('./unregisterClass')

var ClassProcessor = require('./processors/ClassProcessor')

module.exports = function(Class){

    'use strict'

    Class.extend       = extendClass
    Class.override     = overrideClass
    Class.aliasMethods = aliasMethods

    if (typeof Class.destroy == 'function'){
        var classDestroy = Class.destroy

        Class.destroy = function(){
            classDestroy.call(this)
            unregisterClass.call(this)
        }
    } else {
        Class.destroy = unregisterClass
    }

    ClassProcessor.process(Class)

    if (Class.init){
        Class.init()
    }
}