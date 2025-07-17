import { Show, splitProps } from 'solid-js';

import {
  NumberField,
  type NumberFieldRootProps,
} from '@kobalte/core/number-field';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-solid';

import './style.css';

export interface NumberInputProps extends NumberFieldRootProps {
  label?: string;
  description?: string;
  errorMessage?: string;
}

export function NumberInput(props: NumberInputProps) {
  const [local, rest] = splitProps(props, [
    'label',
    'description',
    'errorMessage',
  ]);

  return (
    <NumberField class="number-field" {...rest}>
      <Show when={local.label}>
        <NumberField.Label class="number-field__label">
          {local.label}
        </NumberField.Label>
      </Show>
      <div class="number-field__group">
        <NumberField.Input class="number-field__input" />
        <NumberField.IncrementTrigger
          aria-label="Increment"
          class="number-field__increment"
        >
          <ChevronUpIcon width="16px" />
        </NumberField.IncrementTrigger>
        <NumberField.DecrementTrigger
          aria-label="Decrement"
          class="number-field__decrement"
        >
          <ChevronDownIcon width="16px" />
        </NumberField.DecrementTrigger>
      </div>
      <Show when={local.description}>
        <NumberField.Description class="number-field__description">
          {local.description}
        </NumberField.Description>
      </Show>
      <Show when={local.errorMessage}>
        <NumberField.ErrorMessage class="number-field__error-message">
          {local.errorMessage}
        </NumberField.ErrorMessage>
      </Show>
    </NumberField>
  );
}
