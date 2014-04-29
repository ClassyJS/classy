var getClass = require('./getClass')

module.exports = function(subClass, superClass, config){

    'use strict'

    subClass   = getClass(subClass)
    superClass = getClass(superClass)

    if (!subClass || !superClass){
        return false
    }

    if (config && config.allowSame && subClass === superClass){
        return true
    }

    while (subClass && subClass.$superClass != superClass){
        subClass = subClass.$superClass
    }

    return !!subClass
}