/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2014 Radu Brehar <contact@zippyui.com>

 The source code is distributed under the terms of the MIT license.
 See https://github.com/zippyui/ZippyUI/blob/master/LICENCE

 */

describe('Zpy.getClass should return correctly', function(){

    var root = classy

    it('should return the base class when no param given', function(){

        expect(root.getClass() == root.BaseClass).toBe(true)

    })
})
