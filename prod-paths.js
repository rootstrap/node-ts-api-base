/* eslint-disable guard-for-in */
/* eslint-disable no-undef */
const tsConfig = require('./tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');

const { baseUrl, paths } = tsConfig.compilerOptions;
for (const path in paths) {
  paths[path][0] = paths[path][0]
    .replace('src', 'dist/src')
    .replace('.ts', '.js');
}

tsConfigPaths.register({ baseUrl, paths });
