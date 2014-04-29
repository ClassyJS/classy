/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2011 ZippyUI.com

 All rights reserved to zippyui.com
 This software cannot be used/copied/distributed without the express permission from staff at zippyui.com

 */
describe('mixin $copyIf should work', function(){

    var root = ZippyClass

    it('should override mixin property with copyIf properly', function(){

        var warnCalls = 0,
            target = {
                warn: function(){
                    warnCalls++
                }
            }

        var logger = {
            $copyIf: {
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

        root.mixin(target, logger)

        target.warn('test')
        expect(warnCalls).toBe(1)

        target.log('xxx')
        expect(target.lastLog).toBe('xxx')
        target.warn('warning')
        expect(target.lastWarn).toBe(undefined)
        expect(warnCalls).toBe(2)
    })
})
