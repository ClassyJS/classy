!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.classy=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports = function(){

    'use strict';

    var fns = {}

    return function(len){

        if ( ! fns [len ] ) {

            var args = []
            var i    = 0

            for (; i < len; i++ ) {
                args.push( 'a[' + i + ']')
            }

            fns[len] = new Function(
                            'c',
                            'a',
                            'return new c(' + args.join(',') + ')'
                        )
        }

        return fns[len]
    }

}()
},{}],2:[function(_dereq_,module,exports){
var getInstantiatorFunction = _dereq_('./getInstantiatorFunction')

module.exports = function(fn, args){
	return getInstantiatorFunction(args.length)(fn, args)
}
},{"./getInstantiatorFunction":1}],3:[function(_dereq_,module,exports){
/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */

'use strict'

var core = _dereq_('./core')
var copy = _dereq_('./utils/copy').copy
var when = [ '$before', '$after', '$override', '$copyIf' ]

module.exports = _dereq_('./define')({

    alias: 'z.mixin',

    callTarget: function(){},

    statics: {
        init: function(){
            var source = this.$initialConfig || {}

            when.forEach(function(it){
                //copy all methods from prototype[when] to prototype
                if (source[it]){
                    core.copyClassConfig(this, source[it], {proto: true })
                }

                //copy all methods from Class[when] to Class
                if (this[it]){
                    core.copyClassConfig(this, this[it], { proto: false })
                }
            }, this)

        },

        /**
         * @private
         * @static
         *
         * @param  {Object} overrideConfig The config passed to the override call.
         *
         * Example:
         *         root.override(alias, config) //this config will be passed to beforeOverride
         *
         * @return {Object} the new config to be used for overriding.
         *
         * beforeOverride should either return the same config, or a new config based on the one it was given.
         *
         * This is useful for mixins since we don't want to override the $override, $before or $after properties,
         * but rather the properties inside those objects.
         */
        beforeOverride: function(overrideConfig){
            var result = {},
                proto  = this.prototype

            when.forEach(function(it){
                var config = overrideConfig[it]

                if (config != null){
                    copy(config, result)

                    //also copy to the proto[it],
                    //so new methods are found when iterating over proto[it]
                    copy(config, proto[it])
                }
            })

            return result
        }
    }
})
},{"./core":10,"./define":13,"./utils/copy":28}],4:[function(_dereq_,module,exports){
module.exports = {}
},{}],5:[function(_dereq_,module,exports){
'use strict'

var copy = _dereq_('../utils/copy').copy
var modifyFn = _dereq_('./modifyFn')

var canDefineProperty    = _dereq_('./canDefineProperty')

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
},{"../utils/copy":28,"./canDefineProperty":7,"./modifyFn":11}],6:[function(_dereq_,module,exports){
module.exports = function(){

    'use strict'

    var emptyFn = function(){}
    var getDescriptor = Object.getOwnPropertyDescriptor

    function buildSuperFn(name, fn, superHost, superClass, getterSetterConfig){

        function execute(args){

            var accessor = getterSetterConfig.getter?
                                'get':
                                getterSetterConfig.setter?
                                    'set':
                                    null
            var descriptor = accessor?
                                getDescriptor(superHost, name):
                                null

            var fn   = accessor?
                            descriptor? descriptor[accessor]: null
                            :
                            superHost[name]


            var isFn = typeof fn == 'function'

            if (!isFn && name == 'init'){
                //if the superClass is not from the classy registry,
                //it means it is a simple function and we accept those as well
                if (!superClass.$superClass){
                    fn   = superClass
                    isFn = true
                }
            }

            if (isFn){
                return fn.apply(this, args)
            }
        }

        return function() {
            var tmpSuper     = this.callSuper
            var tmpSuperWith = this.callSuperWith
            var args         = arguments

            /*
             * Use callSuperWith method in order to pass in different parameter values from those that have been used
             * @param argumentsPassed
             * @return {Mixed} the result of the super method
             */
            this.callSuperWith = function(){
                return execute.call(this, arguments)
            }

            /*
             * Use the callSuper method to call the super method and pass the arguments array
             * Example usage:
             *      setName: function(name){
             *          this.callSuper() //you don't have to explicitly pass 'arguments', since it automagically does so :)
             *      }
             * @return {Mixed} the result of the super method
             */
            this.callSuper = function(){
                return execute.call(this, args)
            }

            var ret = fn.apply(this, args)

            this.callSuper     = tmpSuper
            this.callSuperWith = tmpSuperWith

            return ret
        }
    }

    function buildOverridenFn(name, currentFn, host, getterSetterConfig){

        var accessor = getterSetterConfig.getter?
                            'get':
                            getterSetterConfig.setter?
                                'set':
                                null

        var descriptor = accessor?
                            getDescriptor(host, name):
                            null

        var overridenFn = accessor?
                            descriptor? descriptor[accessor]: null
                            :
                            host[name]

        if (typeof overridenFn == 'undefined') {
            //this check is needed for the following scenario - if a method is overriden, and it also calls
            //to callOverriden, but has no method to override (so is the first in the override chain)

            //in this case, currentFn calls to callOverriden, and will later be also overriden.
            //so on the callStack, when currentFn is called in the context of another function,
            //callOverriden will still be bound, and currentFn will call it, while it should be a no-op

            //so in order to avoid all this scenario
            //just make sure we have one more method in the override chain (the base overriden method)
            //and that this method is the empty function
            overridenFn = emptyFn
        }

        return function() {
            var tmpOverriden     = this.callOverriden,
                tmpOverridenWith = this.callOverridenWith,
                args             = arguments

            /*
             * Use callOverridenWith method in order to pass in different parameter values from those that have been used
             * @return {Mixed} the result of the overriden method
             */
            this.callOverridenWith = function(){
                return overridenFn.apply(this, arguments)
            }

            /*
             * Use the callOverriden method to call the overriden method and pass the arguments array
             * Example usage:
             *      setName: function(name){
             *          this.callOverriden() //you don't have to explicitly pass 'arguments', since it automagically does so :)
             *      }
             * @return {Mixed} the result of the overriden method
             */
            this.callOverriden = function(){
                return overridenFn.apply(this, args)
            }

            var ret = currentFn.apply(this, args)

            this.callOverriden     = tmpOverriden
            this.callOverridenWith = tmpOverridenWith

            return ret
        }
    }

    return {
        buildSuperFn     : buildSuperFn,
        buildOverridenFn : buildOverridenFn
    }
}()
},{}],7:[function(_dereq_,module,exports){
'use strict'

module.exports = (function(){
    var o = {}

    try {
        Object.defineProperty(o, 'name', {
            value: 'x'
        })

        return true
    } catch (ex) { }

    return false

})()
},{}],8:[function(_dereq_,module,exports){
'use strict'

module.exports = (function(){
    return 'getOwnPropertyDescriptor' in Object && typeof Object.getOwnPropertyDescriptor == 'function'
})()
},{}],9:[function(_dereq_,module,exports){
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
},{}],10:[function(_dereq_,module,exports){
module.exports = function(){

    'use strict'

    var newify = _dereq_('newify')

    var extend = _dereq_('./extend')
    var copy   = _dereq_('../utils/copy').copy

    var hasOwnProperty = Object.prototype.hasOwnProperty
    var canDefineProperty = _dereq_('./canDefineProperty')
    var canGetOwnPropertyDescriptor = _dereq_('./canGetOwnPropertyDescriptor')

    var getOwnPropertyDescriptor = canGetOwnPropertyDescriptor? Object.getOwnPropertyDescriptor: null

    var Base = function(){}

    Base.prototype.init = function(){
        return this
    }

    Base.prototype.self = function(){
        return this
    }

    function prepareSingletonStatics(statics){
        statics = statics || {}

        statics.getInstance = function(){

            if (!this.INSTANCE){
                this.INSTANCE = newify(this, arguments)
            }

            return this.INSTANCE
        }

        statics.getInstanceIf = function(){
            if (this.INSTANCE){
                return this.INSTANCE
            }
        }

        return statics
    }

    function createClass(Parent, config, callback){

        if (arguments.length == 1){
            config = Parent
            Parent = Base
        } else {
            Parent = Parent || Base
        }

        function Class(){
            if (!(this instanceof Class) && Class.prototype.forceInstance){
                return newify(Class, arguments)
            }

            if (!this){
                throw 'Cannot call class constructor with undefined context.'
            }

            if (this.singleton){
                if (this.$ownClass.INSTANCE){
                    throw 'Cannot re-instantiate singleton for class ' + Class
                }

                this.$ownClass.INSTANCE = this
            }

            return this.init.apply(this, arguments)
        }

        extend(Parent, Class)

        //remove statics from config
        var statics = config.statics || {}
        var $own    = statics.$own

        statics.$own   = null
        config.statics = null

        Class.$initialConfig = copyClassConfig(Class, config)

        if (config.singleton){
            prepareSingletonStatics(statics)
        }

        copyClassConfig( Class,  Parent, {
            proto     : false,
            skipOwn   : true,
            skipProps : copy(Parent.$own, {
                $own           : 1,
                $ownClass      : 1,
                $superClass    : 1,
                $initialConfig : 1
            })
        })

        copyClassConfig( Class, statics, { proto: false })

        if ($own){
            copyClassConfig( Class, $own, { proto: false, own: true })
        }

        if (typeof callback != 'function') {
            //no callback was provided, so it's safe to call the Class.init method, if one exists
            if (Class.init){
                Class.init()
            }
        } else {
            //a callback was given, so don't call Class.init,
            //but call the callback instead, which will take care to call Class.init
            callback(Class)
        }

        return Class
    }

    var assignClassProperty = _dereq_('./assignClassProperty')

    function copyClassConfig(Class, config, targetConfig, resultConfig){
        targetConfig = targetConfig || { proto: true }

        var result       = resultConfig || {},

            own          = !canDefineProperty && targetConfig.own,
            configOwn    = config.$own,
            skipOwn      = !canDefineProperty && targetConfig.skipOwn && configOwn,
            skipProps    = targetConfig.skipProps

        var key
        var valueDescriptor
        var keyResult

        for (key in config) if (hasOwnProperty.call(config, key)) {

            if (skipOwn && configOwn[key]){
                //this property should not be copied, to skip to next property
                continue
            }

            if (skipProps && skipProps[key]){
                continue
            }

            valueDescriptor = canGetOwnPropertyDescriptor?
                                    getOwnPropertyDescriptor(config, key):
                                    config[key]

            keyResult = assignClassProperty(Class, key, valueDescriptor, targetConfig)

            if (own){
                result[key] = 1
            } else {
                result[key] = keyResult
            }

        }

        if (own){
            Class.$own = result
        }

        return result
    }

    function overrideClass(Class, config){
        if (typeof Class.beforeOverride == 'function'){
            config = Class.beforeOverride(config)
        }

        var statics = config.statics || {},
            $own    = statics.$own

        statics.$own   = null
        config.statics = null

        if (config.singleton){
            prepareSingletonStatics(statics)
        }

        copyClassConfig( Class,  config, null, Class.$initialConfig)

        copyClassConfig( Class, statics, { proto: false })

        if ($own){
            copyClassConfig( Class, $own, { proto: false, own: true })
        }

    }

    return {
        canDefineProperty: canDefineProperty,
        extend           : extend,
        createClass      : createClass,
        overrideClass    : overrideClass,

        copyClassConfig  : copyClassConfig,
        BaseClass        : Base
    }
}()
},{"../utils/copy":28,"./assignClassProperty":5,"./canDefineProperty":7,"./canGetOwnPropertyDescriptor":8,"./extend":9,"newify":2}],11:[function(_dereq_,module,exports){
var callSuperRe     = /\bcallSuper|callSuperWith\b/
var callOverridenRe = /\bcallOverriden|callOverridenWith\b/

var ClassFunctionBuilder = _dereq_('./buildClassFunctions')
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
},{"./buildClassFunctions":6}],12:[function(_dereq_,module,exports){
var SLICE = Array.prototype.slice

var getClass = _dereq_('./getClass')
var newify   = _dereq_('newify')

/**
 * @method create
 *
 * Use Zpy.create to create instances.
 * The first parameter you should pass in is an alias (or anything accepted by {@link #getClass}), and the rest
 * of the parameters are passed on to the class constructor
 * example:
 *
 *     Zpy.create('animal', 'dog', 'puffy')
 *     //will look for a class with the alias == 'animal'
 *     //and call it's constructor with the 'dog' and 'puffy' paramaters
 *
 *     //equivalent to
 *     new Animal('dog','puffy')
 *
 * @param  {Class/String/Object} alias The class alias, or anything accepted by {@link #getClass}
 * @return {Object} an instance of the specified class.
 */
module.exports = function(alias /* args... */){

    'use strict'

    var Class = getClass(alias)
    var args  = SLICE.call(arguments, 1)

    return newify(Class, args)
}
},{"./getClass":17,"newify":2}],13:[function(_dereq_,module,exports){
var getClass     = _dereq_('./getClass')
var processClass = _dereq_('./processClass')

var Registry = _dereq_('./Registry')
var core     = _dereq_('./core')

var ClassProcessor = _dereq_('./processors/ClassProcessor')

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
},{"./Registry":4,"./core":10,"./getClass":17,"./processClass":24,"./processors/ClassProcessor":25}],14:[function(_dereq_,module,exports){
var define = _dereq_('./define')
var copyIf = _dereq_('./utils/copy').copyIf

module.exports = function(members){

    'use strict'

    return define(copyIf({ extend: 'z.mixin'}, members))
}
},{"./define":13,"./utils/copy":28}],15:[function(_dereq_,module,exports){
/**
 * @method destroyClass
 *
 * Calls the static destroy method on the given class, and unregisters the class from the framework registry.
 *
 * @param  {String/Object/Class} Class a class - as expected by {@link #getClass}
 *
 */

var getClass   = _dereq_('./getClass')
var core       = _dereq_('./core')
var BaseClass  = core.BaseClass

module.exports = function(Class){

    'use strict'

    Class = getClass(Class)

    if (Class && (Class != BaseClass)){
        Class.destroy()
    }
}
},{"./core":10,"./getClass":17}],16:[function(_dereq_,module,exports){

module.exports = function(config){

    'use strict'

    var define = _dereq_('./define')

    //this refers to a Class

    config = config || {}
    config.extend = config.extend || this.prototype.alias

    return define(config)
}
},{"./define":13}],17:[function(_dereq_,module,exports){
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

var REGISTRY   = _dereq_('./Registry')
var BASE_CLASS = _dereq_('./core').BaseClass

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
},{"./Registry":4,"./core":10}],18:[function(_dereq_,module,exports){
var BaseClass = _dereq_('./core').BaseClass
var getClass  = _dereq_('./getClass')

/**
 * @method getInstance
 *
 * Use this method to create instances. If a class is given, or an alias or an object with the alias set,
 * that class is resolved, and if it found, an instance of that class is created, with the config being
 * passed to the Class constructor (the init method)
 *
 * If config is an instance, that instance is simply returned
 *
 * @param {Object} config A string (a class alias), a config object with the alias property set
 * or a class.
 *
 * @return {Zpy.BaseClass} a new instance corresponding to the class denoted by config.
 */
module.exports = function(config){

    'use strict'

    if (config instanceof BaseClass){
        return config
    }

    config = typeof config == 'string'?
                { alias: config }:
                config || {}

    var klass = getClass(config)

    //<debug>
    if (!klass){
        console.warn('Cannot find class for ', config)
    }
    //</debug>

    if (klass && klass.prototype.singleton){
        return klass.getInstance()
    }

    return new klass(config)
}
},{"./core":10,"./getClass":17}],19:[function(_dereq_,module,exports){
var BaseClass = _dereq_('./core').BaseClass
var getClass  = _dereq_('./getClass')

/**
 * @method getParentClass
 *
 * @param  {String/Object/Class} alias an argument specifying the class (as expected by {@link #getClass})
 * @return {Class} the top parent class (all the way up in the class hierarchy), if there is one.
 *
 * NOTE: All framework classes inherit from BaseClass, but is not returned from this call.
 */
module.exports = function(alias){

    'use strict'

    var Class = getClass(alias)

    if (Class && Class != BaseClass && Class.$superClass != BaseClass){
        while (Class.$superClass && Class.$superClass != BaseClass){
            Class = Class.$superClass
        }

        return Class
    }
}
},{"./core":10,"./getClass":17}],20:[function(_dereq_,module,exports){
/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */
module.exports = function(){

    'use strict'

    var core = _dereq_('./core')

    var isSubclassOf = _dereq_('./isSubclassOf')

    function isSameOrSubclassOf(subClass, superClass){
        return isSubclassOf(subClass, superClass, { allowSame: true })
    }

    _dereq_('./Mixin')

    var copyUtils = _dereq_('./utils/copy')

    return {

        _: copyUtils.copy(copyUtils),

        //primitives
        BaseClass      : core.BaseClass,
        extend         : core.extend,
        createClass    : core.createClass,
        overrideClass  : core.overrideClass,

        //enhanced
        define   : _dereq_('./define'),
        override : _dereq_('./override'),
        getClass : _dereq_('./getClass'),

        classRegistry: _dereq_('./Registry'),

        defineMixin: _dereq_('./defineMixin'),
        mixin      : _dereq_('./processors/MixinProcessor').mixin,

        create      : _dereq_('./create'),
        getInstance : _dereq_('./getInstance'),

        destroyClass   : _dereq_('./destroyClass'),
        getParentClass : _dereq_('./getParentClass'),

        isSubclassOf       : isSubclassOf,
        isSameOrSubclassOf : isSameOrSubclassOf,
        isClassLike        : isSameOrSubclassOf
    }
}()
},{"./Mixin":3,"./Registry":4,"./core":10,"./create":12,"./define":13,"./defineMixin":14,"./destroyClass":15,"./getClass":17,"./getInstance":18,"./getParentClass":19,"./isSubclassOf":21,"./override":22,"./processors/MixinProcessor":26,"./utils/copy":28}],21:[function(_dereq_,module,exports){
var getClass = _dereq_('./getClass')

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
},{"./getClass":17}],22:[function(_dereq_,module,exports){
var getClass = _dereq_('./getClass')

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
},{"./getClass":17}],23:[function(_dereq_,module,exports){
module.exports = function(config){

    'use strict'

    //this refers to a Class
    return _dereq_('./core').overrideClass(this, config)
}
},{"./core":10}],24:[function(_dereq_,module,exports){
var copyKeys = _dereq_('./utils/copy').copyKeys

function aliasMethods(config){
    //this refers to a class
    copyKeys(this.prototype, this.prototype, config)
    
    return this
}

var extendClass     = _dereq_('./extendClass')
var overrideClass   = _dereq_('./overrideClass')
var unregisterClass = _dereq_('./unregisterClass')

var ClassProcessor = _dereq_('./processors/ClassProcessor')

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
},{"./extendClass":16,"./overrideClass":23,"./processors/ClassProcessor":25,"./unregisterClass":27,"./utils/copy":28}],25:[function(_dereq_,module,exports){
/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */
module.exports = function(){

    'use strict'

    var attached = []

    var result = {

        attach: function(fn){
            attached.push(fn)
        },

        preprocess: function(classConfig, parent){
            attached.forEach(function(processor){
                processor.preprocess && processor.preprocess(classConfig, parent)
            })
        },

        process: function(Class){
            attached.forEach(function(processor){
                processor.process(Class)
            })
            return Class
        }
    }

    result.attach(_dereq_('./MixinProcessor'))

    return result
}()
},{"./MixinProcessor":26}],26:[function(_dereq_,module,exports){
/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */
module.exports = function(){

    'use strict'

    var core = _dereq_('../core')

    var FN = _dereq_('../utils/function')
    var bindArgs = FN.bindArgs
    var copyIf   = _dereq_('../utils/copy').copyIf
    var getClass = _dereq_('../getClass')

    var HAS_OWN   = Object.prototype.hasOwnProperty
    var hasOwn    = function(obj, name){ return HAS_OWN.call(obj, name) }
    var emptyFn   = function(){}
    var mixinMeta = [ '$copyIf', '$override', '$after', '$before' ]

    function processMixins(target){
        var mixins = target.mixins || []

        mixins.forEach(function(m){
            mixinFn(target, m)
        })
    }

    function prepareTarget(target){
        if (!target.addMixin){

            var fn = function(m){
                mixinFn(this, m)
            }

            if (core.canDefineProperty){
                Object.defineProperties(target, {
                    addMixin: {
                        value: fn
                    }
                })
            } else {
                target.addMixin = fn
            }
        }
    }

    function targetHasMixin(target, mixinIdentifier){
        if (target.$mixins && ~target.$mixins.indexOf(mixinIdentifier)){
            //mixin already applied
            return true
        }

        prepareTarget(target)

        target.$mixins = target.$mixins?
                            [].concat(target.$mixins):
                            []

        target.$mixins.push(mixinIdentifier)

        return false
    }

    /*
     * For each $copyIf, $override, $before, $after, as WHEN, do the following:
     *
     * Iterate over source[WHEN], and for each property KEY in source[WHEN], copy source[KEY]
     * to either target[WHEN][KEY] (if the target is given)
     * or to source[WHEN][KEY]
     *
     * This function is called during the mixin process in 2 cases:
     *
     * 1. when the source is the mixin prototype. Since all mixin methods have been copied on the prototype, where they have been
     * enhanced so that they can use callSuper and callOverriden; now we need to copy all needed methods to mixin.$override, to mixin.$copyIf, etc
     *
     * 2. when the source is the mixin class. Since all mixin methods have been copied as static methods on the class (where they have
     * been enhanced so that they can use callSuper and callOverriden) now we need to build a statics mixin target, with the keys $override, $copyIf, etc...
     * that are objects with key/value pairs, where the values are the functions copied from the Mixin Class.
     *
     */
    function copyMetaFrom(source, target){

        mixinMeta.forEach(function(when){
            var mixinWhen  = source[when],
                targetWhen = mixinWhen

            if (mixinWhen != null){

                if (target){
                    targetWhen = target[when] = target[when] || {}
                }

                for (var key in mixinWhen) if (hasOwn(mixinWhen, key)){
                    targetWhen[key] = source[key]
                }
            }
        })

        return target

    }

    /**
     * @method mixin
     *
     * A mixin should be an object with $override, $before and/or $after properties:
     *
     * Example:
     *     var logger = {
     *         $override: {
     *             log: function(message){
     *                 console.log(message)
     *             }
     *         }
     *     }
     *
     *      function Person(name){
     *          this.name = name
     *      }
     *
     *      Person.prototype.getName = function(){ return this.name }
     *
     *      var p = new Person()
     *
     *
     *
     * @param  {Object} target The mixin target
     * @param  {Object} mixin  The object to mix into target
     * @param  {Object} [config] Optional config for mixin.
     * @param  {Object} [config.skipProperties] An object with properties that are not going to be mixed in.
     * @param  {Object} [config.skipStatics] An object with properties that are not going to be mixed in.
     */
    function mixinFn(target, mixin, config){

        if (arguments.length == 1){
            mixin = target
            target = {}
        }

        if (!mixin){
            return target
        }

        config = config || {}

        var MixinClass      = getClass(mixin)
        var mixinIdentifier = config.mixinIdentifier || mixin

        if (MixinClass){

            if (typeof mixin == 'string'){
                mixin = { alias: mixin }
            }

            if (mixin == MixinClass){
                //the mixin is the Class, so take its prototype
                mixin = MixinClass.prototype
            } else {
                copyIf(MixinClass.prototype, mixin)
            }

            //go over all keys from mixin.$override, $after, ... and override them with
            //values from the mixin proto
            copyMetaFrom(mixin)

            mixinIdentifier = mixin.alias

        }

        if ( target.$ownClass && !config.skipStatics) {

            var mixinStatics = MixinClass?
                                    //go over all keys from MixinClass.$override, $after, ... and build a new object with $override, $after ...
                                    //that contain the corresponding static values copied from the MixinClass
                                    copyMetaFrom(MixinClass, {}):
                                    mixin.statics

            if ( mixinStatics && mixinMeta.some(function(when){ return !! mixinStatics[when] }) ) {
                config.skipWarning = true

                var staticsMixinIdentifier = 'statics.' + mixinIdentifier

                //The mixin class also targets the target's Class
                mixinFn(target.$ownClass, mixinStatics, { skipStatics: true, mixinIdentifier: staticsMixinIdentifier})
            }
        }

        doMixin(target, mixin, mixinIdentifier, config)

        return target
    }

    function doMixin(target, mixin, mixinIdentifier, config){
        mixinIdentifier = mixinIdentifier || mixin.alias

        if (! targetHasMixin(target, mixinIdentifier) ) {
            applyMixin(target, mixin, config)
        }
    }

    function prepareTargetFn(target, propName, newFn){

        var oldTarget = target[propName],
            targetFn  = typeof oldTarget == 'function'?
                            oldTarget:
                            emptyFn

        return function(){
            var args = arguments,
                oldCallTarget     = this.callTarget,
                oldCallTargetWith = this.callTargetWith

            this.callTarget = function(){
                return targetFn.apply(this, args)
            }
            this.callTargetWith = function(){
                return targetFn.apply(this, arguments)
            }

            var result = newFn.apply(this, args)

            this.callTarget = oldCallTarget
            this.callTargetWith = oldCallTargetWith

            return result
        }
    }

    function assignFunction(when, target, propName, newFn){

        target[propName] = when?
                                FN[when](newFn, target[propName]):
                                prepareTargetFn(target, propName, newFn)
    }

    function applyWhen(when, originalWhen, target, props, config){
        var prop,
            value,
            skipProps = config? config.skipProperties: null,
            result

        for (prop in props) if ( hasOwn(props, prop) ){

            if (prop == 'init'){
                result = {
                    when  : when,
                    props : props
                }

                continue
            }

            if (skipProps && skipProps[prop]){
                continue
            }

            value = props[prop]

            if (originalWhen == '$copyIf'){
                if (typeof target[prop] == 'undefined'){
                    target[prop] = value
                }

                continue
            }

            if (typeof value == 'function'){

                if (typeof target[prop] == 'function'){

                    assignFunction(when, target, prop, value)

                } else {
                    target[prop] = value
                }

            } else {
                if (!when || typeof target[prop] == 'undefined'){
                    target[prop] = value
                }
            }
        }

        return result
    }

    /*
     * Applies the mixin init method on target.
     * The initOn property on the mixin dictates when to init the mixin.
     *
     * Example:
     *
     *      root.defineMixin({
     *          alias: 'observable',
     *
     *          initOn: 'configure',
     *
     *          $before: {
     *              init: function(){
     *                  ...
     *              }
     *          }
     *      })
     *
     *      root.define({
     *          alias : 'computer',
     *
     *          mixins: [{ alias: 'observable', initOn: 'showDisplay' }],
     *
     *          init: function(){
     *              // init computer properties
     *
     *              //then configure computer
     *              this.configure()
     *
     *              //then show display
     *              this.showDisplay()
     *          },
     *
     *          //before this method is actually called, call the obserable.init method
     *          showDisplay: function(){
     *          }
     *      })
     * @param  {Object} target The target object
     * @param  {Object} mixin The mixin object
     * @param  {Object} [initConfig] Optional mixin application config
     */
    function applyInit(target, mixin, initConfig){
        if (initConfig){
            var init         = initConfig.props.init,
                initWhen     = initConfig.when,
                initOnMethod = mixin.initOn || 'init'

            assignFunction(initWhen, target, initOnMethod, init)
        }
    }

    var applyBefore   = bindArgs(applyWhen, 'before', '$before')
    var applyAfter    = bindArgs(applyWhen, 'after' , '$after')
    var applyCopyIf   = bindArgs(applyWhen, 'copyIf', '$copyIf')
    var applyOverride = bindArgs(applyWhen, ''      , '$override')

    function applyMixin(target, mixin, config){

        target.callTarget = target.callTarget || emptyFn

        config = config || {}

        //<debug>
        if (!config.skipWarning && !mixin.$before && !mixin.$after && !mixin.$override && !mixin.$copyIf){
            console.warn('No $before, $after or $override properties on the mixin ', mixin,'. This will result in nothing being mixed in.')
        }
        //</debug>

        var beforeWithInit = applyBefore  (target, mixin.$before  , config)
        var afterWithInit  = applyAfter   (target, mixin.$after   , config)

        applyCopyIf  (target, mixin.$copyIf  , config)

        var overrideWithInit = applyOverride(target, mixin.$override, config)

        applyInit(target, mixin, beforeWithInit || afterWithInit || overrideWithInit)

    }

    return {

        mixin : mixinFn,

        preprocess: function(classConfig, parent){
        },

        process : function(Class){
            processMixins(Class.prototype)
            processMixins(Class)
        }

    }
}()
},{"../core":10,"../getClass":17,"../utils/copy":28,"../utils/function":29}],27:[function(_dereq_,module,exports){
var REGISTRY = _dereq_('./Registry')

module.exports = function unregisterClass(){

    'use strict'

    //this refers to a Class

    var alias = this.prototype.alias
    REGISTRY[alias] = null

    delete REGISTRY[alias]
}
},{"./Registry":4}],28:[function(_dereq_,module,exports){
/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */
module.exports = function(){

    'use strict'

    var HAS_OWN       = Object.prototype.hasOwnProperty,
        STR_OBJECT    = 'object',
        STR_UNDEFINED = 'undefined'

    return {

        /**
         * @class Zpy
         */

        /**
         * Copies all properties from source to destination
         *
         *      Zpy.copy({name: 'jon',age:5}, this);
         *      // => this will have the 'name' and 'age' properties set to 'jon' and 5 respectively
         *
         * @param {Object} source
         * @param {Object} destination
         *
         * @return {Object} destination
         */
        copy: function(source, destination){

            destination = destination || {}

            if (source != null && typeof source === STR_OBJECT ){

                for (var i in source) if ( HAS_OWN.call(source, i) ) {
                    destination[i] = source[i]
                }

            }

            return destination
        },

        /**
         * Copies all properties from source to destination, if the property does not exist into the destination
         *
         *      Zpy.copyIf({name: 'jon',age:5}, {age:7})
         *      // => { name: 'jon', age: 7}
         *
         * @param {Object} source
         * @param {Object} destination
         *
         * @return {Object} destination
         */
        copyIf: function(source, destination){
            destination = destination || {}

            if (source != null && typeof source === STR_OBJECT){

                for (var i in source) if ( HAS_OWN.call(source, i) && (typeof destination[i] === STR_UNDEFINED) ) {

                    destination[i] = source[i]

                }
            }

            return destination
        },

        /**
         * Copies all properties from source to a new object, with the given value. This object is returned
         *
         *      Zpy.copyAs({name: 'jon',age:5})
         *      // => the resulting object will have the 'name' and 'age' properties set to 1
         *
         * @param {Object} source
         * @param {Object/Number/String} [value=1]
         *
         * @return {Object} destination
         */
        copyAs: function(source, value){

            var destination = {}

            value = value || 1

            if (source != null && typeof source === STR_OBJECT ){

                for (var i in source) if ( HAS_OWN.call(source, i) ) {
                    destination[i] = value
                }

            }

            return destination
        },

        /**
         * Copies all properties named in the list, from source to destination
         *
         *      Zpy.copyList({name: 'jon',age:5, year: 2006}, {}, ['name','age'])
         *      // => {name: 'jon', age: 5}
         *
         * @param {Object} source
         * @param {Object} destination
         * @param {Array} list the array with the names of the properties to copy
         *
         * @return {Object} destination
         */
        copyList: function(source, destination, list){
            if (arguments.length == 2){
                list = destination
                destination = null
            }

            destination = destination || {}
            list        = list || []

            var i   = 0,
                len = list.length,
                propName

            for( ; i < len; i++ ){
                propName = list[i]

                if ( typeof source[propName] !== STR_UNDEFINED ) {
                    destination[list[i]] = source[list[i]]
                }
            }

            return destination
        },

        /**
         * Copies all properties named in the list, from source to destination, if the property does not exist into the destination
         *
         *      Zpy.copyListIf({name: 'jon',age:5, year: 2006}, {age: 10}, ['name','age'])
         *      // => {name: 'jon', age: 10}
         *
         * @param {Object} source
         * @param {Object} destination
         * @param {Array} list the array with the names of the properties to copy
         *
         * @return {Object} destination
         */
        copyListIf: function(source, destination, list){
            if (arguments.length == 2){
                list = destination
                destination = null
            }

            destination = destination || {}
            list        = list || []

            var propName,
                i   = 0,
                len = list.length

            for(; i<len ; i++){
                propName = list[i]
                if (
                        (typeof source[propName]      !== STR_UNDEFINED) &&
                        (typeof destination[propName] === STR_UNDEFINED)
                    ){
                    destination[propName] = source[propName]
                }
            }

            return destination
        },

        /**
         * Copies all properties named in the namedKeys, from source to destination
         *
         *      Zpy.copyKeys({name: 'jon',age:5, year: 2006, date: '2010/05/12'}, {}, {name:1 ,age: true, year: 'theYear'})
         *      // => {name: 'jon', age: 5, theYear: 2006}
         *
         * @param {Object} source
         * @param {Object} destination
         * @param {Object} namedKeys an object with keys denoting the properties to be copied
         *
         * @return {Object} destination
         */
        copyKeys: function(source, destination, namedKeys){
            if (arguments.length == 2){
                namedKeys = destination
                destination = null
            }

            destination = destination || {}

            if (
                   source != null && typeof source    === STR_OBJECT &&
                namedKeys != null && typeof namedKeys === STR_OBJECT
            ) {
                var typeOfNamedProperty,
                    namedPropertyValue

                for  (var propName in namedKeys) if ( HAS_OWN.call(namedKeys, propName) ) {
                    namedPropertyValue  = namedKeys[propName]
                    typeOfNamedProperty = typeof namedPropertyValue

                    if (typeof source[propName] !== STR_UNDEFINED){
                        destination[typeOfNamedProperty == 'string'? namedPropertyValue : propName] = source[propName]
                    }
                }
            }

            return destination
        },

        /**
         * Copies all properties named in the namedKeys, from source to destination,
         * but only if the property does not already exist in the destination object
         *
         *      Zpy.copyKeysIf({name: 'jon',age:5, year: 2006}, {aname: 'test'}, {name:'aname' ,age: true})
         *      // => {aname: 'test', age: 5}
         *
         * @param {Object} source
         * @param {Object} destination
         * @param {Object} namedKeys an object with keys denoting the properties to be copied
         *
         * @return {Object} destination
         */
        copyKeysIf: function(source, destination, namedKeys){
            if (arguments.length == 2){
                namedKeys   = destination
                destination = null
            }

            destination = destination || {}

            if (
                       source != null && typeof source    === STR_OBJECT &&
                    namedKeys != null && typeof namedKeys === STR_OBJECT
                ) {

                    var typeOfNamedProperty,
                        namedPropertyValue,
                        newPropertyName

                    for (var propName in namedKeys) if ( HAS_OWN.call(namedKeys, propName) ) {

                        namedPropertyValue  = namedKeys[propName]
                        typeOfNamedProperty = typeof namedPropertyValue
                        newPropertyName     = typeOfNamedProperty == 'string'? namedPropertyValue : propName

                        if (
                                typeof      source[propName]        !== STR_UNDEFINED &&
                                typeof destination[newPropertyName] === STR_UNDEFINED
                            ) {
                            destination[newPropertyName] = source[propName]
                        }

                    }
                }

            return destination
        },

        copyExceptKeys: function(source, destination, exceptKeys){
            destination = destination || {}
            exceptKeys  = exceptKeys  || {}

            if (source != null && typeof source === STR_OBJECT ){

                for (var i in source) if ( HAS_OWN.call(source, i) && !HAS_OWN.call(exceptKeys, i) ) {

                    destination[i] = source[i]
                }

            }

            return destination
        },

        /**
         * Copies the named keys from source to destination.
         * For the keys that are functions, copies the functions bound to the source
         *
         * @param  {Object} source      The source object
         * @param  {Object} destination The target object
         * @param  {Object} namedKeys   An object with the names of the keys to copy The values from the keys in this object
         *                              need to be either numbers or booleans if you want to copy the property under the same name,
         *                              or a string if you want to copy the property under a different name
         * @return {Object}             Returns the destination object
         */
        bindCopyKeys: function(source, destination, namedKeys){
            if (arguments.length == 2){
                namedKeys = destination
                destination = null
            }

            destination = destination || {}

            if (
                       source != null && typeof source    === STR_OBJECT &&
                    namedKeys != null && typeof namedKeys === STR_OBJECT
                ) {


                var typeOfNamedProperty,
                    namedPropertyValue,

                    typeOfSourceProperty,
                    propValue


                for(var propName in namedKeys) if (HAS_OWN.call(namedKeys, propName)) {

                    namedPropertyValue = namedKeys[propName]
                    typeOfNamedProperty = typeof namedPropertyValue

                    propValue = source[propName]
                    typeOfSourceProperty = typeof propValue


                    if ( typeOfSourceProperty !== STR_UNDEFINED ) {

                        destination[
                            typeOfNamedProperty == 'string'?
                                            namedPropertyValue :
                                            propName
                            ] = typeOfSourceProperty == 'function' ?
                                            propValue.bind(source):
                                            propValue
                    }
                }
            }

            return destination
        }
    }

}()
},{}],29:[function(_dereq_,module,exports){
module.exports = function(){

    var SLICE = Array.prototype.slice

    function bindArgsArray(fn, args){
        return function(){
            var thisArgs = SLICE.call(args || [])

            if (arguments.length){
                thisArgs.push.apply(thisArgs, arguments)
            }

            return fn.apply(this, thisArgs)
        }
    }

    function bindArgs(fn){
        return bindArgsArray(fn, SLICE.call(arguments,1))
    }

    function chain(where, fn, secondFn){
        var fns = [
            where === 'before'? secondFn: fn,
            where !== 'before'? secondFn: fn
        ]

        return function(){
            if (where === 'before'){
                secondFn.apply(this, arguments)
            }

            var result = fn.apply(this, arguments)

            if (where !== 'before'){
                secondFn.apply(this, arguments)
            }

            return result
        }
    }

    function before(fn, otherFn){
        return chain('before', otherFn, fn)
    }

    function after(fn, otherFn){
        return chain('after', otherFn, fn)
    }

    return {
        before: before,
        after: after,
        bindArgs: bindArgs,
        bindArgsArray: bindArgsArray
    }
}()
},{}]},{},[20])
(20)
});