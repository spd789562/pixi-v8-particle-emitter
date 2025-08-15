import { splitProps, Index, Show } from 'solid-js';

import {
  SegmentedControl as KSegmentedControl,
  type SegmentedControlRootProps,
} from '@kobalte/core/segmented-control';

export interface SegmentedControlProps extends SegmentedControlRootProps {
  items: string[];
  label?: string;
}

export function SegmentedControl(props: SegmentedControlProps) {
  const [_, rest] = splitProps(props, ['items', 'label']);

  return (
    <KSegmentedControl class="segmented-control" {...rest}>
      <Show when={props.label}>
        <KSegmentedControl.Label class="segmented-control__label">
          {props.label}
        </KSegmentedControl.Label>
      </Show>
      <div class="segmented-control__wrapper" role="presentation">
        <KSegmentedControl.Indicator class="segmented-control__indicator" />
        <div class="segmented-control__items" role="presentation">
          <Index each={props.items}>
            {(item) => (
              <KSegmentedControl.Item
                value={item().toLowerCase()}
                class="segmented-control__item"
              >
                <KSegmentedControl.ItemInput class="segmented-control__item-input" />
                <KSegmentedControl.ItemLabel class="segmented-control__item-label">
                  {item()}
                </KSegmentedControl.ItemLabel>
              </KSegmentedControl.Item>
            )}
          </Index>
        </div>
      </div>
    </KSegmentedControl>
  );
}
