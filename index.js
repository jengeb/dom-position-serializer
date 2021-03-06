'use strict';

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// rewrite jQuery's hasClass with pure JavaScript
// http://stackoverflow.com/a/5085587/4419582
function hasClass(elem, className) {
  var re = new RegExp('\\b' + escapeRegExp(className) + '\\b');
  return re.test(elem.className);
}

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
    if (hasClass(node, className)) {
      return 'inserted';
    }
  }

  if (getType(node.parentNode) === 'inserted') {
    node = node.parentNode;
  }

  // count offset
  var skipResult = skip(node, offset);
  node = skipResult.node;
  offset = skipResult.offset;

  // result node: path to rootnode
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

  function getNodeLength(node) {
    if (getType(node) === 'text') {
      return node.length;
    }
    if (getType(node) === 'inserted') {
      return node.innerText.length;
    }
  }

  function skip(node, offset) {
    // count offset
    while ((getType(node) === 'text' || getType(node) === 'inserted') &&
           node.nextSibling &&
           (getType(node.nextSibling) === 'text' ||
            getType(node.nextSibling) === 'inserted') &&
           (offset === undefined || offset >= getNodeLength(node))
          ) {
      if (offset !== undefined) {
        offset -= getNodeLength(node);
      }
      node = node.nextSibling;
    }
    return {node: node, offset: offset};
  }

  function getType(node) {
    if (!node) {
      throw new Error('Node is null.');
    }
    if (node.nodeType === node.TEXT_NODE) {
      return 'text';
    }
    if (hasClass(node, className)) {
      return 'inserted';
    }
  }

  var path = position.path;
  var node = rootNode;

  for (var i = 0; i < path.length; i++) {
    node = node.firstChild;
    var stepsRight = path[i];
    while (stepsRight > 0) {
      skipResult = skip(node);
      node = skipResult.node;
      node = node.nextSibling;
      stepsRight--;
    }
  }
  var skipResult = skip(node, position.offset);
  var node = skipResult.node;
  var offset = skipResult.offset;

  if (getType(node) === 'inserted') {
    node = node.firstChild;
  }

  return {node: node, offset: offset};
}