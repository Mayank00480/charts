import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    '@mui/material',
    'recharts'
  ],
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false,
      // Allow resolution of .tsx files
      extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx']
    }),
    commonjs({
      include: /node_modules/
    }),
    typescript({
      tsconfig: './tsconfig.json',
      // Explicitly include TypeScript files
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['node_modules', '**/*.test.*']
    })
  ]
};