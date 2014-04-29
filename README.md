ZippyClass - Classes for JavaScript
============================

ZippyClass offers the ability to easily define classes, call super or overriden methods, define static properties, and mixin objects in a very flexible way.

Meant to be used in the browser and in node.js as well.


```js
    var Vehicle = ZippyClass.define({
      alias: 'vehicle',
      
      init: function(year){
         this.year = year
      }
    })
    
    var Car = ZippyClass.define({
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
  ZippyClass.override('car', {
     getName: function(){
        return this.callOverriden() + ', made in ' + this.year
     }
  })
  //now
  ford.getName() === 'Ford, made in 1980' //is true
```

You can use the class ```alias``` in order to easily reference which class you want to extend or override. This also helps you get a reference to your class by
```js
  var Car = ZippyClass.getClass('car')
  var Vehicle = ZippyClass.getClass('vehicle')
```

## ```init``` as constructor

Use the ```init``` method as the constructor

Example

```js
    var Animal = ZippyClass.define({
    
       //when a new Animal is created, the init method is called
       init: function(config){
           config = config || {}
           
           //we simply copy all the keys onto this
           Object.keys(config).forEach(function(key){
              this[key] = config[key]
           }, this)
       }
    })
    
    var Cat = ZippyClass.define({
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
    ZippyClass.define({
        alias: 'shape',
        
        getDescription: function(){
           return this.name
        }
    })
    
    //create a rectangle class with a width and a height
    ZippyClass.define({
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
    
    ZippyClass.override('rectangle', {
        getDescription: function(){
           //reimplement the getDescription, but use the overriden implementation as well
           return 'this is a ' + this.callOverriden()
        }
    })
    
    //create a square class
    ZippyClass.define({
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

## Static properties and ```$ownClass```

You can easily define static properties for classes.

```js

   var Widget = ZippyClass.define({
   
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
