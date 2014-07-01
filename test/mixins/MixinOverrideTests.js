/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */

describe('mixins methods should be easily overriden', function(){

    var root = classy

    it('should override mixin method properly', function(){

        root.defineMixin({
            alias: 'logger',
            $override: {
                log: function(msg){
                    return this.msg = msg + '!'
                }
            }
        })

        root.override('logger', {
            $override: {
                log: function(msg){
                    return this.msgg = this.callOverriden() + ' overriden'
                }
            }
        })

        var l = {}

        root.mixin(l, 'logger')

        expect(l.log('test')).toBe('test! overriden')

        root.destroyClass('logger')
    })

    it('should override well by adding non existing methods', function(){

        var M = root.defineMixin({
            $copyIf: {
                clone: function(){
                    this.firstClone = true
                }
            }
        })

        root.override(
            M,
            {
                $copyIf: {
                    clone: function(){
                        this.callOverriden()
                        this.cloned = true
                    },

                    copy: function(){
                        this.copied = true
                    }
                }
            }
        )

        var obj = {}

        root.mixin(obj, M)

        obj.clone()

        expect(obj.firstClone).toBe(true)
        expect(obj.cloned).toBe(true)

        obj.copy()

        expect(obj.copied).toBe(true)
    })
})
