Classy - Smart JavaScript classes
=================================

Classy offers the ability to easily define classes, call super or overriden methods, define static properties, and mixin objects in a very flexible way.

Meant to be used in the browser and in node.

For the browser, use ```dist/classy.js```


```js
    var Vehicle = classy.define({
        alias: 'vehicle',

        init: function(year){
            this.year = year
        }
    })

    var Car = classy.define({
        extend: 'vehicle'
        //or extend: Vechicle
        alias: 'car',

        init: function(year, make){
            this.callSuper()
            this.make = make
        },

        getName: function(){
            return this.make
        }
    })

    var ford = new Car(1980, 'Ford')
    console.log(ford.year)
    console.log(ford.make)
```

Notice the ```callSuper()``` method call, which can be used in any class method, and will call the method with the same name found on the super class. It also automatically transmits all the arguments it has, so you don't have to manually do so.

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

## Override and callOverriden

Overriding is simple, just call classy.override
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
    green: function(msg){
        alert('Hi ' + msg)
    }
}

classy.mixin(person, logger)
person.greet('Bob') //will alert 'Hi Bob' - so logger.greet is not copied, since it already existed on person
person.log('warning') //will log 'warning' since logger.log was copied to person, since person.log was undefined
person.isLogger === true
```

### $before


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
