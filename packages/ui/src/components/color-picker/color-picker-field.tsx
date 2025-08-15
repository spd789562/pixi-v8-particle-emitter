import { type JSX, Show } from 'solid-js';
import type { Color } from '@kobalte/core/colors';
import { ColorPickerBlock } from './color-picker-block';

import './style.css';

export interface ColorPickerFieldProps {
  id?: string;
  value?: string;
  onChange?: (value: Color) => void;
  label?: JSX.Element;
  description?: JSX.Element;
  errorMessage?: JSX.Element;
  disabled?: boolean;
}

export function ColorPickerField(props: ColorPickerFieldProps) {
  const inputId = props.id ?? 'color-picker-field';
  return (
    <div role="group" class="color-picker-field">
      <Show when={props.label}>
        <label class="color-picker-field__label" for={inputId}>
          {props.label}
        </label>
      </Show>
      <div class="color-picker-field__trigger">
        <ColorPickerBlock value={props.value} onChange={props.onChange} />
      </div>
      <Show when={props.description}>
        <div class="color-picker-field__description">{props.description}</div>
      </Show>
      <Show when={props.errorMessage}>
        <div class="color-picker-field__error-message">
          {props.errorMessage}
        </div>
      </Show>
    </div>
  );
}
