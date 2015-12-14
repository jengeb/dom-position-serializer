describe('serializePosition()', function() {
  it('should serialize a position', function() {
      // testcode TODO
      $('body').append('<div id="root"><h1>Title</h1><div></div><div id="target"></div></div>');
      var position = serializePosition($('#target')[0], 5, $('#root')[0], 'myClass');
      expect(position.path[0]).to.equal(2);
      expect(position.offset).to.equal(5);
  });
});