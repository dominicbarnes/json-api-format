
var assert = require('chai').assert;
var jsonapi = require('..');

describe('jsonapi(base)', function () {
  describe('.data(resource)', function () {
    it('should not include data if unused', function () {
      var json = jsonapi().toObject();

      assert.notProperty('data');
    });

    it('should add a primary data object', function () {
      var response = jsonapi();
      var resource = response.resource('article', 1);
      var json = response
        .data(resource)
        .toObject();

      assert.deepEqual(json.data, {
        type: 'article',
        id: '1'
      });
    });

    it('should allow setting an array of resource objects', function () {
      var response = jsonapi();
      var resources = [
        response.resource('article', 1),
        response.resource('article', 2)
      ];
      var json = response
        .data(resources)
        .toObject();

      assert.deepEqual(json.data, [
        {
          type: 'article',
          id: '1'
        },
        {
          type: 'article',
          id: '2'
        }
      ]);
    });

    it('should throw for non-Resource objects', function () {
      assert.throws(function () {
        jsonapi().data({});
      }, TypeError);

      assert.throws(function () {
        jsonapi().data([ {}, {} ]);
      }, TypeError);
    });
  });

  describe('.error(err)', function () {
    it('should not include the errors array if never called', function () {
      var json = jsonapi().toObject();

      assert.notProperty(json, 'errors');
    });

    it('should add an error array to the response', function () {
      var json = jsonapi()
        .error(new Error('fail'))
        .toObject();

      assert.isArray(json.errors);
      assert.equal(json.errors.length, 1);
    });

    it('should add multiple errors object to the array', function () {
      var json = jsonapi()
        .error(new Error('a'))
        .error(new Error('b'))
        .toObject();

      assert.equal(json.errors.length, 2);
    });

    it('should extract a title and detail from Error objects', function () {
      var json = jsonapi()
        .error(new Error('fail'))
        .toObject();

      assert.deepEqual(json.errors[0], { title: 'Error', detail: 'fail' });
    });

    it('should clone custom errors', function () {
      var err = { id: 1, title: 'not found' };
      var json = jsonapi()
        .error(err)
        .toObject();

      assert.notStrictEqual(json.errors[0], err);
      assert.deepEqual(json.errors[0], err);
    });

    it('should throw if adding an error w/ data');
  });

  describe('.meta(data)', function () {
    it('should not include meta at all if unset', function () {
      var json = jsonapi().toObject();

      assert.notProperty(json, 'meta');
    });

    it('should add the meta object to the response', function () {
      var json = jsonapi()
        .meta({ copyright: 2015 })
        .toObject();

      assert.deepEqual(json.meta, { copyright: 2015 });
    });

    it('should merge when called multiple times', function () {
      var json = jsonapi()
        .meta({ copyright: 2015 })
        .meta({ authors: [ 'Dominic Barnes' ] })
        .toObject();

      assert.deepEqual(json.meta, {
        copyright: 2015,
        authors: [ 'Dominic Barnes' ]
      });
    });

    it('should unset the meta if called with falsy value', function () {
      var json = jsonapi()
        .meta({ copyright: 2015 })
        .meta(false)
        .toObject();

      assert.notProperty(json, 'meta');
    });
  });

  describe('.jsonapi(data)', function () {
    it('should not include jsonapi at all if unset', function () {
      var json = jsonapi().toObject();

      assert.notProperty(json, 'jsonapi');
    });

    it('should add a jsonapi object to the response', function () {
      var json = jsonapi()
        .jsonapi({ version: '1.0' })
        .toObject();

      assert.deepEqual(json.jsonapi, { version: '1.0' });
    });

    it('should merge when called multiple times', function () {
      var json = jsonapi()
        .jsonapi({ version: '1.0' })
        .jsonapi({ authors: [ 'Dominic Barnes' ] })
        .toObject();

      assert.deepEqual(json.jsonapi, {
        version: '1.0',
        authors: [ 'Dominic Barnes' ]
      });
    });

    it('should unset the jsonapi if called with falsy value', function () {
      var json = jsonapi()
        .jsonapi({ version: '1.0' })
        .jsonapi(false)
        .toObject();

      assert.notProperty(json, 'jsonapi');
    });
  });

  describe('.link(rel, href, [meta])', function () {
    it('should not include links at all if unused', function () {
      var json = jsonapi().toObject();

      assert.notProperty(json, 'links');
    });

    it('should add a links object to the response', function () {
      var json = jsonapi()
        .link('self', '/')
        .toObject();

      assert.property(json, 'links');
    });

    it('should use a simple string when only setting an href', function () {
      var json = jsonapi()
        .link('self', 'http://api.example.com/')
        .toObject();

      assert.deepEqual(json.links, { self: 'http://api.example.com/' });
    });

    it('should use an object when adding meta', function () {
      var json = jsonapi()
        .link('self', 'http://api.example.com/', { count: 10 })
        .toObject();

      assert.deepEqual(json.links, {
        self: {
          href: 'http://api.example.com/',
          meta: { count: 10 }
        }
      });
    });

    it('should allow setting a base url', function () {
      var json = jsonapi('http://api.example.com/')
        .link('self', '/')
        .toObject();

      assert.deepEqual(json.links, { self: 'http://api.example.com/' });
    });

    it('should work without a trailing slash on the base url', function () {
      var json = jsonapi('http://api.example.com')
        .link('self', '/')
        .toObject();

      assert.deepEqual(json.links, { self: 'http://api.example.com/' });
    });

    it('should set multiple links', function () {
      var json = jsonapi()
        .link('self', '/')
        .link('related', '/related')
        .toObject();

      assert.deepEqual(json.links, {
        self: '/',
        related: '/related'
      });
    });

    it('should overwrite when using the same rel', function () {
      var json = jsonapi()
        .link('self', '/')
        .link('self', '/abc')
        .toObject();

      assert.deepEqual(json.links, { self: '/abc' });
    });
  });

  describe.skip('.include(resource)', function () {
    it('should not have included at all if unused', function () {
      var json = jsonapi().toObject();

      assert.notProperty(json, 'included');
    });

    it('should create an array of resource objects', function () {
      var response = jsonapi();
      var resource = response.resource('author', 1);
      var json = response
        .include(resource)
        .toObject();

      assert.isArray(json.included);
      assert.equal(json.included.length, 1);
    });

    it('should throw for non-Resource objects', function () {
      assert.throws(function () {
        jsonapi().include({});
      }, TypeError);

      assert.throws(function () {
        jsonapi().include([ {}, {} ]);
      }, TypeError);
    });
  });

  describe('.resource(type, id)', function () {
    it('should require the type', function () {
      assert.throws(function () {
        jsonapi().resource();
      }, RangeError, /type/i);
    });

    it('should require the id', function () {
      assert.throws(function () {
        jsonapi().resource('article');
      }, RangeError, /id/i);
    });

    it('should render the type and id', function () {
      var json = jsonapi()
        .resource('article', '1')
        .toObject();

      assert.deepEqual(json, {
        type: 'article',
        id: '1'
      });
    });

    it('should cast the type and id as strings', function () {
      var json = jsonapi()
        .resource('article', 1)
        .toObject();

      assert.deepEqual(json, {
        type: 'article',
        id: '1'
      });
    });

    describe('.attributes(data)', function () {
      it('should not include attributes at all if unset', function () {
        var json = jsonapi()
          .resource('article', 1)
          .toObject();

        assert.notProperty(json, 'attributes');
      });

      it('should add the attributes object to the response', function () {
        var json = jsonapi()
          .resource('article', 1)
          .attributes({ title: 'JSON:API' })
          .toObject();

        assert.deepEqual(json.attributes, { title: 'JSON:API' });
      });

      it('should merge when called multiple times', function () {
        var json = jsonapi()
          .resource('article', 1)
          .attributes({ title: 'JSON:API' })
          .attributes({ authors: [ 'Dominic Barnes' ] })
          .toObject();

        assert.deepEqual(json.attributes, {
          title: 'JSON:API',
          authors: [ 'Dominic Barnes' ]
        });
      });

      it('should unset the attributes if called with falsy value', function () {
        var json = jsonapi()
          .resource('article', 1)
          .attributes({ title: 'JSON:API' })
          .attributes(false)
          .toObject();

        assert.notProperty(json, 'attributes');
      });
    });

    describe('.link(rel, href, [meta])', function () {
      it('should not include links at all if unused', function () {
        var json = jsonapi()
          .resource('article', 1)
          .toObject();

        assert.notProperty(json, 'links');
      });

      it('should add a links object to the response', function () {
        var json = jsonapi()
          .resource('article', 1)
          .link('self', '/')
          .toObject();

        assert.property(json, 'links');
      });

      it('should use a simple string when only setting an href', function () {
        var json = jsonapi()
          .resource('article', 1)
          .link('self', 'http://api.example.com/')
          .toObject();

        assert.deepEqual(json.links, { self: 'http://api.example.com/' });
      });

      it('should use an object when adding meta', function () {
        var json = jsonapi()
          .resource('article', 1)
          .link('self', 'http://api.example.com/', { count: 10 })
          .toObject();

        assert.deepEqual(json.links, {
          self: {
            href: 'http://api.example.com/',
            meta: { count: 10 }
          }
        });
      });

      it('should allow setting a base url', function () {
        var json = jsonapi('http://api.example.com/')
          .resource('article', 1)
          .link('self', '/')
          .toObject();

        assert.deepEqual(json.links, { self: 'http://api.example.com/' });
      });

      it('should work without a trailing slash on the base url', function () {
        var json = jsonapi('http://api.example.com')
          .resource('article', 1)
          .link('self', '/')
          .toObject();

        assert.deepEqual(json.links, { self: 'http://api.example.com/' });
      });

      it('should set multiple links', function () {
        var json = jsonapi()
          .resource('article', 1)
          .link('self', '/')
          .link('related', '/related')
          .toObject();

        assert.deepEqual(json.links, {
          self: '/',
          related: '/related'
        });
      });

      it('should overwrite when using the same rel', function () {
        var json = jsonapi()
          .resource('article', 1)
          .link('self', '/')
          .link('self', '/abc')
          .toObject();

        assert.deepEqual(json.links, { self: '/abc' });
      });
    });

    describe('.meta(data)', function () {
      it('should not include meta at all if unset', function () {
        var json = jsonapi()
          .resource('article', 1)
          .toObject();

        assert.notProperty(json, 'meta');
      });

      it('should add the meta object to the response', function () {
        var json = jsonapi()
          .resource('article', 1)
          .meta({ copyright: 2015 })
          .toObject();

        assert.deepEqual(json.meta, { copyright: 2015 });
      });

      it('should merge when called multiple times', function () {
        var json = jsonapi()
          .resource('article', 1)
          .meta({ copyright: 2015 })
          .meta({ authors: [ 'Dominic Barnes' ] })
          .toObject();

        assert.deepEqual(json.meta, {
          copyright: 2015,
          authors: [ 'Dominic Barnes' ]
        });
      });

      it('should unset the meta if called with falsy value', function () {
        var json = jsonapi()
          .resource('article', 1)
          .meta({ copyright: 2015 })
          .meta(false)
          .toObject();

        assert.notProperty(json, 'meta');
      });
    });
  });

  describe('.relationship()', function () {
    describe('.data(type, id)', function () {
      it('should not include data if unused', function () {
        var json = jsonapi()
          .relationship()
          .toObject();

        assert.notProperty(json, 'data');
      });

      it('should add a data object with a resource linkage object', function () {
        var json = jsonapi()
          .relationship()
          .data('article', '1')
          .toObject();

        assert.deepEqual(json, {
          data: {
            type: 'article',
            id: '1'
          }
        });
      });

      it('should cast the type and id to strings', function () {
        var json = jsonapi()
          .relationship()
          .data('article', 1)
          .toObject();

        assert.deepEqual(json, {
          data: {
            type: 'article',
            id: '1'
          }
        });
      });
    });

    describe('.link(rel, href, [meta])', function () {
      it('should not include links at all if unused', function () {
        var json = jsonapi()
          .relationship()
          .toObject();

        assert.notProperty(json, 'links');
      });

      it('should add a links object to the response', function () {
        var json = jsonapi()
          .relationship()
          .link('self', '/')
          .toObject();

        assert.property(json, 'links');
      });

      it('should use a simple string when only setting an href', function () {
        var json = jsonapi()
          .relationship()
          .link('self', 'http://api.example.com/')
          .toObject();

        assert.deepEqual(json.links, { self: 'http://api.example.com/' });
      });

      it('should use an object when adding meta', function () {
        var json = jsonapi()
          .relationship()
          .link('self', 'http://api.example.com/', { count: 10 })
          .toObject();

        assert.deepEqual(json.links, {
          self: {
            href: 'http://api.example.com/',
            meta: { count: 10 }
          }
        });
      });

      it('should allow setting a base url', function () {
        var json = jsonapi('http://api.example.com/')
          .relationship()
          .link('self', '/')
          .toObject();

        assert.deepEqual(json.links, { self: 'http://api.example.com/' });
      });

      it('should work without a trailing slash on the base url', function () {
        var json = jsonapi('http://api.example.com')
          .relationship()
          .link('self', '/')
          .toObject();

        assert.deepEqual(json.links, { self: 'http://api.example.com/' });
      });

      it('should set multiple links', function () {
        var json = jsonapi()
          .relationship()
          .link('self', '/')
          .link('related', '/related')
          .toObject();

        assert.deepEqual(json.links, {
          self: '/',
          related: '/related'
        });
      });

      it('should overwrite when using the same rel', function () {
        var json = jsonapi()
          .relationship()
          .link('self', '/')
          .link('self', '/abc')
          .toObject();

        assert.deepEqual(json.links, { self: '/abc' });
      });
    });

    describe('.meta(data)', function () {
      it('should not include meta at all if unset', function () {
        var json = jsonapi()
          .relationship()
          .toObject();

        assert.notProperty(json, 'meta');
      });

      it('should add the meta object to the response', function () {
        var json = jsonapi()
          .relationship()
          .meta({ copyright: 2015 })
          .toObject();

        assert.deepEqual(json.meta, { copyright: 2015 });
      });

      it('should merge when called multiple times', function () {
        var json = jsonapi()
          .relationship()
          .meta({ copyright: 2015 })
          .meta({ authors: [ 'Dominic Barnes' ] })
          .toObject();

        assert.deepEqual(json.meta, {
          copyright: 2015,
          authors: [ 'Dominic Barnes' ]
        });
      });

      it('should unset the meta if called with falsy value', function () {
        var json = jsonapi()
          .relationship()
          .meta({ copyright: 2015 })
          .meta(false)
          .toObject();

        assert.notProperty(json, 'meta');
      });
    });
  });
});
