import { terser } from 'rollup-plugin-terser';
import { babel } from '@rollup/plugin-babel';
import pluginTypescript from 'rollup-plugin-typescript2';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginNodeResolve from '@rollup/plugin-node-resolve';

import packageJson from './package.json';

const ENTRY_FILE_PATH = 'index.ts';

function getExternals() {
  return Object.keys(packageJson.dependencies);
}

/** @type {import('rollup').RollupOptions} */
const config = {
  input: ENTRY_FILE_PATH,
  output: [
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: packageJson.main,
      format: 'commonjs',
      sourcemap: true,
      exports: 'default',
    },
  ],
  // MEMO: 디펜던시 생기면 사용
  external: getExternals(),
  plugins: [
    pluginTypescript({
      tsconfig: './tsconfig.json',
      useTsconfigDeclarationDir: true,
    }),
    babel({
      configFile: './babel.config.js',
    }),
    terser(),
    pluginCommonjs({
      extensions: ['.js', '.ts'],
    }),
    pluginNodeResolve({
      browser: false,
    }),
  ],
};

export default config;
