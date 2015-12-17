beforeEach(function() {
  $('#testContainer').remove();
  $('body').append('<div id="testContainer"></div>');
});

// serializePosition()
describe('serializePosition()', function() {
  it('should serialize a position', function() {
    $('#testContainer').append('<div id="root"><h1>Title</h1><div></div><div id="target"><p></p><div><p id="test">Test<em>123</em></p></div></div></div>');
    var position = serializePosition($('#target')[0], 5, $('#root')[0], 'myClass');
    expect(position.path).to.deep.equal([2]);
    expect(position.offset).to.equal(5);
  });
});

// deserializePosition()
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

describe('serializePosition()', function() {
  it('should serialize a position and skip myClass elements in a html tree', function() {
    $('#testContainer').append('<div id="root"><h1>Title</h1><h2>myTest</h2><ul><li>Lorem ipsum1</li><li>Lorem<em id="list"><span class="myClass">ipsum</span></em>lorem ipsum1B</li><li>Lorem ipsum2</li></ul><div><h1 id="target"><span class="myClass">My</span>Test</h1></div></div>');
    var position = serializePosition($('#list')[0].firstChild.firstChild, 0, $('#root')[0], 'myClass');
    expect(position.path).to.deep.equal([2, 1, 1, 0]);
    expect(position.offset).to.equal(0);
  })
});

describe('deserializePosition()', function() {
  it('should deserialize a position and skip myClass elements in a html tree', function() {
    $('#testContainer').append('<div id="root"><h1>Title</h1><h2>myTest</h2><ul><li>Lorem ipsum1</li><li>Lorem<em id="list"><span class="myClass">ipsum</span></em>lorem ipsum1B</li><li>Lorem ipsum2</li></ul><div><h1 id="target"><span class="myClass">My</span>Test</h1></div></div>');
    var element = {path: [2, 1, 1, 0], offset: 0};
    var result = deserializePosition(element, $('#root')[0], 'myClass');
    expect(result.node).to.equal($('#list')[0].firstChild.firstChild);
    expect(result.node.textContent).to.equal('ipsum');
  })
});

describe('deserializePosition()', function() {
  it('should deserialize a position: case 1: class spans whole textnode', function() {
    $('#testContainer').append('<div id="root"><div></div><div><h1 id="target"><span class="myClass">My example</span></h1></div></div>');
    var element = {path: [1, 0, 0], offset: 0};
    var result = deserializePosition(element, $('#root')[0], 'myClass');
    expect(result.node).to.equal($('#target')[0].firstChild.firstChild);
    expect(result.node.textContent).to.equal('My example');
  })
});

describe('deserializePosition()', function() {
  it('should deserialize a position: case 2: span as firstChild', function() {
    $('#testContainer').append('<div id="root"><div></div><div><h1 id="target"><span class="myClass">My</span> example</h1></div></div>');
    var element = {path: [1, 0, 0], offset: 0};
    var result = deserializePosition(element, $('#root')[0], 'myClass');
    expect(result.node).to.equal($('#target')[0].firstChild.firstChild);
    expect(result.node.textContent).to.equal('My');

    var element = {path: [1, 0, 0], offset: 4};
    var result = deserializePosition(element, $('#root')[0], 'myClass');
    expect(result.node).to.equal($('#target')[0].firstChild.nextSibling);
    expect(result.node.textContent).to.equal(' example');

  })
});

describe('deserializePosition()', function() {
  it('should deserialize a position: case 3: span as lastChild', function() {
    $('#testContainer').append('<div id="root"><div></div><div><h1 id="target">My <span class="myClass">example</span></h1></div></div>');
    var element = {path: [1, 0, 0], offset: 4};
    var result = deserializePosition(element, $('#root')[0], 'myClass');
    expect(result.node).to.equal($('#target')[0].firstChild.nextSibling.firstChild);
    expect(result.node.textContent).to.equal('example');
  })
});

describe('deserializePosition()', function() {
  it('should deserialize a position: case 4: span in the middle', function() {
    $('#testContainer').append('<div id="root"><div></div><div><h1 id="target">My <span class="myClass">exa</span>mple</h1></div></div>');
    var element = {path: [1, 0, 0], offset: 4};
    var result = deserializePosition(element, $('#root')[0], 'myClass');
    expect(result.node).to.equal($('#target')[0].firstChild.nextSibling.firstChild);
    expect(result.node.textContent).to.equal('exa');
  })
});


describe('serializePosition() and deserializePosition()', function() {
  it('should serialize and deserialize a position: without myClass-elements', function() {
    $('#testContainer').append('<div id="root"><h1>Title</h1><div></div><div id="target"><p></p><div><p id="test">Test<em>123</em></p></div></div></div>');
    var newPosition = serializePosition($('#test')[0].firstChild.nextSibling.firstChild, 0, $('#root')[0], 'myClass');
    expect(newPosition.path).to.deep.equal([2, 1, 0, 1, 0]);
    expect(newPosition.offset).to.equal(0);

    var result = deserializePosition(newPosition, $('#root')[0], 'myClass');
    expect(result.node).to.equal($('#test')[0].firstChild.nextSibling.firstChild);
    expect(result.node.textContent).to.equal('123');
  });
});

describe('serializePosition() and deserializePosition()', function() {
  it('should deserialize a position: case 2: span as firstChild', function() {
    $('#testContainer').append(
      '<div id="root">' +
        '<div></div>' +
        '<div>' +
          '<h1 id="target">' +
            '<span class="myClass">' +
              'My' +
            '</span>' +
            ' example' +
          '</h1>' +
        '</div>' +
      '</div>'
    );

    var position = serializePosition($('#target')[0].firstChild.firstChild, 0, $('#root')[0], 'myClass');
    expect(position.path).to.deep.equal([1, 0, 0]);
    expect(position.offset).to.equal(0);

    var result = deserializePosition(position, $('#root')[0], 'myClass');
    expect(result.node).to.equal($('#target')[0].firstChild.firstChild);
    expect(result.node.textContent).to.equal('My');

    var newPosition = serializePosition($('#target')[0].firstChild.nextSibling, 0, $('#root')[0], 'myClass');
    expect(newPosition.path).to.deep.equal([1, 0, 0]);
    expect(newPosition.offset).to.equal(2);

    var result = deserializePosition(newPosition, $('#root')[0], 'myClass');
    expect(result.node).to.equal($('#target')[0].firstChild.nextSibling);
    expect(result.node.textContent).to.equal(' example');
  })
});

describe('serializePosition() and deserializePosition()', function() {
  it('should serialize and deserialize a position: run over other myClass-elements', function() {
    $('#testContainer').append(
      '<div id="root">' +
        '<div>' +
          '<span class="myClass">' +
            'Test'+
          '</span>' +
        '</div>' +
        '<h1 id="target">' +
          '<span class="myClass">' +
            'My ' +
          '</span>' +
          '<span class="myClass">' +
            'Example' +
          '</span>' +
        '</h1>' +
      '</div>'
    );
    var newPosition = serializePosition($('#target')[0].firstChild.nextSibling.firstChild, 0, $('#root')[0], 'myClass');
    expect(newPosition.path).to.deep.equal([1, 0]);
    expect(newPosition.offset).to.equal(3);

    var result = deserializePosition(newPosition, $('#root')[0], 'myClass');
    expect(result.node).to.equal($('#target')[0].firstChild.nextSibling.firstChild);
    expect(result.node.textContent).to.equal('Example');
  })
});


describe('serializePosition() and deserializePosition()', function() {
  it('should serialize and deserialize a position: run over other myClass-elements 2', function() {
    $('#testContainer').append(
      '<div id="root">' +
        '<h1></h1>' +
        'Text' +
        '<span class="myClass"></span>' +
        'Text' +
        '<div>' +
          '<h1 id="target">' +
            'My ' +
            '<em>' +
              '<span class="myClass">' +
                'example ' +
              '</span>' +
              '123' +
            '</em>' +
          '</h1>' +
        '</div>' +
      '</div>'
    );
    var newPosition = serializePosition($('#target')[0].firstChild.nextSibling.firstChild.nextSibling, 0, $('#root')[0], 'myClass');
    expect(newPosition.path).to.deep.equal([2, 0, 1, 0]);
    expect(newPosition.offset).to.equal(8);

    var result = deserializePosition(newPosition, $('#root')[0], 'myClass');
    expect(result.node).to.equal($('#target')[0].firstChild.nextSibling.firstChild.nextSibling);
    expect(result.node.textContent).to.equal('123');
  });
});
