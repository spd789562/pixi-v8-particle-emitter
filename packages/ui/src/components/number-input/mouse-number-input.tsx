import { Show, splitProps, type JSX } from 'solid-js';

import {
  NumberField,
  type NumberFieldRootProps,
} from '@kobalte/core/number-field';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-solid';
import { makeMousePositionListener } from '@solid-primitives/mouse';

import './style.css';

export interface MouseNumberInputProps extends NumberFieldRootProps {
  label?: JSX.Element;
  description?: JSX.Element;
  errorMessage?: JSX.Element;
  slideMultiplier?: number;
  numberPrecision?: number;
}

export function MouseNumberInput(props: MouseNumberInputProps) {
  let clearListener: (() => void) | undefined;
  const [_, rest] = splitProps(props, [
    'label',
    'description',
    'errorMessage',
    'slideMultiplier',
    'numberPrecision',
  ]);
  const multiplier = () => props.slideMultiplier ?? 1;
  const precision = () => props.numberPrecision ?? 0;
  const clamp = (value: number) => {
    return Math.max(
      props.minValue ?? Number.MIN_SAFE_INTEGER,
      Math.min(props.maxValue ?? Number.MAX_SAFE_INTEGER, value),
    );
  };

  function handleMouseDown(e: MouseEvent) {
    const startX = e.clientX;
    const startValue = props.rawValue ?? 0;
    const mouseDownTime = Date.now();

    clearListener = makeMousePositionListener(
      e.currentTarget as HTMLElement,
      (e) => {
        if (Date.now() - mouseDownTime < 100) {
          return;
        }

        const offsetX = e.x - startX;
        const result = startValue + offsetX * multiplier();
        props.onRawValueChange?.(clamp(result));
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
    <NumberField
      class="number-field"
      {...rest}
      formatOptions={{
        maximumFractionDigits: precision(),
        // default to not grouping like 1,000 -> 1000
        useGrouping: false,
        ...rest.formatOptions,
      }}
    >
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
