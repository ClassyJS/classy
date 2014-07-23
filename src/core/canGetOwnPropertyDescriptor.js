'use strict'

module.exports = (function(){
    return 'getOwnPropertyDescriptor' in Object && typeof Object.getOwnPropertyDescriptor == 'function'
})()