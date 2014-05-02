var getClass     = require('./getClass')
var processClass = require('./processClass')

var Registry = require('./Registry')
var core     = require('./core')

var ClassProcessor = require('./processors/ClassProcessor')

function preprocessClass(classConfig, parent){
    ClassProcessor.preprocess(classConfig)
}

var IDS    = 0
var PREFIX = 'ZClass-'

function generateAlias(){
    return PREFIX + (IDS++)
}


module.exports = function(parentClass, classConfig){

    'use strict'

    if (arguments.length == 1){
        classConfig = parentClass
        parentClass = null
    }

    var parent = parentClass || classConfig.extend
    var alias  = classConfig.alias    || (classConfig.alias = generateAlias())

    parent = getClass(parent) || parent

    //<debug>
    if (!parent){
        console.warn('Could not find class to extend (' + classConfig.extend + '). Extending base class.')
    }
    //</debug>

    preprocessClass(classConfig, parent)

    return core.createClass(parent, classConfig, function(Class){

        //<debug>
        if (Registry[alias]){
            console.warn('A class with alias ' + alias + ' is already registered. It will be overwritten!')
        }
        //</debug>

        Registry[alias] = Class

        processClass(Class)
    })
}