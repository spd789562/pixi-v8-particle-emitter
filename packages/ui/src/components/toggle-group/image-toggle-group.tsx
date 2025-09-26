import { splitProps, For } from 'solid-js';
import {
  ToggleGroup,
  type ToggleGroupRootProps,
} from '@kobalte/core/toggle-group';
import type { PolymorphicProps } from '@kobalte/core';

import { cn } from '../../utils';

import './style.css';

export type ImageToggleGroupProps = ToggleGroupRootProps<HTMLDivElement> & {
  items: {
    value: string;
    image?: string;
    label?: string;
  }[];
  itemClass?: string;
};

export function ImageToggleGroup(
  props: PolymorphicProps<'div', ImageToggleGroupProps>,
) {
  const [_, toggleGroupProps] = splitProps(props, [
    'items',
    'class',
    'itemClass',
  ]);

  return (
    <ToggleGroup class={cn('toggle-group', props.class)} {...toggleGroupProps}>
      <For each={props.items}>
        {(item) => (
          <ToggleGroup.Item
            class={cn('toggle-group__item', props.itemClass)}
            value={item.value}
            aria-label={item.label}
          >
            <img
              src={item.image}
              alt={item.label}
              class="toggle-group__item-image"
            />
          </ToggleGroup.Item>
        )}
      </For>
    </ToggleGroup>
  );
}
