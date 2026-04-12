'use client';

import type { ConnectBody, DriverId } from '@shared/api';
import { IconArrowRight, IconSpinner } from '../icons';
import { type ConnectionMode, ConnectionModeTabs } from './ConnectionModeTabs';
import type { FieldErrors } from './connectionSchema';
import { DriverSelector } from './DriverSelector';
import { FieldsForm } from './FieldsForm';
import { SslToggle } from './SslToggle';
import { UrlForm } from './UrlForm';

interface Props {
  form: ConnectBody;
  driver: DriverId;
  mode: ConnectionMode;
  url: string;
  parseError: string | null;
  fieldErrors: FieldErrors;
  busy: boolean;
  error: string | null;
  onDriverChange: (driver: DriverId) => void;
  onModeChange: (mode: ConnectionMode) => void;
  onUrlChange: (url: string) => void;
  onFieldChange: <K extends keyof ConnectBody>(
    key: K,
    value: ConnectBody[K],
  ) => void;
  onSubmit: () => void;
}

export function ConnectionForm({
  form,
  driver,
  mode,
  url,
  parseError,
  fieldErrors,
  busy,
  error,
  onDriverChange,
  onModeChange,
  onUrlChange,
  onFieldChange,
  onSubmit,
}: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="panel p-6 md:p-7 animate-slide-up"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Connection</div>
          <div className="text-xs text-ink-muted">
            Credentials stay on your Next.js server. They never leave it.
          </div>
        </div>
        <ConnectionModeTabs mode={mode} onChange={onModeChange} />
      </div>

      <div className="mb-5">
        <DriverSelector value={driver} onChange={onDriverChange} />
      </div>

      {mode === 'url' ? (
        <UrlForm
          driver={driver}
          value={url}
          parseError={parseError}
          onChange={onUrlChange}
        />
      ) : (
        <FieldsForm form={form} errors={fieldErrors} onChange={onFieldChange} />
      )}

      <div className="mt-4">
        <SslToggle
          value={form.ssl ?? false}
          onChange={(next) => onFieldChange('ssl', next)}
        />
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-brand-rose/40 bg-brand-rose/10 p-3 text-xs text-brand-rose font-mono">
          {error}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-ink-dim">
          <span className="kbd">Enter</span>
          <span>to connect</span>
        </div>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? (
            <>
              <IconSpinner className="h-4 w-4 animate-spin" /> Connecting
            </>
          ) : (
            <>
              Connect
              <IconArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
