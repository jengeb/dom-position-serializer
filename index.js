function serializePosition(node, offset, rootNode, className) {

  function skip(node, offset) {
    // count offset
    while (node.previousSibling &&
           (getType(node.previousSibling) === 'text') ||
            getType(node.previousSibling) === 'inserted')
           ) {
      node = node.previousSibling;
      if (offset !== undefined) {
        if (getType(node) === 'text') {
          offset += node.length;
        }
        else if (getType(node) === 'inserted') {
          offset += node.innerText.length;
        }
      }
    }
    return {node: node, offset: offset};
  }

  function getType(node) {
    if (node.nodeType === node.TEXT_NODE) {
      return 'text';
    }
    if ($(node).hasClass(className)) {
      return 'inserted';
    }
  }

  // count offset
  var skipResult = skip(node, offset);
  node = skipResult.node;
  offset = skipResult.offset;

  // result node: TODO path to rootnode
  while (node && node != rootNode) { // walk upwards in tree
    var count = 0;
    while (node.previousSibling) { // count vanilla siblings
      node = node.previousSibling;
      count++;
      // skip nodes
      skipResult = skip(node);
      node = skipResult.node;
    }
    node = node.parent;
  }

  console.log(node, offset);
}