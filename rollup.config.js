import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import image from '@rollup/plugin-image'

const external = ['miniplex', 'react/jsx-runtime', 'three']
const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.png']

const getBabelOptions = ({ useESModules }, targets) => ({
  babelHelpers: 'runtime',
  babelrc: false,
  extensions,
  include: ['src/**/*', '**/node_modules/**'],
  plugins: [['@babel/transform-runtime', { regenerator: false, useESModules }]],
  presets: [
    ['@babel/preset-env', { loose: true, modules: false, targets }],
    '@babel/preset-typescript',
  ],
})

export default [
  {
    external,
    input: `./src/index.ts`,
    output: { dir: 'dist', format: 'esm' },
    plugins: [
      image(),
      resolve({ extensions }),
      babel(getBabelOptions({ useESModules: true }, '>1%, not dead, not ie 11, not op_mini all')),
    ],
  },
]
