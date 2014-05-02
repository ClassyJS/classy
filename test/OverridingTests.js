describe('callOverriden', function(){

    var root = classy

    it('should call super if no overriden method declared', function(){


        var Super = root.createClass({
            testCalled: 0,
            prepareComponent: function(){
                this.superCalled = true
            },
            test: function(){
                this.testCalled++
            }
        })

        var SubClass = root.createClass(Super, {
            a: function(){}
        })

        root.overrideClass(SubClass, {
            prepareComponent: function(){
                this.callOverriden()
                this.calledPrepare = true
            }
        })

        var inst = new SubClass()

        inst.a()
        inst.prepareComponent()

        expect(inst.calledPrepare).toBe(true)
        expect(inst.superCalled).toBe(true)
    })
})

describe('test overriden function is called', function(){

    var root = classy

    it('should call overriden function properly', function(){
        var firstN,
            lastN,
            birthY

        var Person = root.createClass({

            setData: function(firstName, lastName, birthYear){
                this.firstName = firstN = firstName
                this.lastName  = lastN  = lastName
                this.birthYear = birthY = birthYear

                this.callOverriden()
            }

        })

        root.overrideClass(Person, {
            setData: function(){
                this.callOverriden()
            }
        })

        var john = new Person()
        john.setData('john','Stuart', 1900)

        expect(firstN).toBe('john')
        expect(lastN).toBe('Stuart')
        expect(birthY).toBe(1900)
        expect(john.birthYear).toBe(1900)
    })

    it('should call callOverridenWith with correct parameters', function(){
        var firstN,
            lastN,
            birthY,
            nrOfCalls = 0

        var Person = root.createClass({

            setData: function(firstName, lastName, birthYear){
                this.firstName = firstN = firstName
                this.lastName = lastN = lastName
                this.birthYear = birthY = birthYear

                nrOfCalls += 2

                this.callOverriden()
            }
        });

        root.overrideClass(Person, {
            setData: function(){
                this.callOverridenWith('eduard', 'ramsey', 0)

                nrOfCalls += 4
            }
        })

        root.overrideClass(Person,{
            setData: function(){
                nrOfCalls += 8
                this.callOverriden()
            }
        })

        var john = new Person()
        john.setData('john','Stuart', 1900)

        expect(firstN).toBe('eduard')
        expect(lastN).toBe('ramsey')
        expect(birthY).toBe(0)
        expect(nrOfCalls).toBe(14)
    })

})

describe('call overriden should work just fine with call super', function(){

    var root = classy

    it('should work fine when used together with callSuper', function(){
        var lastSetName = ''
        var callIndex   = 0

        var Person = root.createClass({

            init: function(){
                this.name = arguments[0]
            },

            setName: function(name){
                callIndex++
                expect(callIndex).toBe(3)
                this.name = lastSetName = name
            },

            getName: function(){
                return this.name
            }
        })

        var Doctor = root.createClass(Person, {

            setName: function(name, age){
                callIndex++
                expect(callIndex).toBe(2)

                this.age = age
                this.name = 'DOCTOR ' + name
            }

        })

        root.overrideClass(Doctor, {
            setName: function(name){
                callIndex++
                expect(callIndex).toBe(1)

                this.title = 'Mr ' + name
                this.callOverriden()

                expect(this.name).toBe('DOCTOR ' + name)

                this.callSuper()
            }
        })

        var j = new Doctor('john')

        j.setName('Michael', 40)

        expect(j.title).toBe('Mr Michael')
        expect(j.name).toBe('Michael')
        expect(j.age).toBe(40)
        expect(lastSetName).toBe('Michael')
        expect(callIndex).toBe(3)
    })

    it('should work even when there is no super method or there is no method to override', function(){

        var LivingBeing = root.createClass({
            lifeHope: 40,

            init: function(hope){
                if (Wes.isValue(hope)){
                    this.lifeHope = hope
                }
            },

            setLifeHope: function(lh){
                this.lifeHope = lh
                this.callSuperWith()
                this.callOverriden()
                this.callOverridenWith()
                this.callSuper()
            }
        })

        var Mammal = root.createClass(LivingBeing, {
            average: -1,

            init: function(lh){
                if (lh){
                    this.setLifeHope(lh)
                }

                this.doSomething()
            },

            setLifeHope: function(lh){
                this.callOverridenWith(lh)

                this.average = lh - 10
            },

            getAverageLife: function(){
                return this.average
            }
        })

        root.overrideClass(Mammal, {
            doSomething: function(){},
            getName: function(name){
                return this.callSuper() || this.callOverriden() || name || 'mammal'
            }
        })

        var bear = new Mammal(50)

        expect(bear.lifeHope).toBe(50)
        expect(bear.average).toBe(40)

        bear.setLifeHope(30)

        expect(bear.lifeHope).toBe(30)
        expect(bear.average).toBe(20)
        expect(bear.getAverageLife()).toBe(20)
        expect(bear.getName('teddy')).toBe('teddy')
    })
})