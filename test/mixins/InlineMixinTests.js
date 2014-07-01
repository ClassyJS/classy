/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

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
