/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */
module.exports = function(){

    'use strict'

    var core = require('./core')

    var isSubclassOf = require('./isSubclassOf')

    function isSameOrSubclassOf(subClass, superClass){
        return isSubclassOf(subClass, superClass, { allowSame: true })
    }

    require('./Mixin')

    var copyUtils = require('./utils/copy')

    return {

        _: copyUtils.copy(copyUtils),

        //primitives
        BaseClass      : core.BaseClass,
        extend         : core.extend,
        createClass    : core.createClass,
        overrideClass  : core.overrideClass,
        core: core,

        //enhanced
        define   : require('./define'),
        override : require('./override'),
        getClass : require('./getClass'),

        classRegistry: require('./Registry'),

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