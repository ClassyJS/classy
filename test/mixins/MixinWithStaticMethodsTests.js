/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */

describe('mixin statics', function(){

    var root = classy

    it('should be called correctly', function(){

        var Labelable = root.defineMixin({
            alias: 'labelable',

            statics: {
                $override: {
                    initEvents: function(){

                        this.times++

                        return this.callTarget()
                    }
                }
            }
        })

        var Label = root.define({

            alias: 'label',
            mixins: ['labelable'],

            statics: {
                init: function(){
                    this.times = 0
                    this.initEvents()
                }
            }
        })

        var Button = root.define({
            alias: 'button',
            extend: Label
        })

        expect(Label.times).toBe(1)
        expect(Button.times).toBe(1)
    })
})