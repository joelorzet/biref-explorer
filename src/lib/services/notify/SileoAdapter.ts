'use client';

import { type SileoOptions, sileo } from 'sileo';
import type { IToastAdapter, SileoPromiseConfig } from './types';

export class SileoAdapter implements IToastAdapter {
  success(opts: SileoOptions): void {
    sileo.success(opts);
  }
  error(opts: SileoOptions): void {
    sileo.error(opts);
  }
  info(opts: SileoOptions): void {
    sileo.info(opts);
  }
  warning(opts: SileoOptions): void {
    sileo.warning(opts);
  }
  dismiss(id: string): void {
    sileo.dismiss(id);
  }
  promise<T>(
    promise: Promise<T> | (() => Promise<T>),
    config: SileoPromiseConfig<T>,
  ): Promise<T> {
    return sileo.promise<T>(promise, config);
  }
}
