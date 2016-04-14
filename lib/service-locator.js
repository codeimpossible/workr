var registry = {};
var injections = {};

function ensureSingleService(name) {
  if (registry[name]) {
    throw new Error('Service \"' + name + '\" is already registered.');
  }
}

function ensureServiceExists(name) {
  if (!registry[name] && !injections[name]) {
    throw new Error('Service \"' + name + '\" is not in the registry.');
  }
}

function Locator() {
  this.services = {};
}

Locator.prototype.register = function(name, resolver) {
  ensureSingleService(name);
  registry[name] = resolver;
  return this;
};

Locator.prototype.resolve = function(name, opts) {
  if ((opts && !opts.optional) || !opts) {
    ensureServiceExists(name);
  }

  if (injections[name]) {
    if (typeof(injections[name]) === 'function') {
      injections[name] = injections[name]();
    }
    return injections[name];
  }

  if (typeof(registry[name]) === 'function') {
    registry[name] = registry[name]();
  }
  return registry[name];
};

Locator.prototype.inject = function(name, resolver) {
  // we don't care if the service exists or not
  injections[name] = resolver;
  return this;
};

Locator.prototype.restore = function(name) {
  if (injections[name]) {
    injections[name] = undefined;
  }
  return this;
};

module.exports = new Locator();
