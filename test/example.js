
var assert = require('chai').assert;
var jsonapi = require('..');

describe('website example', function () {
  it('should generate the complex example from the json:api homepage', function () {
    var response = jsonapi('http://example.com');

    var author = response.resource('people', 9)
      .attributes({
        'first-name': 'Dan',
        'last-name': 'Gebhardt',
        'twitter': 'dgeb'
      })
      .link('self', '/people/9');

    var comment5 = response.resource('comments', 5)
      .attributes({ body: 'First!' })
      .link('self', '/comments/5');

    var comment12 = response.resource('comments', 12)
      .attributes({ body: 'I like XML better' })
      .link('self', '/comments/12');

    var authorRel = response.relationship(author)
      .link('self', '/posts/1/relationships/author')
      .link('related', '/posts/1/author');

    var commentsRel = response.relationship([ comment5, comment12 ])
      .link('self', '/posts/1/relationships/comments')
      .link('related', '/posts/1/comments');

    var post = response.resource('posts', 1)
      .attributes({ title: 'JSON API paints my bikeshed!' })
      .relationship('author', authorRel)
      .relationship('comments', commentsRel)
      .link('self', '/posts/1');

    var json = response
      .link('self', '/posts')
      .link('next', '/posts?page[offset]=2')
      .link('last', '/posts?page[offset]=10')
      .data([ post ])
      .include([ author, comment5, comment12 ])
      .toObject();

    assert.deepEqual(json, require('./fixtures/home-page.json'));
  });
});
