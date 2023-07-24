// Constructor.
export const Interface = function(name, signature) {
  if (arguments.length != 2) {
    throw new Error(
      "Interface constructor called with " +
        arguments.length +
        " arguments, but expected exactly 2."
    );
  }
  if (typeof signature !== "object") {
    throw new Error(
      "Interface constructor second parameter was " +
        typeof signature +
        " but expected 'object'."
    );
  }
  if (signature.methods && !signature.properties) {
    throw new Error(
      "Interface constructor second parameter must contain one or both of these parameters: 'properties', 'methods'."
    );
  }
  this.properties = signature.properties ? signature.properties : [];
  this.methods = signature.methods ? signature.methods : [];
  this.name = name;

  this.methods.forEach(method => {
    if (typeof method !== "string") {
      throw new Error(
        "Interface constructor expects method names to be passed in as a string."
      );
    }
    this.methods.push(method);
  });

  this.properties.forEach(property => {
    if (typeof property !== "string") {
      throw new Error(
        "Interface constructor expects property names to be passed in as a string."
      );
    }
    this.properties.push(property);
  });
};

// Static class method.
Interface.ensureImplements = function(subject) {
  if (arguments.length < 2) {
    throw new Error(
      "Function Interface.ensureImplements called with " +
        arguments.length +
        "arguments, but expected at least 2."
    );
  }

  for (var i = 1, len = arguments.length; i < len; i++) {
    // interface is a reserved word
    const inyerface = arguments[i];
    if (inyerface.constructor !== Interface) {
      throw new Error(
        "Function Interface.ensureImplements expects arguments two and above to be instances of Interface."
      );
    }
    inyerface.methods.forEach((method, mi) => {
      if (!subject[method] || typeof subject[method] !== "function") {
        throw new Error(
          "Function Interface.ensureImplements: object does not implement the " +
            inyerface.name +
            " interface. Method " +
            method +
            " was not found."
        );
      }
    });
    inyerface.properties.forEach((property, pi) => {
      if (!subject[property] || typeof subject[property] === "function") {
        throw new Error(
          "Function Interface.ensureImplements: object does not implement the " +
            inyerface.name +
            " interface. Property " +
            property +
            " was not found."
        );
      }
    });
  }
};

export default Interface;
