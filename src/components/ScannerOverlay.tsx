'use client';

import { useEffect, useState } from 'react';
import {
  IconBranch,
  IconCheck,
  IconDatabase,
  IconLayers,
  IconScan,
} from './icons';

interface Props {
  running: boolean;
  mode: 'runtime' | 'codegen';
  database: string;
}

const STAGES = [
  { label: 'Opening connection', icon: IconDatabase, duration: 220 },
  { label: 'Introspecting entities', icon: IconLayers, duration: 340 },
  { label: 'Walking relationships', icon: IconBranch, duration: 420 },
  { label: 'Normalizing model', icon: IconScan, duration: 260 },
];

export function ScannerOverlay({ running, mode, database }: Props) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!running) {
      setStage(0);
      return;
    }
    let cancelled = false;
    let current = 0;
    setStage(0);
    const tick = () => {
      if (cancelled) {
        return;
      }
      if (current >= STAGES.length - 1) {
        // Hold on the last stage until the real request completes.
        setStage(STAGES.length - 1);
        return;
      }
      current += 1;
      setStage(current);
      setTimeout(tick, STAGES[current].duration);
    };
    const handle = setTimeout(tick, STAGES[0].duration);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [running]);

  if (!running) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-md animate-fade-in">
      <div className="panel relative w-[440px] overflow-hidden p-8">
        <div className="absolute inset-x-0 top-0 h-px shimmer" />

        <div className="flex flex-col items-center gap-5 text-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse-ring rounded-full bg-accent/40" />
            <div className="absolute inset-0 animate-pulse-ring rounded-full bg-accent/30 [animation-delay:600ms]" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent ring-1 ring-accent/40">
              <IconScan className="h-7 w-7" />
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold">
              {mode === 'codegen'
                ? 'Generating typed schema'
                : 'Scanning database'}
            </div>
            <div className="mt-1 font-mono text-[11px] text-ink-dim">
              {database}
            </div>
          </div>
        </div>

        <ul className="mt-7 space-y-2">
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            const done = i < stage;
            const active = i === stage;
            return (
              <li
                key={s.label}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-colors duration-300 ${
                  active
                    ? 'bg-accent/10 text-accent'
                    : done
                      ? 'text-ink-muted'
                      : 'text-ink-dim'
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                    active
                      ? 'bg-accent/20 text-accent'
                      : done
                        ? 'bg-bg-hover text-accent'
                        : 'bg-bg-elevated text-ink-dim'
                  }`}
                >
                  {done ? (
                    <IconCheck className="h-3.5 w-3.5" />
                  ) : (
                    <Icon className="h-3.5 w-3.5" />
                  )}
                </div>
                <span className="font-mono">{s.label}</span>
                {active && (
                  <span className="ml-auto inline-flex gap-1">
                    <Dot /> <Dot delay="120ms" /> <Dot delay="240ms" />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay?: string }) {
  return (
    <span
      className="inline-block h-1 w-1 animate-pulse rounded-full bg-accent"
      style={delay ? { animationDelay: delay } : undefined}
    />
  );
}
