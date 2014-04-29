/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2011 ZippyUI.com

 All rights reserved to zippyui.com
 This software cannot be used/copied/distributed without the express permission from staff at zippyui.com

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