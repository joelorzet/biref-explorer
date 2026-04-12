import type { ConnectBody, DriverId } from '@shared/api';
import * as yup from 'yup';

const DRIVER_IDS: DriverId[] = ['postgres', 'mysql', 'sqlite', 'mongodb'];

export const fieldsSchema: yup.ObjectSchema<ConnectBody> = yup.object({
  driver: yup
    .mixed<DriverId>()
    .oneOf(DRIVER_IDS, 'Unsupported driver')
    .required('Driver is required'),
  host: yup
    .string()
    .trim()
    .required('Host is required')
    .max(253, 'Host is too long'),
  port: yup
    .number()
    .typeError('Port must be a number')
    .required('Port is required')
    .integer('Port must be an integer')
    .min(1, 'Port must be between 1 and 65535')
    .max(65535, 'Port must be between 1 and 65535'),
  user: yup.string().trim().required('User is required'),
  password: yup.string().default(''),
  database: yup.string().trim().required('Database is required'),
  ssl: yup.boolean().optional(),
});

export const urlSchema = yup.object({
  url: yup
    .string()
    .trim()
    .required('Paste a connection string')
    .min(10, 'Connection string looks too short'),
});

export type FieldErrors = Partial<Record<keyof ConnectBody, string>>;

export function collectFieldErrors(err: unknown): FieldErrors {
  if (!(err instanceof yup.ValidationError)) {
    return {};
  }
  const out: FieldErrors = {};
  for (const inner of err.inner.length > 0 ? err.inner : [err]) {
    const key = inner.path as keyof ConnectBody | undefined;
    if (key && !out[key]) {
      out[key] = inner.message;
    }
  }
  return out;
}

export async function validateFields(
  form: ConnectBody,
): Promise<
  { ok: true; value: ConnectBody } | { ok: false; errors: FieldErrors }
> {
  try {
    const value = await fieldsSchema.validate(form, { abortEarly: false });
    return { ok: true, value: value as ConnectBody };
  } catch (err) {
    return { ok: false, errors: collectFieldErrors(err) };
  }
}

export async function validateUrl(
  url: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await urlSchema.validate({ url });
    return { ok: true };
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return { ok: false, error: err.message };
    }
    return { ok: false, error: 'Invalid connection string' };
  }
}
