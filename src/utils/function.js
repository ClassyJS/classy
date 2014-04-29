module.exports = function(){

    var SLICE = Array.prototype.slice

    function bindArgsArray(fn, args){
        return function(){
            var thisArgs = SLICE.call(args || [])

            if (arguments.length){
                thisArgs.push.apply(thisArgs, arguments)
            }

            return fn.apply(this, thisArgs)
        }
    }

    function bindArgs(fn){
        return bindArgsArray(fn, SLICE.call(arguments,1))
    }

    function chain(where, fn, secondFn){
        var fns = [
            where === 'before'? secondFn: fn,
            where !== 'before'? secondFn: fn
        ]

        return function(){
            if (where === 'before'){
                secondFn.apply(this, arguments)
            }

            var result = fn.apply(this, arguments)

            if (where !== 'before'){
                secondFn.apply(this, arguments)
            }

            return result
        }
    }

    function before(fn, otherFn){
        return chain('before', otherFn, fn)
    }

    function after(fn, otherFn){
        return chain('after', otherFn, fn)
    }

    return {
        before: before,
        after: after,
        bindArgs: bindArgs,
        bindArgsArray: bindArgsArray
    }
}()