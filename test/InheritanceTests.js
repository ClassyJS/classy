
describe('inheritance should work properly', function(){

    var Zpy = classy

    var LivingCreature = Zpy.createClass({

            alive: true,

            init: function(name){
                this.name = name
            },

            setAge: function(age){
                this.age = age

                return this
            }

        }),

        Bird = Zpy.createClass(LivingCreature, {

            init: function(name, wings){

                this.callSuper()
                this.setWings(wings)

            },

            getWings: function(){
                return this.wings
            },

            setWings: function(wings){
                this.wings = wings

                return this
            }
        })

    it('should respect instanceof', function(){
        var rabbit = new LivingCreature('rabbit'),
            eagle = new Bird('eagle', 2)

        expect(eagle instanceof Bird).toBe(true)
        expect(eagle instanceof LivingCreature).toBe(true)
        expect(rabbit instanceof LivingCreature).toBe(true)
        expect(rabbit instanceof Bird).toBe(false)

    })

    it('should create class', function(){

        var rabbit = new LivingCreature('rabbit')

        rabbit.setAge(5)

        expect(rabbit.name).toBe('rabbit')
        expect(rabbit.age).toBe(5)
    })

    it('should extend and callSuper', function(){
        var eagle = new Bird('eagle', 2)

        expect(eagle.name).toBe('eagle')
        expect(eagle.getWings()).toBe(2)

    })

    it('should callSuperWith explicit arguments', function(){
        var Student = Zpy.createClass({

            setData: function(firstName, lastName, birthYear){
                this.firstName = firstName
                this.lastName  = lastName
                this.birthYear = birthYear
            }

        })

        var ComputerScienceStudent = Zpy.createClass(Student, {

            setData: function(firstName, lastName){
                this.callSuperWith('mike', 'jonny', 25)
            }

        })

        var cs = new ComputerScienceStudent()
        cs.csName = 'UBB'

        cs.setData('test', 'lastName', 45)

        expect(cs.firstName).toBe('mike')
        expect(cs.lastName).toBe('jonny')
        expect(cs.birthYear).toBe(25)

        expect(cs.csName).toBe('UBB')
    })

    it('callSuper should return correctly', function(){

        var Student = Zpy.createClass({
            setData: function(firstName, lastName, birthYear){
                this.firstName = firstName
                this.lastName  = lastName
                this.birthYear = birthYear

                return birthYear
            }
        });

        var ComputerScienceStudent = Zpy.createClass(Student, {
            setData: function(firstName, lastName){
                this.year = this.callSuper() + 1
            }

        })

        var cs = new ComputerScienceStudent()
        cs.setData('test','lastName',45)

        expect(cs.firstName).toBe('test')
        expect(cs.lastName).toBe('lastName')
        expect(cs.birthYear).toBe(45)
        expect(cs.year).toBe(46)
    })

    it('should work fine with multiple levels of inheritance', function(){
        var names = []

        var LivingCreature = Zpy.createClass({
            setData: function(name, age){
                this.name = name
                this.age = age

                names.push(name)
                names.push(age)

                this.callSuperWith()
            }
        });

        var Mammar = Zpy.createClass(LivingCreature, {
            setData: function(){
                this.callSuper()

                names.push('mammar')
            }
        })

        var Pet = Zpy.createClass(Mammar, {
            setData: function(name, age){
                this.callSuperWith('mypet', age)

                names.push(name)
            }
        })

        var Dog = Zpy.createClass(Pet, {
            setData: function(){
                names.push('dog')
                this.callSuper()
            }
        });

        var d = new Dog()
        d.setData('doggy', 12)

        expect(names).toEqual(['dog','mypet',12,'mammar','doggy'])
    })

    it('should return fine from callSuper', function(){
        var LivingCreature = Zpy.createClass({
            setData: function(name, age){
                return name + ' ' + age
            }
        })

        var Mammar = Zpy.createClass(LivingCreature, {
            setData: function(){
                return this.callSuper()
            }
        })

        var m = new Mammar()

        expect(m.setData('mammar animal', 12)).toBe('mammar animal 12')
    })

    it('should return parent class', function(){

        var A = Zpy.define({}),
            B = Zpy.define(A, {}),
            C = Zpy.define(B, {})

        expect(Zpy.getParentClass(C)).toBe(A)
        expect(Zpy.getParentClass(B)).toBe(A)
        expect(Zpy.getParentClass(A)).toBe(undefined)

    })

    it('should extend function/class created without classy', function(){
        function Animal(sound){
            this.sound = sound
        }

        Animal.prototype.makeSound = function(){
            return 'I sound like this: ' + this.sound
        }

        var Dog = classy.define({
            extend: Animal,
            alias: 'dog',
            init: function(){
                this.callSuperWith('bark')
            }
        })

        var dog = new Dog()
        expect(dog.makeSound()).toBe('I sound like this: bark')
    })
})
