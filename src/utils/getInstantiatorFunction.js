module.exports = function(){

    'use strict';

    var fns = {}

    return function(len){

        if ( ! fns [len ] ) {

            var args = [],
                i    = 0

            for (; i < len; i++ ) {
                args.push( 'a[' + i + ']')
            }

            fns[len] = new Function(
                            'c',
                            'a',
                            'return new c(' + args.join(',') + ')'
                        )
        }

        return fns[len]
    }

}()