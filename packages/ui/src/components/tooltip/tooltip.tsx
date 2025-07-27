import type { JSX } from 'solid-js';
import {
  Tooltip as KTooltip,
  type TooltipRootProps,
} from '@kobalte/core/tooltip';

import './style.css';

export interface TooltipProps extends TooltipRootProps {
  children?: JSX.Element;
  description?: string;
}

export function Tooltip(props: TooltipProps) {
  return (
    <KTooltip {...props}>
      <KTooltip.Trigger>{props.children}</KTooltip.Trigger>{' '}
      <KTooltip.Portal>
        <KTooltip.Content class="tooltip__content">
          <KTooltip.Arrow />
          {props.description}
        </KTooltip.Content>
      </KTooltip.Portal>
    </KTooltip>
  );
}
