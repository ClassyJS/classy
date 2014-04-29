ZippyClass - Classes for JavaScript
============================

ZippyClass offers the ability to easily define classes, call super or overriden methods, define static properties, and mixin objects in a very flexible way.

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
