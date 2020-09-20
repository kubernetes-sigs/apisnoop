import resolve from 'rollup-plugin-node-resolve';
import path from 'path';
import replace from '@rollup/plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';
import builtins from '@joseph184/rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import json from '@rollup/plugin-json';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) => {
  if (
    warning.code === 'CIRCULAR_DEPENDENCY'
      && (
        !warning.importer.indexOf(path.normalize('node_modules/d3/src/lib'))
          || !warning.importer.indexOf(path.normalize('node_modules/d3-selection/src'))
          || !warning.importer.indexOf(path.normalize('node_modules/d3-interpolate/src'))
          || !warning.importer.indexOf(path.normalize('node_modules/d3-transition/src'))
          || !warning.importer.indexOf(path.normalize('node_modules/d3-voronoi/src'))
      )
  ){
    return;
  } else {
    onwarn(warning);
  }
};

const dedupe = importee => importee === 'svelte' || importee.startsWith('svelte/');

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode)
      }),
      svelte({
        dev,
        hydratable: true,
        emitCss: true
      }),
      resolve({
        browser: true,
        dedupe
      }),
      commonjs(),
      builtins(),
      globals(),
      json(),
      legacy && babel({
        extensions: ['.js', '.mjs', '.html', '.svelte'],
        runtimeHelpers: true,
        exclude: ['node_modules/@babel/**'],
        presets: [
          ['@babel/preset-env', {
            targets: '> 0.25%, not dead'
          }]
        ],
        plugins: [
          '@babel/plugin-syntax-dynamic-import',
          ['@babel/plugin-transform-runtime', {
            useESModules: true
          }]
        ]
      }),

      !dev && terser({
        module: true
      })
    ],

    onwarn,
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      replace({
        'process.browser': false,
        'process.env.NODE_ENV': JSON.stringify(mode)
      }),
      svelte({
        generate: 'ssr',
        dev
      }),
      resolve({
        dedupe
      }),
      commonjs(),
      json()
    ],
    external: Object.keys(pkg.dependencies).concat(
      require('module').builtinModules || Object.keys(process.binding('natives'))
    ),

    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode)
      }),
      commonjs(),
      !dev && terser()
    ],

    onwarn,
  }
};
