/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */

describe('Zpy.create should create instances correctly', function(){

    var root = classy

    it('should return a class instance', function(){

        var Car = root.define({
            alias: 'car',
            init: function(name, maxSpeed){
                this.name = name
                this.maxSpeed = maxSpeed || 100
            }
        })

        var c = root.create('car', 'mercedes', 150)

        expect(c.name).toBe('mercedes')
        expect(c.maxSpeed).toBe(150)

        Car.destroy()
    })
})
