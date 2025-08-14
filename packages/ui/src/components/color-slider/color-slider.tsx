import { Show } from 'solid-js';

import {
  ColorSlider as KColorSlider,
  type ColorSliderRootProps,
} from '@kobalte/core/color-slider';

import './style.css';

export interface ColorSliderProps extends ColorSliderRootProps {
  label?: string;
  valueLabel?: string;
}

export function ColorSlider(props: ColorSliderProps) {
  return (
    <KColorSlider {...props} class="color-slider">
      <Show when={props.label || props.valueLabel}>
        <div class="color-slider__label">
          <KColorSlider.Label class="color-slider__label">
            {props.label}
          </KColorSlider.Label>
          <Show when={props.valueLabel}>
            <KColorSlider.ValueLabel />
          </Show>
        </div>
      </Show>
      <KColorSlider.Track class="color-slider__track">
        <KColorSlider.Thumb class="color-slider__thumb">
          <KColorSlider.Input />
        </KColorSlider.Thumb>
      </KColorSlider.Track>
    </KColorSlider>
  );
}
