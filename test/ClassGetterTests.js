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

})

