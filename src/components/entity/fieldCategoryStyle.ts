import type { FieldTypeCategory } from '@shared/api';

export const fieldCategoryStyle: Record<FieldTypeCategory, string> = {
  string: 'chip-cyan',
  integer: 'chip-cyan',
  decimal: 'chip-cyan',
  boolean: 'chip-violet',
  date: 'chip-amber',
  timestamp: 'chip-amber',
  time: 'chip-amber',
  json: 'chip-violet',
  uuid: 'chip-accent',
  binary: 'chip',
  enum: 'chip-amber',
  array: 'chip-violet',
  reference: 'chip-rose',
  unknown: 'chip',
};
