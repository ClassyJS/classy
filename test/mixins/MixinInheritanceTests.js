/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */
describe('mixin inheritance should work as expected', function(){

    var root = classy

    root.defineMixin({
        alias: 'math',
        $override: {

            append: function(arr){
                arr.push('math')
                return this.callTarget()
            }
        }
    })

    var AdvancedMath = root.defineMixin({
        extend : 'math',
        alias  : 'advancedmath',

        $override: {
            append: function(arr){
                arr.push('advanced')
                return this.callTarget().join('-')
            }
        }

    })

    it('should apply inheritance properly', function(){
        var Logger = root.defineMixin({
            alias: 'logger',

            $override: {
                log: function(msg){
                    return this.msg = msg
                }
            }
        })

        var ServerLogger = root.defineMixin({
            extend: 'logger',
            alias : 'serverlogger',

            $override: {
                log: function(msg){
                    return this.msg = 'send ' + this.callSuper()
                }
            }
        })

        expect(typeof ServerLogger.prototype.log).toBe('function')
        var simpleLogger = new Logger()
        var sLogger = new ServerLogger()

        expect(simpleLogger.log('test')).toBe('test')
        expect(sLogger.log('test')).toBe('send test')

        var log = {}

        root.mixin(log, 'logger')

        expect(log.log('test')).toBe('test')

        log = {}

        root.mixin(log, 'serverlogger')

        expect(log.log('test')).toBe('send test')

        log.addMixin({
            $after: {
                warn: function(w){
                    return this.warnMsg = w
                },
                log: function(l){
                    return this.msg = l + '!!!'
                }
            }
        })

        expect(typeof log.warn).toBe('function')
        expect(log.warn('warning!')).toBe('warning!')
        expect(log.log('thelog')).toBe('send thelog')
        expect(log.msg).toBe('thelog!!!')

        root.destroyClass('logger')
        root.destroyClass('serverlogger')

    })

    it('mixin should call overriden method', function(){
        var AdvancedSuperMath = root.define({
            extend : 'math',
            alias  : 'advancedsupermath',

            $override: {
                append: function(arr){
                    arr.push('advanced')
                    this.callSuper()
                    return this.callTarget()
                }
            }
        })

        var Computer = root.define({
            mixins: [
                'math'
            ],
            append: function(arr){
                return arr.push('computer'), 1
            }
        })

        var c = new Computer()
        var x = []

        expect(c.append(x)).toEqual(1)
        expect(x).toEqual(['math','computer'])

        root.destroyClass(Computer)

        x = []

        //since the mixin is instantiated and not applied on something
        //the callTarget method is simply an empty function, so things should work

        var sm = new AdvancedSuperMath()
        expect(sm.append(x)).toBe(undefined)
        expect(x).toEqual(['advanced','math'])

        Computer = root.define({
            mixins: [
                'advancedsupermath'
            ],
            append: function(arr){
                return arr.push('computer'), 1
            }
        })

        c = new Computer()
        x = []

        expect(c.append(x)).toEqual(1)
        expect(x).toEqual(['advanced','math','computer','computer'])

        root.destroyClass('advancedsupermath')

    })

    it('should work fine with mixin inheriting from another mixin', function(){
        var AdvancedSuperMath = root.define({
            extend : 'math',
            alias  : 'advancedsupermath',

            $override: {
                append: function(arr){
                    arr.push('advanced')
                    return this.callSuper()
                }
            }
        })

        var C = root.define({
               mixins: [
                   AdvancedSuperMath
               ],
               append: function(arr){
                   return arr.push('computer'), 5
               }
           })

           var c = new C()
           var x = []

           expect(c.append(x)).toBe(5)

           expect(x).toEqual(['advanced','math','computer'])
    })

    it('should simply call callTarget', function(){
        var logger = {
            $override: {
                init: function(){
                    this.callTarget()
                    this.logs = []
                },
                log: function(msg, arr){
                    this.logs.push(msg)
                    arr.push(msg)

                    return this.callTarget()
                }
            }
        }

        var obj = {
            log: function(msg, arr){
                arr.push('x' + msg)
                return arr
            }
        }

        root.mixin(obj, logger)

        var x = []

        obj.init()
        expect(obj.log('test',x)).toEqual(['test','xtest'])
        expect(x).toEqual(['test','xtest'])

    })

    it('should simply call callTargetWith', function(){
        var logger = {
            $override: {
                init: function(){
                    this.callTarget()
                    this.logs = []
                },
                log: function(msg, arr){
                    this.logs.push(msg)
                    arr.push(msg)

                    return this.callTargetWith(msg+'!', arr)
                }
            }
        }

        var obj = {
            log: function(msg, arr){
                arr.push('x' + msg)
                return arr
            }
        }

        root.mixin(obj, logger)

        var x = []

        obj.init()
        expect(obj.log('test',x)).toEqual(['test','xtest!'])
        expect(x).toEqual(['test','xtest!'])

    })
})
