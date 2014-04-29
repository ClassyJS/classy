/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2011 ZippyUI.com

 All rights reserved to zippyui.com
 This software cannot be used/copied/distributed without the express permission from staff at zippyui.com

 */
module.exports = function(){

    'use strict'

    var core = require('./core')

    var isSubclassOf = require('./isSubclassOf')

    function isSameOrSubclassOf(subClass, superClass){
        return isSubclassOf(subClass, superClass, { allowSame: true })
    }

    require('./Mixin')

    return {

        //primitives
        BaseClass      : core.BaseClass,
        extend         : core.extend,
        createClass    : core.createClass,
        overrideClass  : core.overrideClass,

        //enhanced
        define   : require('./define'),
        override : require('./override'),
        getClass : require('./getClass'),

        defineMixin: require('./defineMixin'),
        mixin      : require('./processors/MixinProcessor').mixin,

        create      : require('./create'),
        getInstance : require('./getInstance'),

        destroyClass   : require('./destroyClass'),
        getParentClass : require('./getParentClass'),

        isSubclassOf       : isSubclassOf,
        isSameOrSubclassOf : isSameOrSubclassOf,
        isClassLike        : isSameOrSubclassOf
    }
}()