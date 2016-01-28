# DOM position serializer [![Build Status](https://travis-ci.org/jengeb/dom-position-serializer.svg)](https://travis-ci.org/jengeb/dom-position-serializer)

This module de-/serializes a position in the HTML document. This is particularly useful in the following situations:

 * you want to store and retrieve a position in the DOM tree
 * you want to ignore changes you make or made in the DOM, e.g., by adding HTML elements with a special CSS class

A position consists of an element and a character offset in this element. The serialization of a position is a path in the DOM tree (with respect to a root node) and the offset. The computed path is an array of zero-based indexes that determine the respective element in the list of child elements.

If you intend to add elements to the DOM (e.g., for highlighting text), this module is able to compute serializations with respect to the original DOM, see below.

# Examples

For both locations of "World" in the following examples this module computes `{path: [1, 0], offset: 6}` as start and `{path: [1, 0], offset: 11}` as end position. That is because the added element node applying the `highlight` class is ignored. 

## Original DOM

```HTML
<body>
  <div></div>
  <h1>
    Hello World
  </h1>
</body>
``` 

## Manipulated DOM
```HTML
<body>
  <div></div>
  <h1>
    <span class="highlight">
      Hello
    </span>
    World
  </h1>
</body>
```

More examples for this module can be found in the tests, see `/test/serializer.Spec.js`.

# Documentation

## `serializePosition (node, offset, rootNode, className)`

### Input
The function to serialize a position accepts the following input parameters:
* `node` (element): the node in the DOM tree that should be serialized
* `offset` (integer): the character offset inside the node
* `rootNode` (element): the root node of the HTML document, e.g., `document.body`
* `className` (string, optional): the name of the CSS class

### Functionality
Element nodes with the specified class will be subtracted from the determination of the position. For serializing a selected text range you have to call the function for the start as well as for the end position. `serializePosition` starts with the specified `node` and traverses the DOM tree until reaching the defined `rootNode`. The function computes the path from the specified `rootNode` to the `node` by subtracting all element nodes with the specified class if passed to the function. If the function encounters a node with `className` it will look at the child nodes and include them into the determination of `path` and `offset`. 

### Output
The function returns an object with the following properties with respect to the *unmodified* DOM tree:
* `path` (array of integers): the path from `rootNode` to `node`
* `offset` (integer): the character offset in `node` 

## `deserializePosition (position, rootNode, className)`

### Input
The function accepts the following input parameters:
* `position` (object with properties `path` and `offset`): the position that should be deserialized, e.g., output of `serializePosition`
* `rootNode`: see `serializePosition`
* `className` (optional): see `serializePosition`

### Functionality

`deserializePosition` is the inverse operation of `serializePosition`, i.e., it retrieves the element and offset. The original state of the DOM tree is used internally by ignoring elements with `className`. The function starts in `rootNode` and traverses the tree to the specified position. 

### Output
The function returns an object with the following properties:
* `node`: the actual target node
* `offset`: the offset in `node`

The deserialized position can be passed to other functions, e.g., for adding elements at this position or applying a certain CSS class.
