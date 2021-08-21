const withMDX = require('@next/mdx')({ extension: /\.mdx?$/ })
const withPWA = require('next-pwa')
module.exports = withPWA(withMDX({ pageExtensions: ['js', 'jsx', 'mdx'], pwa: {
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
  }, }))
