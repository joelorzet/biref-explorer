import type {
  FieldTypeCategory,
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

const NUMERIC_OPS: FilterOperator[] = [
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'in',
  'is-null',
  'is-not-null',
];

const STRING_OPS: FilterOperator[] = [
  'eq',
  'neq',
  'like',
  'ilike',
  'in',
  'is-null',
  'is-not-null',
];

const BOOLEAN_OPS: FilterOperator[] = ['eq', 'neq', 'is-null', 'is-not-null'];

const ENUM_OPS: FilterOperator[] = [
  'eq',
  'neq',
  'in',
  'is-null',
  'is-not-null',
];

export function operatorsForCategory(
  category: FieldTypeCategory,
): FilterOperator[] {
  switch (category) {
    case 'integer':
    case 'decimal':
    case 'date':
    case 'timestamp':
    case 'time':
      return NUMERIC_OPS;
    case 'string':
    case 'uuid':
      return STRING_OPS;
    case 'boolean':
      return BOOLEAN_OPS;
    case 'enum':
      return ENUM_OPS;
    default:
      return OPERATORS;
  }
}

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
