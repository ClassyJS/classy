'use strict'

module.exports = (function(){
    var o = {}

    try {
        Object.defineProperty(o, 'name', {
            value: 'x'
        })

        return true
    } catch (ex) { }

    return false

})()