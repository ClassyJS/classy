/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */
describe('mixin $copyIf should work', function(){

    var root = classy

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
