/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2011 ZippyUI.com

 All rights reserved to zippyui.com
 This software cannot be used/copied/distributed without the express permission from staff at zippyui.com

 */

describe('Zpy.getClass should return correctly', function(){

    var root = classy

    it('should return the base class when no param given', function(){

        expect(root.getClass() == root.BaseClass).toBe(true)

    })
})
