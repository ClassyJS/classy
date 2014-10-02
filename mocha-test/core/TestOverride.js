describe('Core.createClass', function(){
    var core = require('../../src/core/index')
    var overrideClass = core.overrideClass
    var overrideObject = core.overrideObject

    var should = require('should')

    it('should override Constructor fn', function(){
        function Person(name){
            this.name = name
        }

        Person.prototype.getName = function(){
            return this.name
        }

        var p = new Person('bob')

        p.getName()
            .should
            .equal('bob')

        overrideClass(Person, {
            getName: function(){
                return this.callOverriden() + '!'
            }
        })

        p = new Person('john')

        p.getName()
            .should
            .equal('john!')
    })

    it('should override simple object', function(){
        var person = {
            name: 'x',
            getName: function(){
                return this.name
            }
        }

        overrideObject(person, {
            getName: function(){
                return this.callOverriden() + '!'
            }
        })
    })
})