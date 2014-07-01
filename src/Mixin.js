/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */

'use strict'

var core = require('./core')
var copy = require('./utils/copy').copy
var when = [ '$before', '$after', '$override', '$copyIf' ]

module.exports = require('./define')({

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