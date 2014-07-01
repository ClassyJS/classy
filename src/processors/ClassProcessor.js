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

    result.attach(require('./MixinProcessor'))

    return result
}()