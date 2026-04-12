'use client';

import type { ConnectBody, ConnectResponse } from '@shared/api';
import { useConnectionForm } from '@/hooks/useConnectionForm';
import { useConnectionSubmit } from '@/hooks/useConnectionSubmit';
import { ConnectionForm } from './connect/ConnectionForm';
import { ConnectionHeader } from './connect/ConnectionHeader';
import { FeatureList } from './connect/FeatureList';
import { Hero } from './connect/Hero';
import { type ScanMode, ScanModeSelector } from './connect/ScanModeSelector';

export type { ScanMode };

interface Props {
  onConnected: (
    session: ConnectResponse,
    credentials: ConnectBody,
    mode: ScanMode,
  ) => void;
}

export function ConnectionPanel({ onConnected }: Props) {
  const binding = useConnectionForm();
  const submit = useConnectionSubmit({
    binding,
    onConnected: (session, body) =>
      onConnected(session, body, binding.scanMode),
  });

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
      <div className="absolute top-0 right-0 h-[480px] w-[480px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-brand-violet/10 blur-[120px] pointer-events-none" />

      <ConnectionHeader />

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-8 pb-16 pt-12">
        <Hero />
        <section className="grid gap-6 md:grid-cols-[1.2fr_1fr] items-start">
          <ConnectionForm
            form={binding.form}
            driver={binding.driver}
            mode={binding.connectionMode}
            url={binding.url}
            parseError={submit.parseError}
            fieldErrors={binding.fieldErrors}
            busy={submit.busy}
            error={submit.error}
            onDriverChange={binding.changeDriver}
            onModeChange={binding.setConnectionMode}
            onUrlChange={binding.setUrl}
            onFieldChange={binding.updateField}
            onSubmit={submit.submit}
          />
          <aside className="flex flex-col gap-4 animate-slide-up">
            <ScanModeSelector
              mode={binding.scanMode}
              onChange={binding.setScanMode}
            />
            <FeatureList />
          </aside>
        </section>
      </main>
    </div>
  );
}
