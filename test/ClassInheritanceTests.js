/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2011 ZippyUI.com

 All rights reserved to zippyui.com
 This software cannot be used/copied/distributed without the express permission from staff at zippyui.com

 */
describe('classes should be created and extended by using "alias" and "extend" ', function(){

    var root = ZippyClass

    it('should extend properly', function(){

        var Vehicle = root.define({
            alias: 'vehicle',

            speed: 10,

            getSpeed: function(){
                return this.speed
            }
        })

        var Car = root.define({
            alias: 'car',
            extend: 'vehicle',
            speed: 100
        })

        var v = new Vehicle(),
            c = new Car()

        expect(c instanceof Car).toBe(true)
        expect(c instanceof Vehicle).toBe(true)

        expect(v.getSpeed()).toBe(10)
        expect(c.getSpeed()).toBe(100)

        Vehicle.destroy()
        Car.destroy()
    })


    it('should find classes using root.getClass', function(){
        var Vehicle = root.define({
            alias: 'vehicle'
        })

        var Car = root.define({
            extend: 'vehicle',
            alias: 'car'
        })

        var c = new Car()

        expect(root.getClass(c)).toBe(Car)
        expect(root.getClass(Car)).toBe(Car)
        expect(root.getClass('car')).toBe(Car)
        expect(root.getClass('vehicle')).toBe(Vehicle)
        expect(root.getClass()).toBe(root.BaseClass)

        Vehicle.destroy()
        Car.destroy()
    })

    it('should destroy classes properly', function(){
        var VehicleDestroyed = false,
            inited = false,
            initedCount = 0

        var Vehicle = root.define({
            alias : 'vehicle',

            price: 100,

            statics: {
                init: function(){
                    inited = true
                    initedCount++
                },
                destroy: function(){
                    VehicleDestroyed = true
                }
            }
        })

        expect(inited).toBe(true)
        expect(initedCount).toBe(1)

        var Car = root.define({
            extend: 'vehicle'
        })

        expect(initedCount).toBe(2)

        expect(typeof Car.destroy).toBe('function')
        expect(typeof Vehicle.destroy).toBe('function')
        expect(root.getClass('vehicle')).toBe(Vehicle)

        Vehicle.destroy()

        expect(VehicleDestroyed).toBe(true)
        expect(root.getClass('vehicle')).toBe(undefined)
        expect(root.getClass('xxx')).toBe(undefined)
    })

    it('should extend class when root.define has 2 parameters', function(){
        var Vehicle = root.define({
            speed: 10,
            getSpeed: function(){
                return this.speed
            }
        })

        var Car = root.define(Vehicle, {
            speed: 100
        })

        var c = new Car()

        expect(c instanceof Car).toBe(true)
        expect(c instanceof Vehicle).toBe(true)
    })
})

