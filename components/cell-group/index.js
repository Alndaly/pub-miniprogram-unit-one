'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});
var component_1 = require('../common/component');
component_1.VantComponent({
  props: {
    customStyle: String,
    title: String,
    inset: {
      type: Boolean,
      value: false
    },
    border: {
      type: Boolean,
      value: true,
    },
  },
});