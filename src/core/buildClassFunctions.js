module.exports = function(){

    'use strict'

    var emptyFn = function(){}
    var getDescriptor = Object.getOwnPropertyDescriptor

    function buildSuperFn(name, fn, superHost, superClass, getterSetterConfig){

        function execute(args){

            var accessor = getterSetterConfig.getter?
                                'get':
                                getterSetterConfig.setter?
                                    'set':
                                    null
            var descriptor = accessor?
                                getDescriptor(superHost, name):
                                null

            var fn   = accessor?
                            descriptor? descriptor[accessor]: null
                            :
                            superHost[name]


            var isFn = typeof fn == 'function'

            if (!isFn && name == 'init'){
                //if the superClass is not from the classy registry,
                //it means it is a simple function and we accept those as well
                if (!superClass.$superClass){
                    fn   = superClass
                    isFn = true
                }
            }

            if (isFn){
                return fn.apply(this, args)
            }
        }

        return function() {
            var tmpSuper     = this.callSuper
            var tmpSuperWith = this.callSuperWith
            var args         = arguments

            /*
             * Use callSuperWith method in order to pass in different parameter values from those that have been used
             * @param argumentsPassed
             * @return {Mixed} the result of the super method
             */
            this.callSuperWith = function(){
                return execute.call(this, arguments)
            }

            /*
             * Use the callSuper method to call the super method and pass the arguments array
             * Example usage:
             *      setName: function(name){
             *          this.callSuper() //you don't have to explicitly pass 'arguments', since it automagically does so :)
             *      }
             * @return {Mixed} the result of the super method
             */
            this.callSuper = function(){
                return execute.call(this, args)
            }

            var ret = fn.apply(this, args)

            this.callSuper     = tmpSuper
            this.callSuperWith = tmpSuperWith

            return ret
        }
    }

    function buildOverridenFn(name, currentFn, host, getterSetterConfig){

        var accessor = getterSetterConfig.getter?
                            'get':
                            getterSetterConfig.setter?
                                'set':
                                null

        var descriptor = accessor?
                            getDescriptor(host, name):
                            null

        var overridenFn = accessor?
                            descriptor? descriptor[accessor]: null
                            :
                            host[name]

        if (typeof overridenFn == 'undefined') {
            //this check is needed for the following scenario - if a method is overriden, and it also calls
            //to callOverriden, but has no method to override (so is the first in the override chain)

            //in this case, currentFn calls to callOverriden, and will later be also overriden.
            //so on the callStack, when currentFn is called in the context of another function,
            //callOverriden will still be bound, and currentFn will call it, while it should be a no-op

            //so in order to avoid all this scenario
            //just make sure we have one more method in the override chain (the base overriden method)
            //and that this method is the empty function
            overridenFn = emptyFn
        }

        return function() {
            var tmpOverriden     = this.callOverriden,
                tmpOverridenWith = this.callOverridenWith,
                args             = arguments

            /*
             * Use callOverridenWith method in order to pass in different parameter values from those that have been used
             * @return {Mixed} the result of the overriden method
             */
            this.callOverridenWith = function(){
                return overridenFn.apply(this, arguments)
            }

            /*
             * Use the callOverriden method to call the overriden method and pass the arguments array
             * Example usage:
             *      setName: function(name){
             *          this.callOverriden() //you don't have to explicitly pass 'arguments', since it automagically does so :)
             *      }
             * @return {Mixed} the result of the overriden method
             */
            this.callOverriden = function(){
                return overridenFn.apply(this, args)
            }

            var ret = currentFn.apply(this, args)

            this.callOverriden     = tmpOverriden
            this.callOverridenWith = tmpOverridenWith

            return ret
        }
    }

    return {
        buildSuperFn     : buildSuperFn,
        buildOverridenFn : buildOverridenFn
    }
}()