# DOM position serializer [![Build Status](https://travis-ci.org/jengeb/dom-position-serializer.svg)](https://travis-ci.org/jengeb/dom-position-serializer)

This module de-/serializes a position in the HTML document. This is particularly useful in the following situations:

 * you have to store and retrieve a position in the DOM tree
 * you want to ignore changes you make or made in the DOM e.g. by adding HTML elements with a special CSS class

The serialization of a position is computed starting from the `<body>` element as path in the DOM tree and as offset in the text node. The computed path is an array of zero based indexes that state the respective element in the list of child elements.

This module computes all serializations regarding the original DOM meaning without added elements with a specified class. For both locations of "World" in the following examples it computes `{path: [1, 0], offset: 6}` as start and `{path: [1, 0], offset: 11}` as end position. That is because the added element node applying the highlight class is ignored. 

# Examples

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

More examples how to use this module can be found in the tests in `serializer.Spec.js` in `./test` directory.

# Documentation

## `serializePosition (node, offset, rootNode, className)`

### Input
The function to serialize a position gets the following input parameters.
* node: the node in the DOM tree that should be serialized
* offset: the offset inside of the node
* rootNode: the root node of the HTML document e.g. `document.body`
* className (optional): the name of the CSS class

### Functionality
Element nodes applying the specified class will be subtracted from the determination of the position. For serializing a selected text range you have to call the function for the start as well as for the end position. `serializePosition` starts with the specified node and traverses the DOM tree until reaching the defined root node. The function computes the path from the specified node to the root node by subtracting all element nodes with the specified class if passed to the function. If the function encounters such a node it will look at the child nodes and include them into the determination of path and offset. 

### Output
The function returns a new object with both the path from root to specified node in the DOM tree and the offset to the stated character there.

## `deserializePosition (position, rootNode, className)`

### Input
The function gets the following input parameters.
* position: an object with path and offset of a position
* rootNode
* className (optional)

### Functionality

`deserializePosition` retrieves the position in an HTML document. The original state of the DOM tree without elements having the optionally handed over class is used. The function starts in the root node and traverses the tree to the specified position. 

### Output
The function returns a new object with the actual target node along with the offset. The deserialized position can be handed over to other functions e.g. for adding elements at this point or applying a certain CSS.
