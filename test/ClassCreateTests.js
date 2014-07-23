/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */

describe('Zpy.create should create instances correctly', function(){

    console.dir()
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

    it('should destroy a class', function(){
        var Car = root.define({
            alias: 'car'
        })

        expect(root.getClass('car')).toBe(Car)

        Car.destroy()

        expect(root.getClass('car')).toBe(undefined)
    })

    it('should not instantiate by default', function(){

        var Vehicle = root.define({
        })

        var Car = root.define({
            extend: Vehicle,
            alias: 'car',

            init: function(name, year){
                this.name = name
                this.year = year || 2000
            }
        })

        var errored = false
        try {
            var c = Car('bmw')
        } catch (e){
            errored = true
        }

        expect(errored).toBe(true)

        Car.destroy()
        Vehicle.destroy()
    })

    it('should instantiate with forceInstance: true', function(){

        var Vehicle = root.define({
        })

        var Car = root.define({
            extend: Vehicle,
            alias: 'car',
            forceInstance: true,

            init: function(name, year){
                this.name = name
                this.year = year || 2000
            }
        })

        var c = Car('bmw', 1999)
        expect(c instanceof Car).toBe(true)
        expect(c.name).toBe('bmw')
        expect(c.year).toBe(1999)

        Car.destroy()
        Vehicle.destroy()
    })
})
