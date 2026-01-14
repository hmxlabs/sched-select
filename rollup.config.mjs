import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const packageJson = require('./package.json');

export default [
  // Main bundle
  {
    input: 'src/lib.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      commonjs(),
      json(),
      image(),
      typescript({
        tsconfig: './tsconfig.build.json',
        exclude: ['**/*.test.tsx', '**/*.test.ts'],
      }),
      postcss({
        extract: 'styles.css',
        minimize: true,
      }),
    ],
    external: ['react', 'react-dom', 'react-router-dom'],
  },
  // Type declarations
  {
    input: 'dist/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
    external: [/\.css$/],
  },
];
