'use client';

import type { ConnectBody, DriverId } from '@shared/api';
import { useCallback, useState } from 'react';
import type { ConnectionMode } from '@/components/connect/ConnectionModeTabs';
import type { FieldErrors } from '@/components/connect/connectionSchema';
import { driverById } from '@/components/connect/drivers';
import type { ScanMode } from '@/components/connect/ScanModeSelector';

export interface ConnectionFormBinding {
  driver: DriverId;
  form: ConnectBody;
  scanMode: ScanMode;
  connectionMode: ConnectionMode;
  url: string;
  fieldErrors: FieldErrors;
  setForm: React.Dispatch<React.SetStateAction<ConnectBody>>;
  setFieldErrors: React.Dispatch<React.SetStateAction<FieldErrors>>;
  setScanMode: (mode: ScanMode) => void;
  setConnectionMode: (mode: ConnectionMode) => void;
  setUrl: (url: string) => void;
  updateField: <K extends keyof ConnectBody>(
    key: K,
    value: ConnectBody[K],
  ) => void;
  changeDriver: (driver: DriverId) => void;
}

const defaultForm = (driver: DriverId): ConnectBody => ({
  driver,
  host: '',
  port: driverById(driver).defaultPort || 5432,
  user: '',
  password: '',
  database: '',
  ssl: false,
});

export function useConnectionForm(): ConnectionFormBinding {
  const [driver, setDriver] = useState<DriverId>('postgres');
  const [form, setForm] = useState<ConnectBody>(() => defaultForm('postgres'));
  const [scanMode, setScanMode] = useState<ScanMode>('runtime');
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('url');
  const [url, setUrl] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const updateField = useCallback(
    <K extends keyof ConnectBody>(key: K, value: ConnectBody[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setFieldErrors((prev) =>
        prev[key] ? { ...prev, [key]: undefined } : prev,
      );
    },
    [],
  );

  const changeDriver = useCallback((next: DriverId) => {
    setDriver(next);
    setForm((prev) => ({
      ...prev,
      driver: next,
      port: driverById(next).defaultPort || prev.port,
    }));
  }, []);

  return {
    driver,
    form,
    scanMode,
    connectionMode,
    url,
    fieldErrors,
    setForm,
    setFieldErrors,
    setScanMode,
    setConnectionMode,
    setUrl,
    updateField,
    changeDriver,
  };
}
