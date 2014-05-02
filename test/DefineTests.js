describe('define', function(){

    var root = classy

    it('should work as expected', function(){
        var Car = root.define({

            init: function(name){
                this.callSuper()
                this.name = name
            },

            getName: function(){
                return this.name
            }
        })

        var bmw = new Car('bmw')

        expect(bmw.getName()).toEqual('bmw')
        Car.destroy()
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

        var Car = root.define({
            alias: 'Car',
            extend: Vehicle,

            init: function(name, age){
                this.callSuperWith(name)
                this.age = age
            }
        })

        var renault = new Car('renault', 1980)

        expect(renault.getName()).toEqual('renault')

        Car.destroy()
    })

    it('should work to extend a class that extends an existing function', function(){
        function Vehicle(name){
            this.name = name
        }

        Vehicle.prototype = {
            getName: function(){
                return this.name
            }
        }

        var Car = root.define({
            alias  : 'Car',
            extend : Vehicle,

            year: 1980,
            init: function(){
                this.callSuper()
            }
        })

        var SpeedCar = root.define({
            alias: 'SpeedCar',
            extend: Car,

            init: function(name, speed){
                this.callSuper()
                this.maxSpeed = speed
            }
        })

        var f1 = new SpeedCar('formula1', 379)

        expect(f1.name).toEqual('formula1')

        SpeedCar.destroy()
    })
})