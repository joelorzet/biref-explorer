export type FieldTypeCategory =
  | 'string'
  | 'integer'
  | 'decimal'
  | 'boolean'
  | 'date'
  | 'timestamp'
  | 'time'
  | 'json'
  | 'uuid'
  | 'binary'
  | 'enum'
  | 'array'
  | 'reference'
  | 'unknown';

export interface FieldDTO {
  name: string;
  category: FieldTypeCategory;
  nativeType: string;
  nullable: boolean;
  isIdentifier: boolean;
  defaultValue: string | null;
  description: string | null;
  enumValues?: readonly string[];
}

export interface IndexDTO {
  name: string;
  kind: string;
  fields: string[];
  unique: boolean;
}

export interface ConstraintDTO {
  name: string;
  kind: string;
  fields: string[];
}

export interface RelationDTO {
  name: string;
  direction: 'outbound' | 'inbound';
  cardinality: 'one' | 'many';
  from: { namespace: string; name: string };
  to: { namespace: string; name: string };
  fromFields: string[];
  toFields: string[];
  onDelete: string | null;
}

export interface EntityDTO {
  namespace: string;
  name: string;
  identifier: string[];
  description: string | null;
  fields: FieldDTO[];
  indexes: IndexDTO[];
  constraints: ConstraintDTO[];
  relationships: RelationDTO[];
}

export interface DataModelDTO {
  kind: string;
  namespaces: string[];
  entities: EntityDTO[];
  stats: {
    entityCount: number;
    fieldCount: number;
    relationshipCount: number;
    inboundCount: number;
    outboundCount: number;
  };
}

export type DriverId = 'postgres' | 'mysql' | 'sqlite' | 'mongodb';

export interface ConnectBody {
  driver: DriverId;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: boolean;
}

export interface ConnectResponse {
  sessionId: string;
  database: string;
  serverVersion: string;
}

export interface ScanBody {
  sessionId: string;
  namespaces: 'all' | string[];
}

export interface ScanResponse {
  model: DataModelDTO;
  elapsedMs: number;
}

export interface CodegenResponse {
  schemaTs: string;
  scannerDts: string;
  entityCount: number;
  elapsedMs: number;
}

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'in'
  | 'is-null'
  | 'is-not-null';

export interface WhereClauseDTO {
  field: string;
  op: FilterOperator;
  value?: unknown;
}

export interface IncludeNodeDTO {
  relation: string;
  select?: string[];
  where?: WhereClauseDTO[];
  include?: IncludeNodeDTO[];
  limit?: number;
}

export interface QueryBody {
  sessionId: string;
  namespace: string;
  entity: string;
  select?: string[];
  where?: WhereClauseDTO[];
  include?: IncludeNodeDTO[];
  limit?: number;
  mode: 'findMany' | 'findFirst';
}

export interface QueryResponse {
  rows: unknown;
  rowCount: number;
  elapsedMs: number;
  sql?: string;
}

export interface ExplainedQueryDTO {
  entity: string;
  sql: string;
  params: readonly unknown[];
  includes: readonly ExplainedQueryDTO[];
}

export interface ToSqlResponse {
  queries: ExplainedQueryDTO;
  elapsedMs: number;
}

export interface ApiError {
  error: string;
  detail?: string;
}
