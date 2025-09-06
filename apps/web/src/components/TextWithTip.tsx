import type { JSX } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import {
  InfoIconTooltip,
  QuestionIconTooltip,
  AlertIconTooltip,
  type IconTooltipProps,
  cn,
} from '@repo/ui';

export interface TextWithTipProps {
  children: JSX.Element;
  tip: string;
  icon?: 'info' | 'question' | 'alert';
  class?: string;
  size?: string | number;
  placement?: IconTooltipProps['placement'];
}

const TipComponent = {
  info: InfoIconTooltip,
  question: QuestionIconTooltip,
  alert: AlertIconTooltip,
};

export function TextWithTip(props: TextWithTipProps) {
  return (
    <div class={cn('flex items-center gap-1', props.class)}>
      {props.children}
      <Dynamic
        component={TipComponent[props.icon ?? 'info']}
        description={props.tip}
        size={props.size ?? 14}
        placement={props.placement ?? 'top'}
      />
    </div>
  );
}
