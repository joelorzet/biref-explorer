import type {
  FilterOperator,
  IncludeNodeDTO,
  WhereClauseDTO,
} from '@shared/api';

export interface QueryNodeState {
  select: string[];
  where: WhereClauseDTO[];
  includes: IncludeNodeDTO[];
  limit?: number;
}

export const OPERATORS: FilterOperator[] = [
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'like',
  'ilike',
  'in',
  'is-null',
  'is-not-null',
];

export function isUnary(op: FilterOperator): boolean {
  return op === 'is-null' || op === 'is-not-null';
}

export const OPERATOR_LABEL: Record<FilterOperator, string> = {
  eq: '=',
  neq: '≠',
  gt: '>',
  gte: '≥',
  lt: '<',
  lte: '≤',
  like: 'LIKE',
  ilike: 'ILIKE',
  in: 'IN',
  'is-null': 'IS NULL',
  'is-not-null': 'IS NOT NULL',
};
