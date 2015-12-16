'use strict';

function serializePosition(node, offset, rootNode, className) {

  function skip(node, offset) {
    // count offset
    while ((getType(node) === 'text' || getType(node) === 'inserted') &&
           node.previousSibling &&
           (getType(node.previousSibling) === 'text' ||
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
  var path = [];
  while (node && node != rootNode) { // walk upwards in tree
    var count = 0;

    while (node.previousSibling) { // count vanilla siblings
      node = node.previousSibling;
      count++;
      // skip nodes
      skipResult = skip(node);
      node = skipResult.node;
    }
    path.push(count);
    node = node.parentNode;
  }

  return {path: path.reverse(), offset: offset};
}


function deserializePosition(position, rootNode, className) {

  function skip(node, offset) {
    // count offset
    while ((getType(node) === 'text' || getType(node) === 'inserted') &&
           node.nextSibling &&
           (getType(node.nextSibling) === 'text' ||
            getType(node.nextSibling) === 'inserted')
           ) {
      node = node.nextSibling;
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

  var path = position.path;
  var skipResult = skip(rootNode, position.offset);
  var node = skipResult.node;
  var offset = skipResult.offset;

  for (var i = 0; i < path.length; i++) {
    node = node.firstChild;
    skipResult = skip(node);
    node = skipResult.node;
    var stepsRight = path[i];
    while (stepsRight > 0) {
      skipResult = skip(node);
      node = skipResult.node;
      node = node.nextSibling;
      stepsRight--;
    }
  }

  return {node: node};
}