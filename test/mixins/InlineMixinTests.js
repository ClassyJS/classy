/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2011 ZippyUI.com

 All rights reserved to zippyui.com
 This software cannot be used/copied/distributed without the express permission from staff at zippyui.com

 */
describe('a simple inline mixin should work correctly', function(){

    var root = classy

    it('should be possible to define a simple object and use it as mixin', function(){

        var logger = {

            alias: 'x',
            $override: {
                init: function(){},

                log: function(log){
                    this.lastLog = log
                }

            }

        }

        root.define({
            alias: 'animal',

            name: 'my pet',

            mixins: [
                logger,
                logger,
                logger,
                logger,
                {
                    alias: 'x',
                    $override: {
                        warn: function(w){
                            this.lastWarn = w
                        }
                    }
                }
            ],

            ready: function(){}
        })

        var dog = root.create('animal')

        expect(dog.lastLog).toBe(undefined)

        dog.ready()
        dog.log('test')
        dog.warn('warning')

        expect(dog.lastLog).toBe('test')
        expect(dog.lastWarn).toBe('warning')
        expect(root.getClass('animal').prototype.$mixins.length).toBe(2)

        root.destroyClass('animal')

    })

    it('should mixin when using root.mixin', function(){

        var Person = function(name){
            this.name = name
        }

        Person.prototype.getName = function(){
            return this.name
        }

        var logger = {
            $override: {
                log: function(msg){
                    return this.msg = msg
                }
            }
        }

        root.mixin(Person.prototype, logger)

        var p = new Person('rick')

        expect(p.getName()).toBe('rick')
        expect(p.log('logging')).toBe('logging')
    })

})
