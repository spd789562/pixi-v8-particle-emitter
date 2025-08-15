import type { JSX } from 'solid-js';
import { MouseNumberInput, Switch } from '@repo/ui';

export interface MinMaxInputGroupProps {
  step?: number;
  min?: number;
  max?: number;
  slideMultiplier?: number;
  numberPrecision?: number;
  disabled?: boolean;
  separator?: JSX.Element;

  minLabel?: JSX.Element;
  maxLabel?: JSX.Element;
  syncText?: JSX.Element;
  minValue?: number;
  maxValue?: number;
  sync?: boolean;

  setMinValue: (value: number) => void;
  setMaxValue: (value: number) => void;
  setSync: (value: boolean) => void;
}

export function MinMaxInputGroup(props: MinMaxInputGroupProps) {
  function handleMinChange(value: number) {
    props.setMinValue?.(value);
    if (props.sync) {
      props.setMaxValue?.(value);
    }
  }
  function handleMaxChange(value: number) {
    props.setMaxValue?.(value);
    if (props.sync) {
      props.setMinValue?.(value);
    }
  }

  return (
    <div class="flex flex-col gap-2">
      <div class="flex gap-2 items-center">
        <MouseNumberInput
          label={props.minLabel ?? 'Min'}
          rawValue={props.minValue}
          onRawValueChange={handleMinChange}
          step={props.step}
          minValue={props.min}
          maxValue={props.max}
          slideMultiplier={props.slideMultiplier}
          numberPrecision={props.numberPrecision}
          disabled={props.disabled}
        />
        <span class="pt-5">{props.separator ?? '~'}</span>
        <MouseNumberInput
          label={props.maxLabel ?? 'Max'}
          rawValue={props.maxValue}
          onRawValueChange={handleMaxChange}
          step={props.step}
          minValue={props.min}
          maxValue={props.max}
          slideMultiplier={props.slideMultiplier}
          numberPrecision={props.numberPrecision}
          disabled={props.disabled}
        />
      </div>
      <Switch
        label={props.syncText ?? 'sync min & max'}
        checked={props.sync}
        onChange={props.setSync}
        disabled={props.disabled}
      />
    </div>
  );
}
