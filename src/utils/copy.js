/*

 This file is part of the ZippyUI Framework

 Copyright (c) 2011 ZippyUI.com

 All rights reserved to zippyui.com
 This software cannot be used/copied/distributed without the express permission from staff at zippyui.com

 */
module.exports = function(){

    'use strict'

    var HAS_OWN       = Object.prototype.hasOwnProperty,
        STR_OBJECT    = 'object',
        STR_UNDEFINED = 'undefined'

    return {

        /**
         * @class Zpy
         */

        /**
         * Copies all properties from source to destination
         *
         *      Zpy.copy({name: 'jon',age:5}, this);
         *      // => this will have the 'name' and 'age' properties set to 'jon' and 5 respectively
         *
         * @param {Object} source
         * @param {Object} destination
         *
         * @return {Object} destination
         */
        copy: function(source, destination){

            destination = destination || {}

            if (source != null && typeof source === STR_OBJECT ){

                for (var i in source) if ( HAS_OWN.call(source, i) ) {
                    destination[i] = source[i]
                }

            }

            return destination
        },

        /**
         * Copies all properties from source to destination, if the property does not exist into the destination
         *
         *      Zpy.copyIf({name: 'jon',age:5}, {age:7})
         *      // => { name: 'jon', age: 7}
         *
         * @param {Object} source
         * @param {Object} destination
         *
         * @return {Object} destination
         */
        copyIf: function(source, destination){
            destination = destination || {}

            if (source != null && typeof source === STR_OBJECT){

                for (var i in source) if ( HAS_OWN.call(source, i) && (typeof destination[i] === STR_UNDEFINED) ) {

                    destination[i] = source[i]

                }
            }

            return destination
        },

        /**
         * Copies all properties from source to a new object, with the given value. This object is returned
         *
         *      Zpy.copyAs({name: 'jon',age:5})
         *      // => the resulting object will have the 'name' and 'age' properties set to 1
         *
         * @param {Object} source
         * @param {Object/Number/String} [value=1]
         *
         * @return {Object} destination
         */
        copyAs: function(source, value){

            var destination = {}

            value = value || 1

            if (source != null && typeof source === STR_OBJECT ){

                for (var i in source) if ( HAS_OWN.call(source, i) ) {
                    destination[i] = value
                }

            }

            return destination
        },

        /**
         * Copies all properties named in the list, from source to destination
         *
         *      Zpy.copyList({name: 'jon',age:5, year: 2006}, {}, ['name','age'])
         *      // => {name: 'jon', age: 5}
         *
         * @param {Object} source
         * @param {Object} destination
         * @param {Array} list the array with the names of the properties to copy
         *
         * @return {Object} destination
         */
        copyList: function(source, destination, list){
            if (arguments.length == 2){
                list = destination
                destination = null
            }

            destination = destination || {}
            list        = list || []

            var i   = 0,
                len = list.length,
                propName

            for( ; i < len; i++ ){
                propName = list[i]

                if ( typeof source[propName] !== STR_UNDEFINED ) {
                    destination[list[i]] = source[list[i]]
                }
            }

            return destination
        },

        /**
         * Copies all properties named in the list, from source to destination, if the property does not exist into the destination
         *
         *      Zpy.copyListIf({name: 'jon',age:5, year: 2006}, {age: 10}, ['name','age'])
         *      // => {name: 'jon', age: 10}
         *
         * @param {Object} source
         * @param {Object} destination
         * @param {Array} list the array with the names of the properties to copy
         *
         * @return {Object} destination
         */
        copyListIf: function(source, destination, list){
            if (arguments.length == 2){
                list = destination
                destination = null
            }

            destination = destination || {}
            list        = list || []

            var propName,
                i   = 0,
                len = list.length

            for(; i<len ; i++){
                propName = list[i]
                if (
                        (typeof source[propName]      !== STR_UNDEFINED) &&
                        (typeof destination[propName] === STR_UNDEFINED)
                    ){
                    destination[propName] = source[propName]
                }
            }

            return destination
        },

        /**
         * Copies all properties named in the namedKeys, from source to destination
         *
         *      Zpy.copyKeys({name: 'jon',age:5, year: 2006, date: '2010/05/12'}, {}, {name:1 ,age: true, year: 'theYear'})
         *      // => {name: 'jon', age: 5, theYear: 2006}
         *
         * @param {Object} source
         * @param {Object} destination
         * @param {Object} namedKeys an object with keys denoting the properties to be copied
         *
         * @return {Object} destination
         */
        copyKeys: function(source, destination, namedKeys){
            if (arguments.length == 2){
                namedKeys = destination
                destination = null
            }

            destination = destination || {}

            if (
                   source != null && typeof source    === STR_OBJECT &&
                namedKeys != null && typeof namedKeys === STR_OBJECT
            ) {
                var typeOfNamedProperty,
                    namedPropertyValue

                for  (var propName in namedKeys) if ( HAS_OWN.call(namedKeys, propName) ) {
                    namedPropertyValue  = namedKeys[propName]
                    typeOfNamedProperty = typeof namedPropertyValue

                    if (typeof source[propName] !== STR_UNDEFINED){
                        destination[typeOfNamedProperty == 'string'? namedPropertyValue : propName] = source[propName]
                    }
                }
            }

            return destination
        },

        /**
         * Copies all properties named in the namedKeys, from source to destination,
         * but only if the property does not already exist in the destination object
         *
         *      Zpy.copyKeysIf({name: 'jon',age:5, year: 2006}, {aname: 'test'}, {name:'aname' ,age: true})
         *      // => {aname: 'test', age: 5}
         *
         * @param {Object} source
         * @param {Object} destination
         * @param {Object} namedKeys an object with keys denoting the properties to be copied
         *
         * @return {Object} destination
         */
        copyKeysIf: function(source, destination, namedKeys){
            if (arguments.length == 2){
                namedKeys   = destination
                destination = null
            }

            destination = destination || {}

            if (
                       source != null && typeof source    === STR_OBJECT &&
                    namedKeys != null && typeof namedKeys === STR_OBJECT
                ) {

                    var typeOfNamedProperty,
                        namedPropertyValue,
                        newPropertyName

                    for (var propName in namedKeys) if ( HAS_OWN.call(namedKeys, propName) ) {

                        namedPropertyValue  = namedKeys[propName]
                        typeOfNamedProperty = typeof namedPropertyValue
                        newPropertyName     = typeOfNamedProperty == 'string'? namedPropertyValue : propName

                        if (
                                typeof      source[propName]        !== STR_UNDEFINED &&
                                typeof destination[newPropertyName] === STR_UNDEFINED
                            ) {
                            destination[newPropertyName] = source[propName]
                        }

                    }
                }

            return destination
        },

        copyExceptKeys: function(source, destination, exceptKeys){
            destination = destination || {}
            exceptKeys  = exceptKeys  || {}

            if (source != null && typeof source === STR_OBJECT ){

                for (var i in source) if ( HAS_OWN.call(source, i) && !HAS_OWN.call(exceptKeys, i) ) {

                    destination[i] = source[i]
                }

            }

            return destination
        },

        /**
         * Copies the named keys from source to destination.
         * For the keys that are functions, copies the functions bound to the source
         *
         * @param  {Object} source      The source object
         * @param  {Object} destination The target object
         * @param  {Object} namedKeys   An object with the names of the keys to copy The values from the keys in this object
         *                              need to be either numbers or booleans if you want to copy the property under the same name,
         *                              or a string if you want to copy the property under a different name
         * @return {Object}             Returns the destination object
         */
        bindCopyKeys: function(source, destination, namedKeys){
            if (arguments.length == 2){
                namedKeys = destination
                destination = null
            }

            destination = destination || {}

            if (
                       source != null && typeof source    === STR_OBJECT &&
                    namedKeys != null && typeof namedKeys === STR_OBJECT
                ) {


                var typeOfNamedProperty,
                    namedPropertyValue,

                    typeOfSourceProperty,
                    propValue


                for(var propName in namedKeys) if (HAS_OWN.call(namedKeys, propName)) {

                    namedPropertyValue = namedKeys[propName]
                    typeOfNamedProperty = typeof namedPropertyValue

                    propValue = source[propName]
                    typeOfSourceProperty = typeof propValue


                    if ( typeOfSourceProperty !== STR_UNDEFINED ) {

                        destination[
                            typeOfNamedProperty == 'string'?
                                            namedPropertyValue :
                                            propName
                            ] = typeOfSourceProperty == 'function' ?
                                            propValue.bind(source):
                                            propValue
                    }
                }
            }

            return destination
        }
    }

}()