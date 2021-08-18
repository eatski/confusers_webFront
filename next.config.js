/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
}
const withTM = require('next-transpile-modules')(['lodash-es']);
module.exports = withTM(config);
