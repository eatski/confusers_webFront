/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
}
const withTM = require('next-transpile-modules')(['lodash-es','exprocess']);
module.exports = withTM(config);
