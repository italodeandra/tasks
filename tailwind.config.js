/* eslint-disable @typescript-eslint/no-var-requires */
const tailwindConfig = require("@italodeandra/ui/tailwind.config");
const { merge } = require("lodash");

/** @type {import("tailwindcss").Config} */
let config = {
  theme: {
    extend: {},
  },
};

module.exports = merge(tailwindConfig, config);
