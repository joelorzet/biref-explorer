import type { Monaco } from '@monaco-editor/react';

const THEME_ID = 'biref-dark';

export { THEME_ID };

export function defineTheme(monaco: Monaco) {
  monaco.editor.defineTheme(THEME_ID, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '8B5CF6' },
      { token: 'type', foreground: '06B6D4' },
      { token: 'string', foreground: '22C55E' },
      { token: 'number', foreground: 'F59E0B' },
      { token: 'comment', foreground: '64748B', fontStyle: 'italic' },
      { token: 'identifier', foreground: 'F8FAFC' },
      { token: 'delimiter', foreground: '94A3B8' },
    ],
    colors: {
      'editor.background': '#0F172A',
      'editor.foreground': '#F8FAFC',
      'editor.lineHighlightBackground': '#1A223700',
      'editor.selectionBackground': '#334155',
      'editorLineNumber.foreground': '#64748B',
      'editorLineNumber.activeForeground': '#94A3B8',
      'editorCursor.foreground': '#22C55E',
      'editorWidget.background': '#141B2E',
      'editorWidget.border': '#1E293B',
      'editorSuggestWidget.background': '#141B2E',
      'editorSuggestWidget.border': '#1E293B',
      'editorSuggestWidget.selectedBackground': '#1A2237',
      'editorSuggestWidget.highlightForeground': '#22C55E',
      'editorHoverWidget.background': '#141B2E',
      'editorHoverWidget.border': '#1E293B',
      'input.background': '#0B1020',
      'input.border': '#1E293B',
      'scrollbarSlider.background': '#1E293B80',
      'scrollbarSlider.hoverBackground': '#334155',
    },
  });
}

/**
 * Strip imports and replace the overrides application so the schema
 * is self-contained (no external deps needed by the TS worker).
 */
function cleanSchema(schemaTs: string): string {
  return schemaTs
    .split('\n')
    .filter((l) => !l.startsWith('import '))
    .join('\n')
    .replace(
      /ApplySchemaOverrides<RawBirefSchema,\s*Overrides>/g,
      'RawBirefSchema',
    );
}

const PG_STUB = [
  'export interface ClientConfig {',
  '  host?: string; port?: number; user?: string;',
  '  password?: string; database?: string; ssl?: boolean | object;',
  '}',
  'export class Client {',
  '  constructor(config?: ClientConfig);',
  '  connect(): Promise<void>;',
  '  end(): Promise<void>;',
  '  query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }>;',
  '}',
  'export default Client;',
].join('\n');

const disposables: { dispose(): void }[] = [];

function disposeAll() {
  for (const d of disposables) {
    d.dispose();
  }
  disposables.length = 0;
}

function ensureModel(monaco: Monaco, uri: string, content: string) {
  const parsed = monaco.Uri.parse(uri);
  const existing = monaco.editor.getModel(parsed);
  if (existing) {
    existing.setValue(content);
  } else {
    monaco.editor.createModel(content, 'typescript', parsed);
  }
}

export function configureTypeScript(
  monaco: Monaco,
  schemaTs: string,
  scannerDts: string,
) {
  const ts = (monaco.languages as any).typescript;

  ts.typescriptDefaults.setEagerModelSync(true);

  ts.typescriptDefaults.setCompilerOptions({
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    strict: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    allowNonTsExtensions: true,
    jsx: ts.JsxEmit.React,
  });

  ts.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  disposeAll();

  const cleaned = cleanSchema(schemaTs);
  const schemaPath = 'file:///biref.schema.ts';
  const scannerPath = 'file:///node_modules/@biref/scanner/index.d.ts';
  const pgPath = 'file:///node_modules/pg/index.d.ts';

  disposables.push(ts.typescriptDefaults.addExtraLib(cleaned, schemaPath));
  disposables.push(ts.typescriptDefaults.addExtraLib(scannerDts, scannerPath));
  disposables.push(ts.typescriptDefaults.addExtraLib(PG_STUB, pgPath));

  ensureModel(monaco, schemaPath, cleaned);
  ensureModel(monaco, scannerPath, scannerDts);
  ensureModel(monaco, pgPath, PG_STUB);
}
