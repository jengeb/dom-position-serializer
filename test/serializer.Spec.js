beforeEach(function() {
  $('#testContainer').remove();
  $('body').append('<div id="testContainer"></div>');
});

describe('serializePosition()', function() {
  it('should serialize a position', function() {
    $('#testContainer').append('<div id="root"><h1>Title</h1><div></div><div id="target"><p></p><div><p id="test">Test<em>123</em></p></div></div></div>');
    var position = serializePosition($('#target')[0], 5, $('#root')[0], 'myClass');
    expect(position.path).to.deep.equal([2]);
    expect(position.offset).to.equal(5);

    // expect 123
    var newPosition = serializePosition($('#test')[0].firstChild.nextSibling.firstChild, 3, $('#root')[0], 'myClass');
    expect(newPosition.path).to.deep.equal([2, 1, 0, 1, 0]);
    expect(newPosition.offset).to.equal(3);
  });
});

describe('deserializePosition()', function() {
  it('should deserialize a position', function() {
    $('#testContainer').append('<div id="root"><h1>Title</h1><h2>myTest</h2><div><h1 id="target">My Test</h1></div></div>');
    var element = {path: [2, 0, 0], offset: 0};
    var result = deserializePosition(element, $('#root')[0], 'myClass');
    expect(result.node).to.equal($('#target')[0].firstChild);
    expect(result.node.textContent).to.equal('My Test');
  })
});

describe('deserializePosition()', function() {
  it('should deserialize a position and skip myClass elements', function() {
    $('#testContainer').append('<div id="root"><h1>Title</h1><h2>myTest</h2><div><h1 id="target"><span class="myClass">My</span>Test</h1></div></div>');
    var element = {path: [2, 0, 0], offset: 0};
    var result = deserializePosition(element, $('#root')[0], 'myClass');
    expect(result.node).to.equal($('#target')[0].firstChild.firstChild);
    expect(result.node.textContent).to.equal('My');
  })
});
