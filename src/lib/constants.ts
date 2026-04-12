import pkg from '../../package.json';

const deps = pkg.dependencies as Record<string, string>;

export const SCANNER_VERSION: string = deps['@biref/scanner'].replace(
  /^\^|~|>=?/,
  '',
);
