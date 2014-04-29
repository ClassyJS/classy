module.exports = function(){

    'use strict'

    var emptyFn = function(){}

    function buildSuperFn(name, fn, host){
        return function() {
            var tmpSuper     = this.callSuper,
                tmpSuperWith = this.callSuperWith,
                args         = arguments

            /*
             * Use callSuperWith method in order to pass in different parameter values from those that have been used
             * @param argumentsPassed
             * @return {Mixed} the result of the super method
             */
            this.callSuperWith = function(){
                return (host[name] || emptyFn).apply(this, arguments)
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
                return (host[name] || emptyFn).apply(this, args)
            }

            var ret = fn.apply(this, args)

            this.callSuper     = tmpSuper
            this.callSuperWith = tmpSuperWith

            return ret
        }
    }

    function buildOverridenFn(name, currentFn, host){

        var overridenFn = host[name]

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