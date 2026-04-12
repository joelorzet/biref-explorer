'use client';

import type { DataModelDTO, EntityDTO } from '@shared/api';
import { useMemo } from 'react';
import { useTextFilter } from '@/hooks/useTextFilter';
import { useToggleSet } from '@/hooks/useToggleSet';

export interface SidebarBinding {
  query: string;
  setQuery: (query: string) => void;
  grouped: Array<[string, EntityDTO[]]>;
  isCollapsed: (namespace: string) => boolean;
  toggleCollapsed: (namespace: string) => void;
}

export function useSidebar(model: DataModelDTO): SidebarBinding {
  const { query, setQuery, filtered } = useTextFilter(
    model.entities,
    (entity) => entity.name,
  );

  const grouped = useMemo(() => {
    const byNamespace = new Map<string, EntityDTO[]>();
    for (const namespace of model.namespaces) {
      byNamespace.set(namespace, []);
    }
    for (const entity of filtered) {
      const bucket = byNamespace.get(entity.namespace) ?? [];
      bucket.push(entity);
      byNamespace.set(entity.namespace, bucket);
    }
    return Array.from(byNamespace.entries());
  }, [model.namespaces, filtered]);

  const collapsed = useToggleSet<string>();

  return {
    query,
    setQuery,
    grouped,
    isCollapsed: collapsed.has,
    toggleCollapsed: collapsed.toggle,
  };
}
