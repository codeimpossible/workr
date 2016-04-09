'use strict';

module.exports = class Model {
  constructor(data) {
    data = data || {};
    data = this.transform ? this.transform(data) : data;

    let result = this.schema ? this.schema.validate(data) : data;
    if (this.schema && result.error) {
      throw result.error;
    }
    result = this.schema ? result.value : result;
    Object.assign(this, result);
  }
}
