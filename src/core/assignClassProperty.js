'use strict'

var copy = require('../utils/copy').copy
var modifyFn = require('./modifyFn')

var canDefineProperty    = require('./canDefineProperty')

var assignClassProperty = function(Class, propName, propDescriptor, config){

    var target      = config.proto?
                        Class.prototype:
                        Class

    var superClass  = Class.$superClass
    var superTarget = config.proto?
                        superClass.prototype:
                        superClass
    var own = config.own

    var getterOrSetter = propDescriptor.get || propDescriptor.set
    var newPropDescriptor
    var propValue

    if (getterOrSetter){
        newPropDescriptor = copy(propDescriptor)

        if (propDescriptor.get !== undefined){
            newPropDescriptor.get = modifyFn(propName, propDescriptor.get, superTarget, superClass, target, { getter: true })
        }
        if (propDescriptor.set !== undefined){
            newPropDescriptor.set = modifyFn(propName, propDescriptor.get, superTarget, superClass, target, { setter: true })
        }
        propDescriptor = newPropDescriptor
    } else {
        propValue = propDescriptor.value

        if (typeof propValue == 'function'){

            propValue = modifyFn(propName, propValue, superTarget, superClass, target)
        }
    }

    if (own){
        if (canDefineProperty){
            Object.defineProperty(target, propName, {
                value      : propValue,
                enumerable : false
            })
        } else {
            target[propName] = propValue
        }
    } else {

        if (getterOrSetter){
            Object.defineProperty(target, propName, propDescriptor)
        } else {
            target[propName] = propValue
        }
    }

    return propValue
}

module.exports = assignClassProperty