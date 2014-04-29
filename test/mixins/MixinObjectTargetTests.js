/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2011 ZippyUI.com

 All rights reserved to zippyui.com
 This software cannot be used/copied/distributed without the express permission from staff at zippyui.com

 */
describe('simple object should be able to be used as mixin targets', function(){

    var root = ZippyClass

    it('should be possible to define a simple object and use it as mixin on a simple object', function(){

        var target = {}

        var logger = {
            $override: {
                log: function(log){
                    return this.lastLog = log
                },
                warn: function(warn){
                    return this.lastWarn = warn
                },
                debug: function(){

                }
            }
        }

        expect(target.log).toBe(undefined)

        root.mixin(target, logger, {skipProperties: { debug: 1}})
        //the mixin is already applied, so this should not change the situation
        root.mixin(target, logger)

        expect(target.log('test')).toBe('test')
        expect(target.lastLog).toBe('test')
        expect(target.debug).toBe(undefined)

        expect(target.$mixins.length).toBe(1)
    })

})
