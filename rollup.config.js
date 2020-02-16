import { terser } from 'rollup-plugin-terser'

export default {
  input: './src/useInteraction.js',
  output: {
    file: './dist/useInteraction.min.js',
    format: 'cjs',
    name: 'useInteraction',
    globals: {
      react: 'React',
      'prop-types': 'PropTypes',
      lodash: 'lodash',
      reactn: 'reactn',
    },
  },
  external: ['react', 'prop-types', 'lodash', 'reactn'],
  plugins: [terser()],
}
