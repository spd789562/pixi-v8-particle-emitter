import { Show } from 'solid-js';

import {
  ColorArea as KColorArea,
  type ColorAreaRootProps,
} from '@kobalte/core/color-area';

import './style.css';

export interface ColorAreaProps extends ColorAreaRootProps {
  label?: string;
}

export function ColorArea(props: ColorAreaProps) {
  return (
    <KColorArea {...props} class="color-area">
      <Show when={props.label}>
        <KColorArea.Label class="color-area__label">
          {props.label}
        </KColorArea.Label>
      </Show>
      <KColorArea.Background class="color-area__background">
        <KColorArea.Thumb class="color-area__thumb">
          <KColorArea.HiddenInputX />
          <KColorArea.HiddenInputY />
        </KColorArea.Thumb>
      </KColorArea.Background>
    </KColorArea>
  );
}
