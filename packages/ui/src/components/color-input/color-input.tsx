import { Show, splitProps, type JSX } from 'solid-js';

import {
  ColorField as KColorField,
  type ColorFieldRootProps,
} from '@kobalte/core/color-field';

import './style.css';

export interface ColorInputProps extends ColorFieldRootProps {
  label?: JSX.Element;
  description?: JSX.Element;
  errorMessage?: JSX.Element;
}

export function ColorInput(props: ColorInputProps) {
  const [_, rest] = splitProps(props, ['label', 'description', 'errorMessage']);

  return (
    <KColorField {...rest} class="color-field">
      <Show when={props.label}>
        <KColorField.Label class="color-field__label">
          {props.label}
        </KColorField.Label>
      </Show>
      <KColorField.Input class="color-field__input" />
      <Show when={props.description}>
        <KColorField.Description class="color-field__description">
          {props.description}
        </KColorField.Description>
      </Show>
      <KColorField.ErrorMessage class="color-field__error-message">
        {props.errorMessage}
      </KColorField.ErrorMessage>
    </KColorField>
  );
}
