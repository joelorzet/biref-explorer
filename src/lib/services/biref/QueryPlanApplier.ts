import 'server-only';
import type { IncludeNodeDTO, QueryBody, WhereClauseDTO } from '@shared/api';

/**
 * Translates a flat QueryBody DTO into a sequence of fluent-API
 * calls on a biref ChainBuilder. The builder itself is opaque to
 * us: we just forward select / where / include / limit.
 */
export class QueryPlanApplier {
  apply(rootChain: any, body: QueryBody): any {
    let chain = rootChain;
    if (body.select?.length) {
      chain = chain.select(...body.select);
    }
    chain = this.applyWhere(chain, body.where ?? []);
    chain = this.applyIncludes(chain, body.include ?? []);
    if (body.limit) {
      chain = chain.limit(body.limit);
    }
    return chain;
  }

  private applyWhere(rootChain: any, clauses: readonly WhereClauseDTO[]): any {
    let chain = rootChain;
    for (const clause of clauses) {
      chain =
        clause.op === 'is-null' || clause.op === 'is-not-null'
          ? chain.where(clause.field, clause.op)
          : chain.where(clause.field, clause.op, clause.value);
    }
    return chain;
  }

  private applyIncludes(
    rootChain: any,
    includes: readonly IncludeNodeDTO[],
  ): any {
    let chain = rootChain;
    for (const include of includes) {
      chain = chain.include(include.relation, (childChain: any) =>
        this.applyInclude(childChain, include),
      );
    }
    return chain;
  }

  private applyInclude(rootChain: any, node: IncludeNodeDTO): any {
    let chain = rootChain;
    if (node.select?.length) {
      chain = chain.select(...node.select);
    }
    chain = this.applyWhere(chain, node.where ?? []);
    chain = this.applyIncludes(chain, node.include ?? []);
    if (node.limit) {
      chain = chain.limit(node.limit);
    }
    return chain;
  }
}
