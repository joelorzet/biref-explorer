import type { DataModelDTO, EntityDTO, RelationDTO } from '@shared/api';

/**
 * Builds a TypeScript usage snippet from the scanned model, using
 * real entity names, fields, and relations from the database.
 * Picks a random entity each call so repeated generations vary.
 */
export function buildUsageSnippet(model: DataModelDTO): string {
  const primary = pickRandom(model, null);
  if (!primary) {
    return fallbackSnippet();
  }

  const secondary = pickRandom(model, primary.name);
  const ns = primary.namespace;
  const lines: string[] = [
    ...preamble(),
    ``,
    `// --- ${ns}.${primary.name} ---`,
    ``,
    ...findManyBlock(ns, primary),
    ``,
    ...selectBlock(ns, primary),
  ];

  const whereLines = whereBlock(ns, primary);
  if (whereLines.length) {
    lines.push(``, ...whereLines);
  }

  const includeLines = includeBlock(ns, primary, model);
  if (includeLines.length) {
    lines.push(``, ...includeLines);
  }

  const comboLines = comboBlock(ns, primary, model);
  if (comboLines.length) {
    lines.push(``, ...comboLines);
  }

  if (secondary) {
    lines.push(
      ``,
      `// --- ${secondary.namespace}.${secondary.name} ---`,
      ``,
      ...findManyBlock(secondary.namespace, secondary),
    );

    const secWhere = whereBlock(secondary.namespace, secondary);
    if (secWhere.length) {
      lines.push(``, ...secWhere);
    }

    const secInclude = includeBlock(secondary.namespace, secondary, model);
    if (secInclude.length) {
      lines.push(``, ...secInclude);
    }
  }

  lines.push(``, `await client.end();`);
  return lines.join('\n');
}

// ── block builders ──────────────────────────────────────────────

function preamble(): string[] {
  return [
    `import pg from 'pg';`,
    `import { Biref, postgresAdapter } from '@biref/scanner';`,
    `import type { BirefSchema } from './biref.schema';`,
    ``,
    `const client = new pg.Client({`,
    `  host: 'localhost',`,
    `  port: 5432,`,
    `  user: 'postgres',`,
    `  password: 'password',`,
    `  database: 'my_database',`,
    `});`,
    `await client.connect();`,
    ``,
    `const adapter = postgresAdapter.create(client);`,
    `const biref = Biref.builder().withAdapter(adapter).build();`,
    `const model = await biref.scan({ namespaces: 'all' });`,
    `const q = biref.query<BirefSchema>(model);`,
  ];
}

function findManyBlock(ns: string, e: EntityDTO): string[] {
  return [
    `// fetch all ${e.name}`,
    `const ${varName(e.name)} = await q.${ns}.${e.name}.findMany();`,
  ];
}

function selectBlock(ns: string, e: EntityDTO): string[] {
  const cols = e.fields.slice(0, 4).map((f) => f.name);
  if (cols.length < 2) {
    return [];
  }
  const args = cols.map((c) => `'${c}'`).join(', ');
  return [
    `// pick specific columns`,
    `const partial = await q.${ns}.${e.name}`,
    `  .select(${args})`,
    `  .findMany();`,
  ];
}

function whereBlock(ns: string, e: EntityDTO): string[] {
  const id = e.fields.find((f) => f.isIdentifier);
  if (!id) {
    return [];
  }
  const lines = [
    `// find by primary key`,
    `const single = await q.${ns}.${e.name}`,
    `  .where('${id.name}', 'eq', ${sampleValue(id)})`,
    `  .findFirst();`,
  ];

  const filterable = e.fields.find(
    (f) =>
      !f.isIdentifier && (f.category === 'boolean' || f.category === 'string'),
  );
  if (filterable) {
    const val =
      filterable.category === 'boolean'
        ? 'true'
        : `'${sampleStringValue(filterable.name)}'`;
    lines.push(
      ``,
      `// chain multiple where clauses`,
      `const filtered = await q.${ns}.${e.name}`,
      `  .where('${filterable.name}', 'eq', ${val})`,
      `  .limit(10)`,
      `  .findMany();`,
    );
  }

  return lines;
}

function includeBlock(ns: string, e: EntityDTO, model: DataModelDTO): string[] {
  const rels = e.relationships.slice(0, 2);
  if (!rels.length) {
    return [];
  }

  if (rels.length === 1) {
    return singleInclude(ns, e, rels[0], model);
  }

  return multiInclude(ns, e, rels, model);
}

function buildIncludeCallback(rel: RelationDTO, model: DataModelDTO): string {
  const target = findEntity(model, rel.to.namespace, rel.to.name);
  if (!target) {
    return `(r) => r.limit(5)`;
  }

  const targetCols = target.fields
    .filter((f) => !f.isIdentifier)
    .slice(0, 3)
    .map((f) => f.name);

  if (targetCols.length >= 2) {
    const selectArgs = targetCols.map((c) => `'${c}'`).join(', ');
    return `(r) => r.select(${selectArgs}).limit(5)`;
  }

  return `(r) => r.limit(5)`;
}

function singleInclude(
  ns: string,
  e: EntityDTO,
  rel: RelationDTO,
  model: DataModelDTO,
): string[] {
  const cb = buildIncludeCallback(rel, model);
  return [
    `// include ${rel.name}`,
    `const with${capitalize(rel.name)} = await q.${ns}.${e.name}`,
    `  .include('${rel.name}', ${cb})`,
    `  .findMany();`,
  ];
}

function multiInclude(
  ns: string,
  e: EntityDTO,
  rels: RelationDTO[],
  model: DataModelDTO,
): string[] {
  const cb0 = buildIncludeCallback(rels[0], model);
  const cb1 = buildIncludeCallback(rels[1], model);
  return [
    `// include multiple relations`,
    `const withRelations = await q.${ns}.${e.name}`,
    `  .include('${rels[0].name}', ${cb0})`,
    `  .include('${rels[1].name}', ${cb1})`,
    `  .findMany();`,
  ];
}

function comboBlock(ns: string, e: EntityDTO, model: DataModelDTO): string[] {
  const id = e.fields.find((f) => f.isIdentifier);
  const rel = e.relationships[0];
  const cols = e.fields.slice(0, 3).map((f) => f.name);
  if (!id || !rel || cols.length < 2) {
    return [];
  }
  const args = cols.map((c) => `'${c}'`).join(', ');
  const cb = buildIncludeCallback(rel, model);
  return [
    `// combine select, where, and include`,
    `const combined = await q.${ns}.${e.name}`,
    `  .select(${args})`,
    `  .where('${id.name}', 'eq', ${sampleValue(id)})`,
    `  .include('${rel.name}', ${cb})`,
    `  .findFirst();`,
  ];
}

// ── helpers ─────────────────────────────────────────────────────

function findEntity(
  model: DataModelDTO,
  ns: string,
  name: string,
): EntityDTO | null {
  return (
    model.entities.find((e) => e.namespace === ns && e.name === name) ?? null
  );
}

function pickRandom(
  model: DataModelDTO,
  exclude: string | null,
): EntityDTO | null {
  const pool = model.entities.filter((e) => e.name !== exclude);
  if (!pool.length) {
    return null;
  }
  const rich = pool.filter(
    (e) => e.relationships.length > 0 && e.fields.length >= 3,
  );
  const candidates = rich.length ? rich : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function sampleValue(field: EntityDTO['fields'][number]): string {
  switch (field.category) {
    case 'integer':
    case 'decimal':
      return '1';
    case 'uuid':
      return `'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'`;
    case 'boolean':
      return 'true';
    default:
      return `'value'`;
  }
}

function sampleStringValue(fieldName: string): string {
  if (fieldName.includes('email')) {
    return 'user@example.com';
  }
  if (fieldName.includes('name')) {
    return 'John';
  }
  if (fieldName.includes('status')) {
    return 'active';
  }
  return 'value';
}

function varName(entity: string): string {
  return entity.replace(/[^a-zA-Z0-9]/g, '_');
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fallbackSnippet(): string {
  return [
    `import pg from 'pg';`,
    `import { Biref, postgresAdapter } from '@biref/scanner';`,
    `import type { BirefSchema } from './biref.schema';`,
    ``,
    `const client = new pg.Client({ /* your config */ });`,
    `await client.connect();`,
    ``,
    `const adapter = postgresAdapter.create(client);`,
    `const biref = Biref.builder().withAdapter(adapter).build();`,
    `const model = await biref.scan({ namespaces: 'all' });`,
    `const q = biref.query<BirefSchema>(model);`,
    ``,
    `const rows = await q.<namespace>.<entity>.findMany();`,
    ``,
    `await client.end();`,
  ].join('\n');
}
