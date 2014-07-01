/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */
module.exports = function(){

    'use strict'

    var core = require('../core')

    var FN = require('../utils/function')
    var bindArgs = FN.bindArgs
    var copyIf   = require('../utils/copy').copyIf
    var getClass = require('../getClass')

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