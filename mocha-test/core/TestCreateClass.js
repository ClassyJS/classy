describe('Core.createClass', function(){
    var core = require('../../src/core/index')
    var createClass = core.createClass

    var should = require('should')

    it('should create class correctly', function(){

        var Person = createClass({
            init: function(n){
                this.name = n
            },

            getName: function(){
                return this.name
            }
        })

        var p = new Person('x')

        p.getName()
            .should
            .equal('x')

    })

    it('should create class with a specified parent class', function(){

        var Person = createClass({
            init: function(n){
                this.name = n
            },

            getName: function(){
                return this.name
            }
        })

        var Child = createClass(Person, {
            init: function(name, age){
                this.callSuper()
                this.age = age
            },
            isSmall: function(){
                return this.age < 14
            }
        })

        var c = new Child('johny', 10)

        should(c instanceof Person)
            .equal(true)

        c.isSmall()
            .should
            .equal(true)

        c.age = 14

        c.isSmall()
            .should
            .equal(false)
    })
})