/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */
describe('Classes should be able to have mixins (mixins as statics)', function(){

    var root = classy

    it('should receive mixins on Class', function(){

        root.defineMixin({
            alias: 'logger',

            $override: {
                log: function(l){
                    return this.log = l
                }
            }
        })

        var ComputerClass = root.define({

            statics: {
                mixins: [ 'logger' ],
                getLanguage: function(){
                    return 'english'
                }
            }
        })

        expect(ComputerClass.getLanguage()).toBe('english')
        expect(ComputerClass.log('test')).toBe('test')

        root.destroyClass('logger')
    })
})
