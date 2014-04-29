var define = require('./define')
var copyIf = require('./utils/copy').copyIf

module.exports = function(members){

    'use strict'

    return define(copyIf({ extend: 'z.mixin'}, members))
}