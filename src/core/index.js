module.exports = function(){

    'use strict'

    var newify = require('newify')

    var extend = require('./extend')
    var copy   = require('../utils/copy').copy

    var hasOwnProperty = Object.prototype.hasOwnProperty
    var canDefineProperty = require('./canDefineProperty')
    var canGetOwnPropertyDescriptor = require('./canGetOwnPropertyDescriptor')

    var getOwnPropertyDescriptor = canGetOwnPropertyDescriptor? Object.getOwnPropertyDescriptor: null

    var copyDescriptors = require('./copyDescriptors')

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

        copyDescriptors(Parent.prototype, Class.prototype)
        copyDescriptors(Parent, Class)

        //remove statics from config
        var statics = config.statics || {}
        var $own    = statics.$own

        statics.$own   = null
        config.statics = null

        Class.$initialConfig = copyClassConfig(Class, config)

        if (config.singleton){
            prepareSingletonStatics(statics)
        }

        //copy static properties from Parent to Class
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

        //copy static properties from config statics to class
        copyClassConfig( Class, statics, { proto: false })

        //copy static own properties
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

    var assignClassProperty = require('./assignClassProperty')

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
                //this property should not be copied -> skip to next property
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
                if (canGetOwnPropertyDescriptor){
                    Object.defineProperty(result, key, valueDescriptor)
                } else {
                    result[key] = keyResult
                }
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

        var statics = config.statics || {}
        var $own    = statics.$own

        statics.$own   = null
        config.statics = null

        if (config.singleton){
            prepareSingletonStatics(statics)
        }

        copyClassConfig( Class, config, null, Class.$initialConfig)

        copyClassConfig( Class, statics, { proto: false })

        if ($own){
            copyClassConfig( Class, $own, { proto: false, own: true })
        }
    }

    function overrideObject(targetObject, config){
        copyClassConfig( targetObject, config, { proto: false })
    }

    return {
        canDefineProperty: canDefineProperty,
        extend           : extend,
        createClass      : createClass,
        overrideClass    : overrideClass,
        overrideObject   : overrideObject,

        copyClassConfig  : copyClassConfig,
        BaseClass        : Base
    }
}()