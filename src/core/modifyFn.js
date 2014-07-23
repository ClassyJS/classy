var callSuperRe     = /\bcallSuper|callSuperWith\b/
var callOverridenRe = /\bcallOverriden|callOverridenWith\b/

var ClassFunctionBuilder = require('./buildClassFunctions')
var buildSuperFn         = ClassFunctionBuilder.buildSuperFn
var buildOverridenFn     = ClassFunctionBuilder.buildOverridenFn

var emptyObject = {}

function modify(name, fn, superTarget, superClass, target, getterSetterConfig){
    var hasCallSuper     = callSuperRe.test    (fn)
    var hasCallOverriden = callOverridenRe.test(fn)

    getterSetterConfig = getterSetterConfig || {}

    if ( hasCallSuper ){
        fn = buildSuperFn(name, fn, superTarget, superClass, getterSetterConfig)
    }

    if ( hasCallOverriden ){
        fn = buildOverridenFn(name, fn, target, getterSetterConfig)
    }

    return fn
}

module.exports = modify