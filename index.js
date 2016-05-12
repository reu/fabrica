const { clone, identity, is, merge, mergeAll, toPairs } = require("ramda");
const isFunction = is(Function);
const isString = is(String);

const traitName = (parent, trait) => `${parent}/${trait}`;

const define = definitions => (name, parent) => {
  const definition = {
    attributes: parent ? clone(parent.attributes) : {},
    builder: parent ? parent.builder : identity,
    creator: parent ? parent.creator : identity,
  };

  definitions[name] = definition;

  return {
    attr: function(name, value) {
      definition.attributes[name] = value;
      return this;
    },

    build: function(fn) {
      definition.builder = fn;
      return this;
    },

    create: function(fn) {
      definition.creator = fn;
      return this
    },

    trait: function(trait, fn) {
      fn(define(definitions)(traitName(name, trait), definition));
      return this;
    },
  };
};

const resolve = definitions => (name, trait, customAttributes = {}) => {
  if (isString(trait)) {
    name = traitName(name, trait);
  } else {
    customAttributes = trait || {};
  }

  const definition = definitions[name];
  if (!definition) throw new Error(`Fabrica: Invalid definition ${name}`);

  const attributes =
    toPairs(merge(definition.attributes, customAttributes))
      .map(([key, value]) => [key, isFunction(value) ? value.apply() : value])
      .map(([key, value]) => [key, Promise.resolve(value)])
      .map(([key, value]) => value.then(result => ({ [key]: result })));

  return Promise
    .all(attributes)
    .then(mergeAll)
    .then(attributes => merge(definition, { attributes }));
};

const attrs = definition => definition.attributes;
const build = definition => definition.builder(definition.attributes);
const create = definition => definition.creator(definition.attributes);

module.exports = function fabrica(definitions = {}) {
  const resolver = resolve(definitions);

  const materialize = materializer => (...args) =>
    resolver(...args).then(materializer);

  return {
    define: name => define(definitions)(name),
    attrs: materialize(attrs),
    build: materialize(build),
    create: materialize(create),
  };
};
