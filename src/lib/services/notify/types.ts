import type { SileoOptions, SileoPosition } from 'sileo';

export interface SileoPromiseConfig<T> {
  loading: SileoOptions;
  success: SileoOptions | ((data: T) => SileoOptions);
  error: SileoOptions | ((err: unknown) => SileoOptions);
  position?: SileoPosition;
}

/**
 * Narrow port around the Sileo toast library. Keeping it as an
 * interface lets us swap in a mock during tests without pulling the
 * whole DOM-bound implementation.
 */
export interface IToastAdapter {
  success(opts: SileoOptions): void;
  error(opts: SileoOptions): void;
  info(opts: SileoOptions): void;
  warning(opts: SileoOptions): void;
  dismiss(id: string): void;
  promise<T>(
    promise: Promise<T> | (() => Promise<T>),
    config: SileoPromiseConfig<T>,
  ): Promise<T>;
}
