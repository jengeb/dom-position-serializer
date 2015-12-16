beforeEach(function() {
  $('#testContainer').remove();
  $('body').append('<div id="testContainer"></div>');
});

describe('serializePosition()', function() {
  it('should serialize a position', function() {
    $('#testContainer').append('<div id="root"><h1>Title</h1><div></div><div id="target"></div></div>');
    var position = serializePosition($('#target')[0], 5, $('#root')[0], 'myClass');
    console.log(position);
    expect(position.path).to.deep.equal([2]);
    expect(position.offset).to.equal(5);
  });
});

describe('deserializePosition()', function() {
  it('should deserialize a position', function() {
    $('#testContainer').append('<div id="root"><h1>Title</h1><h2>myTest</h2><div><h1 id="target">Test</h1></div></div>');
    var element = {path: [2, 0, 0], offset: 0};
    var result = deserializePosition(element, $('#root')[0], 'myClass');
    expect(result.node).to.equal($('#target')[0].firstChild);
    expect(result.node.textContent).to.equal('Test');
  })
});