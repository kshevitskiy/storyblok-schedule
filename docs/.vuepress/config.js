const pkg = require('../../package.json')
const path = require('path')

module.exports = {
  title: `${pkg.name} (${pkg.version})`,
  description: pkg.description,
  dest: `www`,
  themeConfig: {
    search: false,
    nav: [
      { text: 'v1', link: '/' },
      { text: 'Code', link: 'https://github.com' }
    ]
  },
  plugins: [
    [
      '@vuepress/register-components',
      {
        componentsDir: `${__dirname}/../../src/`
      }
    ],
    [
      'demo-code',
      {
        onlineBtns: { codepen: false, jsfiddle: false, codesandbox: false }
      }
    ]
  ]
}
