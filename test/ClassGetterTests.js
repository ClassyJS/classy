/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */
describe('classes should allow property getters/setters ', function(){

    var root = classy

    it('should use getter with callSuper on subclass', function(){

        var Vehicle = root.define({

            _speed: 10,

            get speed(){
                return this._speed
            }
        })

        var Car = root.define({
            extend: Vehicle,
            _speed: 100,

            get speed(){
                return this.callSuper() * 2
            }
        })

        var v = new Vehicle()
        var c = new Car()

        expect(c instanceof Car).toBe(true)
        expect(c instanceof Vehicle).toBe(true)

        v._speed = 99
        expect(v.speed).toBe(99)
        expect(c.speed).toBe(200)

        c._speed = 11
        expect(c.speed).toBe(22)
    })

    it('should work properly for setter', function(){

        var Vehicle = root.define({

            _speed: 10,

            get speed(){
                return this._speed
            },

            set speed(s){
                this._speed = s
            }
        })

        var v = new Vehicle()
        expect(v.speed).toBe(10)
        expect(v._speed).toBe(10)
        v.speed = 1
        expect(v._speed).toBe(1)

        var Car = root.define({
            extend: Vehicle,
            _speed: 100,

            get speed(){
                return this.callSuper() * 2
            }
        })

        var c = new Car()
        c.speed = 2

        expect(c._speed).toBe(2)
        expect(c.speed).toBe(4)
    })

    it('should work properly for setters defined in classes 2 levels above', function(){

        var Vehicle = root.define({

            _speed: 10,

            get speed(){
                return this._speed + 'km'
            },

            set speed(s){
                this._speed = s
            }
        })

        var Car = root.define({
            extend: Vehicle
        })

        var SpeedCar = root.define({
            extend: Car
        })

        var lotus = new SpeedCar()
        lotus.speed = 250

        expect(lotus.speed).toBe('250km')
        expect(lotus._speed).toBe(250)

        var TopSpeedCar = root.define({
            extend: SpeedCar,
            set speed(s){
                this.callSuperWith(2*s)
            }
        })

        var ferrari = new TopSpeedCar()

        expect(ferrari._speed).toBe(10)
        expect(ferrari.speed).toBe('10km')
        ferrari.speed = 200
        expect(ferrari._speed).toBe(400)
        expect(ferrari.speed).toBe('400km')

    })

    it('should work properly for setters defined - case 2', function(){

        var Vehicle = root.define({

            _speed: 10,

            get speed(){
                return this._speed + 'km'
            },

            set speed(s){
                this._speed = s
            }
        })

        var Car = root.define({
            extend: Vehicle,
            get speed(){
                return this._speed + 'miles'
            }
        })

        var c = new Car()

        c.speed = 1
        expect(c.speed).toBe('1miles')

        var SpeedCar = root.define({
            extend: Car
        })

        var lotus = new SpeedCar()
        lotus.speed = 250

        expect(lotus.speed).toBe('250miles')
        expect(lotus._speed).toBe(250)

        var TopSpeedCar = root.define({
            extend: SpeedCar,
            set speed(s){
                this.callSuperWith(2*s)
            }
        })

        var ferrari = new TopSpeedCar()

        expect(ferrari._speed).toBe(10)
        expect(ferrari.speed).toBe('10miles')
        ferrari.speed = 200
        expect(ferrari._speed).toBe(400)
        expect(ferrari.speed).toBe('400miles')

    })

    it('should use getter with call overriden', function(){
        var Vehicle = root.define({

            _speed: 1,

            get speed(){
                return this._speed
            }
        })

        var Car = root.define({
            extend: Vehicle,
            _speed: 5,

            get speed(){
                return this.callSuper() + 10
            }
        })

        root.override(Car, {
            get speed(){
                return this.callOverriden() * 3
            }
        })

        var c = new Car()
        expect(c.speed).toBe(45)
    })

    it('should silence call to callSuper when no super exists', function(){
        var Session = root.define({
            last: 2014,

            get duration(){
                return this.last - (this.callSuper() || 2000)
            }
        })

        var s = new Session()
        expect(s.duration).toBe(14)
    })

    it('should allow accessors as static props', function(){
        var Session = root.define({
            statics: {
                last: 2014,
                get duration(){
                    return this.last - (this.callSuper() || 2000)
                }
            }
        })

        var BrowserSession = root.define({
            extend: Session,
            statics: {
                last: 2015
            }
        })

        expect(BrowserSession.duration).toBe(15)

        root.override(BrowserSession, {
            statics: {
                get duration(){
                    return 2 * this.callOverriden()
                }
            }
        })

        expect(BrowserSession.duration).toBe(30)
    })

    it('should not call getters on define', function(){
        root.define({
            alias: 'adsdsaf3',
            get test(){
                expect(1).toBe(2)
                this.x()
            }
        })
    })

})

