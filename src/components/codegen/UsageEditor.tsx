'use client';

import { useCallback, useEffect, useRef } from 'react';
import Editor, { type Monaco, useMonaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import {
  THEME_ID,
  configureTypeScript,
  defineTheme,
} from '@/lib/utils/monacoSetup';

interface Props {
  value: string;
  schemaTs: string;
  scannerDts: string;
  onChange: (value: string) => void;
}

const EDITOR_PATH = 'file:///usage-example.ts';

export function UsageEditor({ value, schemaTs, scannerDts, onChange }: Props) {
  const monaco = useMonaco();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleBeforeMount = useCallback(
    (m: Monaco) => {
      defineTheme(m);
      configureTypeScript(m, schemaTs, scannerDts);
    },
    [schemaTs],
  );

  const handleMount = useCallback(
    (ed: editor.IStandaloneCodeEditor) => {
      editorRef.current = ed;
    },
    [],
  );

  useEffect(() => {
    if (!monaco) return;
    configureTypeScript(monaco, schemaTs, scannerDts);
  }, [monaco, schemaTs, scannerDts]);

  useEffect(() => {
    const ed = editorRef.current;
    if (!ed) return;
    const model = ed.getModel();
    if (model && model.getValue() !== value) {
      model.setValue(value);
    }
  }, [value]);

  return (
    <Editor
      height="100%"
      language="typescript"
      theme={THEME_ID}
      path={EDITOR_PATH}
      defaultValue={value}
      beforeMount={handleBeforeMount}
      onMount={handleMount}
      onChange={(v) => onChange(v ?? '')}
      options={{
        fontSize: 12,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        lineHeight: 1.6,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 12, bottom: 12 },
        renderLineHighlight: 'none',
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
        lineNumbersMinChars: 4,
        tabSize: 2,
        automaticLayout: true,
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
      }}
      loading={
        <div className="flex h-full items-center justify-center text-xs text-ink-muted">
          Loading editor…
        </div>
      }
    />
  );
}
