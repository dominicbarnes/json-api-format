# json-api-format

> A **WIP** library for generating [json:api](http://jsonapi.org/) responses.
> This API is pretty complex, so I expect to make big changes after actually
> using it in a project.

## Install

```sh
npm install json-api-format
```

## API

### jsonapi([base])

Creates a new object representing the `response` the server will be sending.
(in other words, the "top-level object")

The `base` parameter is optionally used as the "base URL" if you'd like to
generate links a little more easily.

### Response

The `response` referenced in code samples is the object returned by a call
to `jsonapi()`.

#### response.resource(type, id)

Used to create a new resource object that can be used with various other
methods to construct the response. Both `type` and `id` are required, just
like in all resource objects.

#### response.relationship(resource)

Creates a relationship based on the input `resource` object. Pass this to
`resource.relationship(type, rel)` as `rel` to complete the connection.

#### response.link(rel, href, [meta])

Used to add an entry to `links` on the top-level object. The `rel` corresponds
to the type of link, such as "self". The `href` is the URL for the link. (if a
`base` was configured it can be relative) The optional `meta` object can be
extra information for the link itself.

#### response.error(err)

Adds an error to the top-level object. The simplest case is to use an `Error`
object, but you'll likely want to use a custom object with all the other
properties you'll need.

#### response.meta(data)

Adds data to the `meta` field of the top-level object. Multiple calls will
result in deep-merges, while using a falsy value will empty the data.

#### response.jsonapi(data)

Adds data to the `jsonapi` field of the top-level object, and it behaves just
like `response.meta(data)`.


### Relationship

A `relationship` is the object returned by `response.relationship(resource)`.
This object needs to be passed back to `response.relationship()` to be
included as part of the server response.

#### relationship.data(resource)

If not passed to the constructor, you can optionally use this method here.
It accepts either a single resource object or an array of resource objects.

#### relationship.link(rel, href, meta)

Adds a link for the given `rel` to the `links` for this relationship.
(works just like `response.link()`)

#### relationship.meta(data)

Merges `data` into the `meta` for this relationship.
(works just like `response.meta()`)


### Resource

A `resource` is the object returned by `response.resource(type, id)`. This
object needs to be passed back to `response.data()` to be included as part
of the server response.

#### resource.attributes(data)

Merges `data` into the `attributes` for this resource.
(works just like `response.attributes()`)

#### resource.link(rel, href, meta)

Adds a link for the given `rel` to the `links` for this resource.
(works just like `response.link()`)

#### resource.meta(data)

Merges `data` into the `meta` for this resource.
(works just like `response.meta()`)

#### resource.relationship(type, rel)

Adds to the `relationships` object under the `type` property the given `rel`
relationship object.
