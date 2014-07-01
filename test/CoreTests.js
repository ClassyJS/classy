/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */

describe('zippy.createClass', function(){

    var root = classy

    it('should exist and create class', function(){

        var Vehicle = root.createClass({
            init: function(){

            },

            start: function(){

            }
        })

        var v = new Vehicle()

        expect(v instanceof Vehicle).toBe(true)
        expect(typeof v.start).toBe('function')
    })

    it('should allow $own properties which should not be copied onto subclasses', function(){
        var Vehicle = root.createClass({

            statics: {

                count: 10,

                getCount: function(){
                    return this.count
                },

                $own: {
                    transportCapacity: 2,

                    isLarge: function(){
                        return this.transportCapacity >= 8
                    }
                }
            }
        })

        expect(Vehicle.count).toBe(10)
        expect(Vehicle.transportCapacity).toBe(2)
        expect(Vehicle.isLarge()).toBe(false)

        var Car = root.createClass(Vehicle, {
            statics: {
                count: 10000
            }
        })

        expect(Vehicle.count).toBe(10)
        expect(Car.count).toBe(10000)
        expect(Car.getCount()).toBe(10000)
        expect(Car.transportCapacity).toBe(undefined)
        expect(Car.isLarge).toBe(undefined)

        root.overrideClass(Car, {
            statics: {
                $own: {
                    maxSpeed: 100,
                    isFast: function(){
                        return this.maxSpeed > 110
                    },

                    turboSpeed: 110,

                    getMaxSpeed: function(){
                        return this.maxSpeed
                    },

                    getTurboSpeed: function(){
                        return this.turboSpeed
                    },

                    isSuperFast: function(){
                        return false
                    }
                }
            }
        })

        expect(Car.isFast()).toBe(false)

        var Renault = root.createClass(Car)
        var Ferrari = root.createClass(Car, {
                statics: {
                    maxSpeed: 200,

                    $own: {
                        turboSpeed: 120,
                        getTurboSpeed: function(){
                            return 100 + this.callSuper()
                        }
                    }
                }
            })

        expect(Renault.maxSpeed).toBe(undefined)
        expect(Ferrari.maxSpeed).toBe(200)
        expect(Ferrari.maxSpeed).toBe(200)
        expect(Ferrari.getTurboSpeed()).toBe(220)
    })

    it('should work for extending an existing function', function(){

        function Vehicle(name){
            this.name = name
        }

        Vehicle.prototype = {
            getName: function(){
                return this.name
            }
        }

        var v = new Vehicle('car')

        expect(v.name).toBe('car')
        expect(v.getName()).toBe('car')

        var Car = root.createClass(Vehicle, {

            init: function(name, age){
                this.callSuper()
                this.age = age
            }
        })

        var renault = new Car('renault', 1980)

        expect(renault.getName()).toEqual('renault')
    })
})