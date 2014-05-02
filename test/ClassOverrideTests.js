/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2011 ZippyUI.com

 All rights reserved to zippyui.com
 This software cannot be used/copied/distributed without the express permission from staff at zippyui.com

 */
describe('Class.override should work properly', function(){

    var root = classy

    it('should behave as expected on Class.override', function(){

        var Animal = root.define({
            alias: 'animal',

            alive: true,

            getAge: function(){
                return this.age || 0
            },

            setAge: function(age){
                this.age = age

                return this
            },

            getSound: function(){
                return '.'
            },

            isAlive: function(){
                return this.alive
            },

            kill: function(){
                this.alive = false

                return this
            }
        })

        Animal.override({
            getSound: function(){
                return this.callOverriden() + '!'
            }
        })

        expect(new Animal().getSound()).toBe('.!')

        root.override('animal', {
            getSound: function(){
                return this.callOverriden() + '?'
            }
        })

        expect(new Animal().getSound()).toBe('.!?')

        Animal.destroy()

    })

})
