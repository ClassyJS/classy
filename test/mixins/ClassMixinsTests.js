/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2011 ZippyUI.com

 All rights reserved to zippyui.com
 This software cannot be used/copied/distributed without the express permission from staff at zippyui.com

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
