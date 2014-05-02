
describe('test static properties are copied on the classes', function(){

    var root = classy

    it('should have static properties', function(){
        var result = true

        var Computer = root.createClass({
            alias: 'Computer',
            age: 5,

            init: function(doIncrement){
                if (doIncrement){
                    this.age++
                }
            },

            statics: {
                instanceCount: 0,

                getInstanceCount: function(){
                    return this.instanceCount
                }
            }
        })

        var c = new Computer(true)

        expect(c.age).toBe(6)

        c.$ownClass.instanceCount++

        var c2 = new Computer()

        expect(c2.age).toBe(5)
        c2.$ownClass.instanceCount++

        Computer.instanceCount++

        expect(Computer.instanceCount).toBe(3)
        expect(Computer.getInstanceCount()).toBe(3)
    })

    it('should copy static properties on sub classes as well', function(){
        var Creature = root.createClass({
            statics: {
                wild: true,

                isWildCreature: function(){
                    return this.wild
                },

                getMaxAge: function(){
                    return this.maxAge || 100
                }
            },

            init: function(name, age){
                this.name = name
                this.age = age || 0
            }
        })

        var Pet = root.createClass(Creature, {

        })

        var doggy = new Pet('doggy',5)

        expect(doggy.age).toBe(5)
        expect(Creature.isWildCreature()).toBe(true)
        expect(Pet.isWildCreature()).toBe(true)

        var Dog = root.createClass(Pet, {
            statics: {
                wild: false
            }
        })

        expect(Dog.isWildCreature()).toBe(false)

        var Cat = root.createClass(Pet, {
            statics: {
                getMaxAge: function(){
                    return this.callSuper()
                }
            }
        })

        expect(Cat.getMaxAge()).toBe(100)
        Cat.maxAge = 111
        expect(Cat.getMaxAge()).toBe(111)

    })

    it('should override static properties correctly', function(){
        var Creature = root.createClass({

            statics: {
                getMaxAge: function(){
                    return this.maxAge || 100
                },

                getSpeciesName: function(){
                    return 'creature'
                }
            },

            init: function(name, age){
                this.name = name
                this.age = age || 0
            }
        })

        var Dog = root.createClass(Creature, {
            statics: {
                getPrice: function(){
                    return 50
                }
            }
        })

        expect(Dog.getPrice()).toBe(50)

        root.overrideClass(Dog, {
            statics: {
                getPrice: function(){
                    return 30 + this.callOverriden()
                },

                getMaxAge: function(){
                    return 10 + this.callSuper()
                },

                getLiveHope: function(){
                    return this.getMaxAge() - 10
                }
            }
        })

        expect(Dog.getPrice()).toBe(80)
        expect(Dog.getMaxAge()).toBe(110)

        Dog.maxAge = 20

        expect(Dog.getMaxAge()).toBe(30)
        expect(Dog.getLiveHope()).toBe(20)
    })

    it('should get class from both class and prototype', function(){

        var Class = root.define({

        })

        expect(root.getClass(Class)).toBe(Class)
        expect(root.getClass(Class.prototype)).toBe(Class)
    })
})