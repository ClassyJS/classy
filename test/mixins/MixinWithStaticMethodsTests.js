/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2011 ZippyUI.com

 All rights reserved to zippyui.com
 This software cannot be used/copied/distributed without the express permission from staff at zippyui.com

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