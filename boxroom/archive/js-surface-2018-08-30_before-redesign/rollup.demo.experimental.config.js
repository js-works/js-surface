import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
  input: 'src/demo-experimental/demo.ts',

  output: {
    file: './build/demo-experimental.js',
    format: 'umd',

    globals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'dyo': 'Dyo',
      'js-spec': 'jsSpec'
    }
  },

  external: ['react', 'react-dom', 'js-spec'],
  
  plugins: [
    resolve(),
    commonjs(),
    replace({
      exclude: 'node_modules/**',
      
      values: {
        'process.env.NODE_ENV': "'development'"
      }
    }),
    typescript(),
    serve({
      open: true,
      contentBase: '.',
      openPage: '/src/demo-experimental/index.html'
    }),
    livereload({
      watch: ['src/demo', 'build']
    })
  ]
}
