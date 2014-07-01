/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */
describe('simple object should be able to be used as mixin targets', function(){

    var root = classy

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
