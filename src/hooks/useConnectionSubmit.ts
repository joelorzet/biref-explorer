'use client';

import type { ConnectBody, ConnectResponse } from '@shared/api';
import { useState } from 'react';
import {
  type FieldErrors,
  validateFields,
  validateUrl,
} from '@/components/connect/connectionSchema';
import { parseConnectionString } from '@/components/connect/parseConnectionString';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import type { ConnectionFormBinding } from '@/hooks/useConnectionForm';
import { useGlobalEnter } from '@/hooks/useGlobalEnter';
import { dbScanner, notifier } from '@/lib/container/client';

interface Args {
  binding: ConnectionFormBinding;
  onConnected: (session: ConnectResponse, body: ConnectBody) => void;
}

interface SubmitBinding {
  busy: boolean;
  error: string | null;
  parseError: string | null;
  submit: () => Promise<void>;
}

export function useConnectionSubmit({
  binding,
  onConnected,
}: Args): SubmitBinding {
  const action = useAsyncAction<ConnectResponse>();
  const [parseError, setParseError] = useState<string | null>(null);

  const submit = async () => {
    setParseError(null);
    binding.setFieldErrors({});

    const body = await resolveBody();
    if (!body) {
      return;
    }

    const session = await action.run(() =>
      notifier().connection.run(dbScanner().connect(body), {
        host: body.host,
        database: body.database,
      }),
    );
    if (session) {
      onConnected(session, body);
    }
  };

  const resolveBody = async (): Promise<ConnectBody | null> => {
    if (binding.connectionMode === 'url') {
      const urlCheck = await validateUrl(binding.url);
      if (!urlCheck.ok) {
        setParseError(urlCheck.error);
        return null;
      }
      const parsed = parseConnectionString(binding.url, binding.driver);
      if (!parsed.ok || !parsed.value) {
        setParseError(parsed.error ?? 'Invalid connection string');
        return null;
      }
      // Toggle wins over anything the parser sniffed from the URL:
      // the user explicitly opted in or out via the SSL switch.
      const merged: ConnectBody = {
        ...parsed.value,
        ssl: binding.form.ssl || parsed.value.ssl || false,
      };
      const validation = await validateFields(merged);
      if (!validation.ok) {
        setParseError(Object.values(validation.errors)[0] ?? 'Invalid URL');
        return null;
      }
      binding.setForm(validation.value);
      return validation.value;
    }
    const validation = await validateFields(binding.form);
    if (!validation.ok) {
      binding.setFieldErrors(validation.errors);
      return null;
    }
    return validation.value;
  };

  useGlobalEnter(submit, !action.running);

  return {
    busy: action.running,
    error: action.error,
    parseError,
    submit,
  };
}

export type { FieldErrors };
