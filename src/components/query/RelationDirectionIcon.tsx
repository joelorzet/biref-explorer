import type { RelationDTO } from '@shared/api';
import { Tooltip } from '../common/Tooltip';
import { IconArrowLeft, IconArrowRight } from '../icons';

interface Props {
  direction: RelationDTO['direction'];
  className?: string;
}

const OUTBOUND_TOOLTIP =
  'Outbound: this table holds the foreign key pointing at the related one.';
const INBOUND_TOOLTIP =
  'Inbound: the related table holds a foreign key pointing at this one.';

/**
 * Direction indicator used wherever a relation is rendered. Hovering
 * reveals a portal-based tooltip so it escapes ancestor overflow and
 * stacking contexts (e.g. the relation picker popover's scroll box).
 */
export function RelationDirectionIcon({ direction, className = '' }: Props) {
  const isOutbound = direction === 'outbound';
  const tooltip = isOutbound ? OUTBOUND_TOOLTIP : INBOUND_TOOLTIP;
  const colorClass = isOutbound ? 'text-accent' : 'text-brand-violet';
  return (
    <Tooltip
      content={tooltip}
      className={`inline-flex h-3 w-3 shrink-0 cursor-help items-center justify-center ${colorClass} ${className}`}
    >
      {isOutbound ? (
        <IconArrowRight className="h-3 w-3" />
      ) : (
        <IconArrowLeft className="h-3 w-3" />
      )}
    </Tooltip>
  );
}
