import { splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { Tooltip, type TooltipProps } from './tooltip';

import type { LucideIcon } from 'lucide-solid';
import QuestionIcon from 'lucide-solid/icons/circle-question-mark';
import AlertIcon from 'lucide-solid/icons/alert-circle';
import InfoIcon from 'lucide-solid/icons/info';

export interface IconTooltipProps extends TooltipProps {
  icon: LucideIcon;
  color?: string;
  size?: string | number;
  strokeWidth?: string | number;
  class?: string;
  absoluteStrokeWidth?: boolean;
}

export function IconTooltip(props: IconTooltipProps) {
  const [selfProps, rest] = splitProps(props, [
    'icon',
    'color',
    'size',
    'strokeWidth',
    'class',
    'absoluteStrokeWidth',
  ]);
  const [_, iconProps] = splitProps(selfProps, ['icon']);

  return (
    <Tooltip
      {...rest}
      openDelay={rest.openDelay ?? 100}
      closeDelay={rest.closeDelay ?? 100}
    >
      <Dynamic component={props.icon} {...iconProps} />
    </Tooltip>
  );
}

export function QuestionIconTooltip(props: Omit<IconTooltipProps, 'icon'>) {
  return <IconTooltip {...props} icon={QuestionIcon} />;
}

export function AlertIconTooltip(props: Omit<IconTooltipProps, 'icon'>) {
  return <IconTooltip {...props} icon={AlertIcon} />;
}

export function InfoIconTooltip(props: Omit<IconTooltipProps, 'icon'>) {
  return <IconTooltip {...props} icon={InfoIcon} />;
}
