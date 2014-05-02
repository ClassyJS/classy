module.exports = function(){

    'use strict'

    //requirements
    var ClassFunctionBuilder    = require('./buildClassFunctions')
    var extend                  = require('./extend')

    var getInstantiatorFunction = require('../utils/getInstantiatorFunction')
    var copy                    = require('../utils/copy').copy

    //other declarations
    var hasOwnProperty = Object.prototype.hasOwnProperty

    var buildSuperFn      = ClassFunctionBuilder.buildSuperFn
    var buildOverridenFn  = ClassFunctionBuilder.buildOverridenFn

    var canDefineProperty = (function(){
            var o = {}

            try {
                Object.defineProperty(o, 'name', {
                    value: 'x'
                })

                return true
            } catch (ex) { }

            return false

        })()

    var Base = function(){}

    Base.prototype = {

        init: function(){
            return this
        },

        self: function(){
            return this
        }
    }

    function prepareSingletonStatics(statics){
        statics = statics || {}

        statics.getInstance = function(){

            if (!this.INSTANCE){
                this.INSTANCE = getInstantiatorFunction(arguments.length)(this, arguments)
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
        var statics = config.statics || {},
            $own    = statics.$own

        statics.$own   = null
        config.statics = null

        Class.$initialConfig = copyClassConfig( Class, config)

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

    var assignClassProperty = (function(){

        var callSuperRe     = /\bcallSuper|callSuperWith\b/,
            callOverridenRe = /\bcallOverriden|callOverridenWith\b/

        return function(Class, propName, propValue, config){

            var target      = config.proto?
                                Class.prototype:
                                Class
            var superClass  = Class.$superClass
            var superTarget = config.proto?
                                superClass.prototype:
                                superClass
            var own = config.own


            if (typeof propValue == 'function'){

                var hasCallSuper     = callSuperRe.test    (propValue),
                    hasCallOverriden = callOverridenRe.test(propValue)

                if ( hasCallSuper ){
                    propValue = buildSuperFn(propName, propValue, superTarget, superClass)
                }

                if ( hasCallOverriden ){
                    propValue = buildOverridenFn(propName, propValue, target)
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
                target[propName] = propValue
            }

            return propValue
        }

    })()

    function copyClassConfig(Class, config, targetConfig, resultConfig){
        targetConfig = targetConfig || { proto: true }

        var result       = resultConfig || {},

            own          = !canDefineProperty && targetConfig.own,
            configOwn    = config.$own,
            skipOwn      = !canDefineProperty && targetConfig.skipOwn && configOwn,
            skipProps    = targetConfig.skipProps,

            key, value, keyResult

        for (key in config) if (hasOwnProperty.call(config, key)) {

            if (skipOwn && configOwn[key]){
                //this property should not be copied, to skip to next property
                continue
            }

            if (skipProps && skipProps[key]){
                continue
            }

            value = config[key]

            keyResult = assignClassProperty(Class, key, value, targetConfig)

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
        canDefineProperty : canDefineProperty,
        extend          : extend,
        createClass     : createClass,
        overrideClass   : overrideClass,

        copyClassConfig : copyClassConfig,
        BaseClass       : Base
    }
}()