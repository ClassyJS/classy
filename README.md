Classy - Smart JavaScript classes
=================================

Classy offers the ability to easily define classes, call super or overriden methods, define static properties, and mixin objects in a very flexible way.

Meant to be used in the browser and in node. Well tested, with 50+ tests.

## Installation

```sh
$ npm install classy
```
For the browser please either use `webpack` or `browserify` to integrate classy into your app.
<!--
```
dist/classy.js
```
 -->

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## Example
```js
var Vehicle = classy.define({
    alias: 'vehicle',

    init: function(year){
        this.year = year
    }
})

var Car = classy.define({
    extend: 'vehicle' //or extend: Vehicle
    alias : 'car',
    forceInstance: true, // <- in order to force instantiation, even without 'new'

    init: function(year, make){
        this.callSuper() // <- notice how easy it can be!
        this.make = make
    },

    getName: function(){
        return this.make
    }
})

var ford = new Car(1980, 'Ford')
console.log(ford.year)
console.log(ford.make)
var bmw = Car(1990, 'Bmw') // <- since forceInstance is true, the constructor will be called with new under the hood
```

Notice the ```callSuper()``` method call, which can be used in any class method, and will call the method with the same name found on the super class. It also automatically sends all the arguments, so you don't have to manually do so.

```js
ford.getName() === 'Ford' //is true
```

```js
classy.override('car', {
    getName: function(){
        return this.callOverriden() + ', made in ' + this.year
    }
})
//now
ford.getName() === 'Ford, made in 1980' //is true
```

You can use the class ```alias``` in order to easily reference which class you want to extend or override. This also helps you get a reference to your class by
```js
    var Car = classy.getClass('car')
    var Vehicle = classy.getClass('vehicle')
```


## Aliases

When defining a class, you can specify a string property named `alias`.

`classy` keeps a reference to each class based on the specified alias. If no alias is given, one is generated anyway.

Using the alias allows you to reference, extend or override a class by the alias, without the need for an explicit reference to the class.

Example
```js
classy.define({
  alias: 'shape'
})

classy.define({
  alias: 'rectangle',
  extend: 'shape'
})

classy.override('rectangle', {
  getArea: function(){ /*... */}
})
```

Notice that when defining the rectangle class, instead of saying we extend the Shape class, by a direct reference, we can use the alias of the Shape class, which is a string.

Whenever an alias is expected, you can use either the alias, or the class itself (in classy.define, classy.override, classy.getClass, etc)

## Override and callOverriden

Overriding is simple, just call `classy.override` with the class alias or the class reference as the first param, and an object with properties to override as a second param.
```js
classy.override(Car, {
    getName: function(){
        return this.callOverriden() + ', great car'
    }
})
```
or, if you don't have a reference to the class, but only have the alias
```js
classy.override('car', {
    getName: function(){
        return this.callOverriden() + ', great car'
    }
})
```

## ```init``` as constructor

Use the ```init``` method as the constructor

Example

```js
var Animal = classy.define({

    //when a new Animal is created, the init method is called
    init: function(config){
        config = config || {}

        //we simply copy all the keys onto this
        Object.keys(config).forEach(function(key){
            this[key] = config[key]
        }, this)
    }
})

var Cat = classy.define({
    extend: Animal,
    alias: 'cat',

    init: function(){
        this.callSuper()
        this.sound = 'meow'
    },

    getName: function(){
        return this.name
    }
})

var lizzy = new Cat({ name: 'lizzy' })
```

You can even extend functions/classes not defined with `classy`

```js
function Animal(sound){
    this.sound = sound
}

Animal.prototype.makeSound = function(){
    return 'I sound like this: ' + this.sound
}

var Dog = classy.define({
    extend: Animal,
    alias: 'dog',
    init: function(){
        this.callSuperWith('bark') //this calls Animal fn
    }
})

var dog = new Dog()
dog.makeSound() == 'I sound like this: bark' // is true
```

## ```callSuper``` and ```callOverriden```

Use the ```callSuper``` and ```callOverriden``` methods to call the super and overriden methods. You don't have to worry about forwarding the arguments, since this is handled automagically for you.

If there is no super or overriden method with the same name you don't have to worry either, since callSuper and callOverriden won't break. they will simply and silently do nothing

Example
```js
    //create a shape class
    classy.define({
        alias: 'shape',

        getDescription: function(){
            return this.name
        }
    })

    //create a rectangle class with a width and a height
    classy.define({
        extend: 'shape',
        alias: 'rectangle',

        name: 'rectangle',
        init: function(size){
            this.width = size.width
            this.height = size.height
        },

        getArea: function(){
            return this.width * this.height
        },

        setHeight: function(h){ this.height = h },
        setWidth: function(w){ this.width = w }
    })

    classy.override('rectangle', {
        getDescription: function(){
            //reimplement the getDescription, but use the overriden implementation as well
            return 'this is a ' + this.callOverriden()
        }
    })

    //create a square class
    classy.define({
        extend: 'rectangle',
        alias: 'square',

        init: function(size){
            if (size * 1 == size){
                //the size is a number
                size = { width: size, height: size}
            } else {
                size.width = size.height
            }

            this.callSuper()
        },

        setHeight: function(h){
           //callSuper will automatically pass the arguments to Rectangle.setHeight, so h will be forwarded
           this.callSuper()  //or you could use this.callSuperWith(10) if you want to manually pass parameters
           this.setWidth(h)
        }
    })
```
You can also use ```callSuperWith``` and ```callOverridenWith``` to manually pass all parameters

Example
```js
//...
setHeight: function(h){
    this.callSuperWith(h*2)
}
//...
```

## Getters and setters

You can use getters and setters on ```classy``` defined classes. They even work well with ```callSuper``` and ```callOverriden```

```js
var Randomer = classy.define({
    min: 0,
    max: 10,

    //returns a random float
    get random(){
        return Math.random() * (this.max - this.min) + this.min
    }
})

Randomer.override({
    //returns a random int
    get random(){
        return Math.floor(
                    this.callOverriden() //call overriden method
                )
    }
})

var r = new Randomer()
r.random // generates a random int between 0 and 10
```

## forceInstance

You may want your classes to be usable without the `new` operator. Just specify `forceInstance: true` on the class prototype, and the constructor will be called with `new` if it hasn't been

Example

```js
var Vehicle = class.define({
    forceInstance: true,
    init: function(name){
        this.name = name
    }
})
var v = Vehicle('car')  // since 'forceInstance' is true,
                        //the Vehicle will be called as a constructor under the hood, so new Vehicle('car')
```
## Mixins

Classy offers the ability to mix objects into other objects. At a base level, you can either use simple objects as mixins or you can define mixin classes.

Example
```js
var logger = {
    $after: {
        log: function(msg){
            console.log(msg)
        }
    }
}

var person = { firstName: 'Bob', lastName: 'Johnson' }

classy.mixin(person /* target object */, logger /* mixin */)
```
in the example above, the person object receives a log function property. Note the usage of $after. Other valid mixin behaviors are ```$copyIf```, ```$before``` and ```$override```.

These behaviors determine how mixin properties that are functions are mixed-in when the target object already has those properties.

### $copyIf
Any property in the mixin is copied onto the target object only if the target object does not already have a property with the same name

Example
```js
var logger = {
    $copyIf: {
        isLogger: true,
        log: function(msg){ console.log(msg) },
        greet: function(msg){ console.log('hello ' + msg) }
    }
}
var person = {
    greet: function(msg){
        alert('Hi ' + msg)
    }
}

classy.mixin(person, logger)
person.greet('Bob') //will alert 'Hi Bob' - so logger.greet is not copied, since it already existed on person
person.log('warning') //will console.log 'warning' - logger.log was copied to person, since person.log was undefined
person.isLogger === true
```

### $before & $after
```js
classy.defineMixin({
    alias: 'logger',
    $before: {
        log: function(msg){
            console.log(msg)
        },
        warn: function(warning){
            console.warn(warning)
            return '!'
        }
    }
})

var person = {
    log: function(msg){ alert(msg); return 1}
}

classy.mixin(person, 'logger')

person.log('hi') === 1 // will first console.log('hi') and then will alert('hi')
//and will return the return value of the initial person.log implementation
person.warn('hi') === '!' //will console.warn('hi')
```
In the above example, since log and warn ar copied with a before behavior, first of all classy checks to see if person already has those properties. Since person.log exists, person.log is assigned another function, which calls ```logger.log``` before ```person.log```, and returns the result of the initial ```person.log```.
For logger.warn, no such property exists on person, so it is simply assigned to the person.

The behavior of after is similar, with the difference that the mixin function is called after the initial implementation. The result is that of the initial implementation, if one exists.

### $override
```
classy.defineMixin({
    alias: 'logger',

    $override: {
        log: function(msg){ console.log(msg) },
        warn: function(msg){
            console.log(msg)
            return this.callTarget() //call the target object warn implementation, if one exists
        }
    }
})

var Person = classy.define({
    alias: 'person',
    mixins: [
        'logger'
    ],

    name: 'bob',
    warn: function(msg){
        alert(msg)
        return this
    }
})

var p = new Person()
p.log(p.name) //simply calls logger.log
p.warn(p.name) // logs p.name and then alerts p.name
```

Notice that ```logger.warn``` calls ```this.callTarget()``` which means the mixin tries to call the method from the target object that this function has overriden. Since person.warn had an implementation, the logger calls that.

## Static properties and ```$ownClass```

You can easily define static properties for classes.

```js
var Widget = classy.define({

    statics: {

        idSeed: 0,

        getDescription: function(){
            return 'A Widget class'
        },

        getNextId: function(){
            return this.idSeed++
        }
    },

    init: function(){
        this.id = this.$ownClass.getNextId()
    }
})

Widget.getDescription() == 'A Widget class' // === true

var w = new Widget()
w.id === 0

w = new Widget()
w.id === 1
```

On every instance, you can use the $ownClass property in order to get a reference to the class that created the instance.

## Building

In order to build a browser version, run ```npm run build```.

This will use browserify to make a one-file browser build, which you can find in ```dist/classy.js```

## Testing

After cloning the repo, make sure you ```npm install```.

Then just run ```npm run test``` or ```make```.
Make sure you build before you test, since testing is done on a browser build, with karma test runner. To build, ```npm run build```


