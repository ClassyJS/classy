'use strict'

var canGetOwnPropertyDescriptor = require('./canGetOwnPropertyDescriptor')

function copy(source, target){
    Object.getOwnPropertyNames(source).forEach(function(name){
        var sourceDescriptor = Object.getOwnPropertyDescriptor(source, name)

        if (!sourceDescriptor.get && !sourceDescriptor.set){
            //dont copy non getters/setters, since this is handled by prototype inheritance
            return
        }

        Object.defineProperty(target, name, sourceDescriptor)
    })
}

module.exports = canGetOwnPropertyDescriptor? copy: function(){}