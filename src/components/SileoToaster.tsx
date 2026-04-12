'use client';

import { Toaster } from 'sileo';
import 'sileo/styles.css';

export function SileoToaster() {
  return (
    <Toaster
      position="bottom-right"
      theme="dark"
      offset={{ bottom: 16, right: 16 }}
      options={{
        duration: 4500,
        roundness: 12,
      }}
    />
  );
}
