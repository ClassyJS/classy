/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */
describe('mixin init on should work when specified on mixin', function(){

    var root = classy

    it('should call mixin init as specified ', function(){

        root.defineMixin({
            alias: 'observable',
            initOn: 'ready',

            $before: {
                init: function(name){
                    this.observableName = name

                    this.configureObservable()
                }
            },

            $override: {
                configureObservable: function(){
                    this.fns = {}
                    this.length = 0
                },

                on: function(name, fn){
                    this.fns[name] = this.fns[name] || []
                    this.fns[name].push({name: name, fn: fn})
                },

                fireEvent: function(event){

                }
            }
        })

        var ComputerClass = root.define({
            alias: 'computer',

            mixins: ['observable'],

            statics: {
                DESTROYED: false,
                destroy: function(){
                    this.DESTROYED = true
                }
            },

            init: function(name){
                this.name = name

                this.startHDD()
                this.startMemory()
            },

            ready: function(){

            },

            startHDD: function(){
                this.hddStarted = true
            },

            startMemory: function(){
                this.memoryStarted = true
            }
        })

        var c = root.create('computer', 'my pc')

        expect(c.observableName).toBe(undefined)
        expect(c.name).toBe('my pc')

        c.ready(c.name)

        expect(c.observableName).toBe('my pc')
        expect(c.length).toBe(0)

        root.destroyClass('computer')
        root.destroyClass('observable')

        expect(root.getClass('computer')).toBe(undefined)
        expect(ComputerClass.DESTROYED).toBe(true)
    })
})

describe('mixin init on should work when specified on target', function(){

    var root = classy

    it('should call mixin init as specified ', function(){

        var timesInited = 0

        var ObservableClass = root.defineMixin({
            alias: 'observable',
            initOn: 'ready',

            $before: {
                init: function(name){
                    this.aName = name
                    this.computerName = this.name
                    timesInited++
                }
            }
        })

        var ComputerClass = root.define({
            alias: 'computer',

            mixins: [
                {
                    alias: 'observable',
                    initOn: 'startMemory'
                },
                ObservableClass
            ],

            statics: {
                DESTROYED: false,
                destroy: function(){
                    this.DESTROYED = true
                }
            },

            init: function(name){
                this.name = name

                this.startHDD()
            },

            startHDD: function(){
                this.hddStarted = true
            },

            startMemory: function(){
                this.memoryStarted = true
            }
        })

        var c = root.create('computer', 'my pc')

        expect(c.observableName).toBe(undefined)
        expect(c.name).toBe('my pc')

        c.startMemory('mem start')

        expect(c.aName).toBe('mem start')
        expect(c.computerName).toBe('my pc')

        //make sure mixin is not applied twice
        expect(ComputerClass.prototype.$mixins).toEqual(['observable'])
        expect(timesInited).toEqual(1)

        root.destroyClass('computer')
        root.destroyClass('observable')
    })
})
