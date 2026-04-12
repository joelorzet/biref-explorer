/* eslint-disable @typescript-eslint/no-require-imports */
const { version } = require('@biref/scanner/package.json') as {
  version: string;
};

export const SCANNER_VERSION: string = version;
