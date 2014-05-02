describe('mixins should work properly', function(){

    var root = classy

    it('should mixin correctly', function(){
        var arr = []

        var WalkingCreature = root.defineMixin({
            name: 'Walking Creature',
            $before: {
                walks: function(){
                    arr.push('walking')
                    return 'walking'
                },

                talks: function(){
                    return 'talky'
                }
            },
            $override: {
                age: 10
            }
        })

        var Creature = root.define({
            alias  : 'creature',

            mixins : [WalkingCreature],
            name   : 'anonymous',
            age    : 0,

            walks: function(){
                arr.push('like a creature')

                return 'creature walk'
            }
        })

        var walkingCreature = new WalkingCreature()

        expect(walkingCreature.walks()).toBe('walking')
        expect(walkingCreature.age).toBe(10)

        arr = []

        var c = new Creature()

        expect(c.walks()).toBe('creature walk')
        expect(arr).toEqual(['walking','like a creature'])
        expect(c.talks()).toBe('talky')
        expect(c.name).toBe('anonymous')
        expect(c.age).toBe(10)

        Creature.destroy()
    })

    it('should mixin correctly when array of strings are used', function(){
        var dragCalled = false,
            dropCalled = false,
            dragDropCalled = false,
            doOnDrag = false,
            showCalled = false,
            counter = 0

        root.defineMixin({
            alias   : 'Draggable',
            $before : {

                doOnDrag: function(){doOnDrag = true},

                onDrag: function(){
                    dragCalled = true
                    expect(counter).toBe(0)
                    return (counter++)
                }
            }

        })

        root.define({
            extend : 'z.mixin',
            alias  : 'Droppable',
            $after: {
                onDrop: function(){
                    dropCalled = true
                    expect(counter).toBe(3)
                    return (counter++)
                }
            }
        })

        root.defineMixin({
            alias: 'DragDrop',
            initOn: 'show',
            $before: {
                init: function(){
                    expect(showCalled).toBe(false)
                }
            },
            $override: {
                dragDrop: function(){
                    dragDropCalled = true
                }
            }
        })

        root.define({
            alias: 'MyWindow',
            mixins: ['DragDrop', { alias: 'Draggable', doOnDrag: function(){doOnDrag = true} }, 'Droppable'],
            show: function(){
                showCalled = true
            },
            onDrag: function(){
                expect(counter).toBe(1)
                counter++
                return 'drag'
            },
            onDrop: function(){
                expect(counter).toBe(2)
                counter++
                return 'drop'
            },
            dragDrop: function(){
                expect(true).toBe(false)
            }
        });

        var w = root.create('MyWindow',{

        })

        w.dragDrop()
        w.show()

        w.doOnDrag()
        expect(showCalled).toBe(true)
        expect(doOnDrag).toBe(true)

        var dragResult = w.onDrag(),
            dropResult = w.onDrop();

        expect(dragDropCalled).toBe(true)
        expect(dragResult).toBe('drag')
        expect(dropResult).toBe('drop')
        expect(doOnDrag).toBe(true)
        expect(dragCalled).toBe(true)
        expect(dropCalled).toBe(true)
        expect(counter).toBe(4)

        root.destroyClass('DragDrop')
        root.destroyClass('Draggable')
        root.destroyClass('Droppable')
        root.destroyClass('MyWindow')
    })

    it('should mixin and be visible on prototype', function(){
        root.defineMixin({
            alias: 'DragDrop',
            $override: {
                onDragDrop: function(){

                }
            }
        })

        var W = root.define({
            mixins: ['DragDrop']
        });

        var w = new W()

        try {
            w.onDragDrop()
        } catch (ex){
            expect(true).toBe(false)
        }

        expect(W.prototype.onDragDrop).not.toBe(undefined)

        root.destroyClass('DragDrop')
    })
})
