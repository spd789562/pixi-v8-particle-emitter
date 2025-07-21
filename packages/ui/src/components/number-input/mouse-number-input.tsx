import { Show, splitProps } from 'solid-js';

import {
  NumberField,
  type NumberFieldRootProps,
} from '@kobalte/core/number-field';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-solid';
import { makeMousePositionListener } from '@solid-primitives/mouse';

import './style.css';

export interface MouseNumberInputProps extends NumberFieldRootProps {
  label?: string;
  description?: string;
  errorMessage?: string;
  slideMultiplier?: number;
}

export function MouseNumberInput(props: MouseNumberInputProps) {
  let clearListener: (() => void) | undefined;
  const [_, rest] = splitProps(props, [
    'label',
    'description',
    'errorMessage',
    'slideMultiplier',
  ]);
  const multiplier = () => props.slideMultiplier ?? 1;

  function handleMouseDown(e: MouseEvent) {
    const startX = e.clientX;
    const startValue = Number(props.value ?? 0);

    clearListener = makeMousePositionListener(
      e.currentTarget as HTMLElement,
      (e) => {
        const offsetX = e.x - startX;
        props.onRawValueChange?.(
          startValue + Math.floor(offsetX * multiplier()),
        );
      },
      {
        touch: false,
      },
    );
  }
  function handleMouseUp() {
    clearListener?.();
  }

  return (
    <NumberField class="number-field" {...rest}>
      <Show when={props.label}>
        <NumberField.Label class="number-field__label">
          {props.label}
        </NumberField.Label>
      </Show>
      <div class="number-field__group">
        <NumberField.Input
          class="number-field__input"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
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
      <Show when={props.description}>
        <NumberField.Description class="number-field__description">
          {props.description}
        </NumberField.Description>
      </Show>
      <Show when={props.errorMessage}>
        <NumberField.ErrorMessage class="number-field__error-message">
          {props.errorMessage}
        </NumberField.ErrorMessage>
      </Show>
    </NumberField>
  );
}
