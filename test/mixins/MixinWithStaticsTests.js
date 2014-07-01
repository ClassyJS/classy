/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */

describe('Mixin with statics config should add properties to Class as well', function(){

    var root = classy

    it('Mixin statics from $override, $copyIf, $before and $after should be available on mixin class', function(){

        var Console = root.defineMixin({

            statics: {
                $before: {
                    logBefore: function(msg){
                        this.aLogBefore = msg
                    }
                },

                $after: {
                    logAfter: function(msg){
                        this.aLogAfter = msg
                    }
                },

                $override: {
                    logOverride: function(msg){
                        this.aLogOverride = msg
                    }
                },

                $copyIf: {
                    logCopyIf: function(msg){
                        this.aLogCopyIf = msg
                    }
                }
            }
        })

        Console.logBefore('before')
        expect(Console.aLogBefore).toBe('before')

        Console.logAfter('after')
        expect(Console.aLogAfter).toBe('after')

        Console.logOverride('override')
        expect(Console.aLogOverride).toBe('override')

        Console.logCopyIf('copyIf')
        expect(Console.aLogCopyIf).toBe('copyIf')
    })

    it( 'Mixin statics from $override, $copyIf, $before and $after should be able to use callSuper and callOverriden', function() {
        var Console = root.defineMixin({

            statics: {
                $before: {
                    logBefore: function(msg){
                        this.aLogBefore = msg
                    }
                },

                $after: {
                    logAfter: function(msg){
                        return this.aLogAfter = msg
                    }
                },

                $override: {
                    logOverride: function(msg){
                        this.aLogOverride = msg
                    }
                },

                $copyIf: {
                    logCopyIf: function(msg){
                        this.aLogCopyIf = msg
                    }
                }
            }
        })

        var ColorConsole = root.define({
            extend: Console,
            statics: {
                $before: {
                    logBefore: function(msg){
                        return this.callSuperWith(msg + '!')
                    }
                },

                $after: {
                    logAfter: function(msg){
                        this.callSuper()

                        return 'x'
                    }
                }
            }
        })

        ColorConsole.logBefore('before')
        expect(ColorConsole.aLogBefore).toBe('before!')

        expect(ColorConsole.logAfter('after')).toBe('x')
        expect(ColorConsole.aLogAfter).toBe('after')

    })

    it('should mixin statics to class', function(){
        var LivingBeing = root.defineMixin({

            alias: 'livingbeing',

            statics: {

                $override: {
                    getType: function(){
                        return this
                    }
                }

            },

            $override: {

                getName: function(){
                    return this.name
                }
            }

        })

        var Animal = root.define({
            name: 'Dog',

            mixins: [LivingBeing]
        })

        var dog = new Animal()

        expect(dog.getName()).toBe('Dog')
        expect(Animal.getType()).toBe(Animal)

        root.destroyClass('livingbeing')
    })

    it('should mixin statics $copyIf and $before correctly', function(){

        var logs = [],
            warns = [],
            tests = []

        var Console = root.defineMixin({
            statics: {
                $copyIf: {
                    test: function(){

                    }
                },
                $before: {
                    warn: function(msg){
                        warns.push(msg+'!')
                        this.warn = msg
                    }
                },
                $override: {
                    log: function(msg){
                        logs.push('console'+msg)

                        return this.callTarget() + '!'
                    }
                }
            }
        })

        var Logger = root.define({
            mixins: [Console],

            statics: {
                test: function(t){
                    tests.push(t)
                },
                log: function(msg){
                    logs.push(msg)

                    return this.msg = msg
                },
                warn: function(msg){
                    warns.push(msg)

                    return this.warns = msg
                }
            }
        })

        expect(Logger.log('logging')).toBe('logging!')
        expect(Logger.msg).toBe('logging')
        expect(logs).toEqual(['consolelogging','logging'])

        expect(Logger.warn('w')).toBe('w')
        expect(warns).toEqual(['w!','w'])

    })

    it('should work with inherited statics', function(){

        var Console = root.defineMixin({
            statics: {
                $override: {
                    log: function(msg){
                        this.msg = msg

                        return msg
                    }
                }
            }
        })

        var ColoredConsole = root.define({
            extend: Console,
            statics: {
                $override: {
                    log: function(msg){
                        return this.callSuperWith('red: ' + msg)
                    },
                    warn: function(msg){
                        return this.callTargetWith(msg+'!') + '?'
                    }
                }
            }
        })

        var Cmp = root.define({
            mixins: [ColoredConsole],

            statics: {
                warn: function(w){
                    return this.warning = w
                }
            }
        })

        Cmp.log('msg')
        expect(Cmp.msg).toBe('red: msg')

        expect(Cmp.warn('test')).toBe('test!?')
        expect(Cmp.warning).toBe('test!')

    })

})