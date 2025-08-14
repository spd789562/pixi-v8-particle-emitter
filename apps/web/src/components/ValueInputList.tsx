import { For, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { produce, type SetStoreFunction } from 'solid-js/store';

import PlusIcon from 'lucide-solid/icons/plus';
import TrashIcon from 'lucide-solid/icons/trash';
import {
  MouseNumberInput,
  ColorPickerBlock,
  cn,
  type MouseNumberInputProps,
} from '@repo/ui';

import type { ValueList } from '@repo/emitter';

export interface ValueInputListProps<T> {
  data: ValueList<T>;
  onChange: SetStoreFunction<ValueList<T>>;
  valueInputProps?: MouseNumberInputProps;
  type?: 'number' | 'color';
}

export function ValueInputList<T>(props: ValueInputListProps<T>) {
  function onProgressChange(index: number, progress: number) {
    props.onChange(
      produce((draft) => {
        draft.list[index].time = progress;
      }),
    );
  }
  function onAddNext(index: number) {
    const item = props.data.list[index];
    const newItem = {
      time: item.time + 0.01,
      value: item.value,
    };
    props.onChange(
      produce((draft) => {
        draft.list.splice(index + 1, 0, newItem);
      }),
    );
  }
  function onRemove(index: number) {
    props.onChange(
      produce((draft) => {
        draft.list.splice(index, 1);
      }),
    );
  }
  function onValueChange(index: number, value: T) {
    props.onChange(
      produce((draft) => {
        draft.list[index].value = value;
      }),
    );
  }

  return (
    <div class="flex flex-col gap-0.5">
      <div class="flex items-center gap-2 text-center">
        <div class="w-18">%</div>
        <div class="flex-1">value</div>
      </div>
      <For each={props.data.list}>
        {(item, index) => (
          <Dynamic
            component={
              props.type === 'color' ? ValueColorItem : ValueNumberInputItem
            }
            progress={item.time}
            /* force cast fix this later */
            value={item.value as number}
            onProgressChange={(v) => onProgressChange(index(), v)}
            onValueChange={(v: any) => onValueChange(index(), v as T)}
            pin={index() === 0 || index() === props.data.list.length - 1}
            hasAddNext={index() !== props.data.list.length - 1}
            onAddNext={() => onAddNext(index())}
            onRemove={() => onRemove(index())}
            valueInputProps={props.valueInputProps}
          />
        )}
      </For>
    </div>
  );
}

export interface ValueNumberInputItemProps {
  progress: number;
  value: number;
  onProgressChange: (progress: number) => void;
  onValueChange: (value: number) => void;
  onAddNext?: () => void;
  onRemove?: () => void;
  hasAddNext?: boolean;
  disabled?: boolean;
  pin?: boolean;
  valueInputProps?: MouseNumberInputProps;
}
export function ValueNumberInputItem(props: ValueNumberInputItemProps) {
  return (
    <div
      class={cn(
        'flex gap-2 items-center p-1 rounded-sm',
        props.pin && 'bg-gray-50',
      )}
    >
      <div class="w-18 shrink-0">
        <MouseNumberInput
          step={0.01}
          minValue={0}
          maxValue={1}
          numberPrecision={2}
          slideMultiplier={0.01}
          rawValue={props.progress}
          onRawValueChange={props.onProgressChange}
          disabled={props.disabled || props.pin}
        />
      </div>
      <div class="flex-1">
        <MouseNumberInput
          rawValue={props.value}
          onRawValueChange={props.onValueChange}
          disabled={props.disabled}
          {...props.valueInputProps}
        />
      </div>
      <Show when={!props.pin}>
        <button
          type="button"
          class="p-2 bg-transparent cursor-pointer hover:bg-gray-100"
          onClick={props.onRemove}
        >
          <TrashIcon size={16} />
        </button>
      </Show>
      <Show when={props.hasAddNext}>
        <button
          type="button"
          class="p-2 bg-transparent cursor-pointer hover:bg-gray-100"
          onClick={props.onAddNext}
        >
          <PlusIcon size={16} />
        </button>
      </Show>
    </div>
  );
}

export interface ValueColorItemProps {
  progress: number;
  value: string;
  onProgressChange: (progress: number) => void;
  onValueChange: (value: string) => void;
  onAddNext?: () => void;
  onRemove?: () => void;
  hasAddNext?: boolean;
  disabled?: boolean;
  pin?: boolean;
}
export function ValueColorItem(props: ValueColorItemProps) {
  return (
    <div
      class={cn(
        'flex gap-2 items-center p-1 rounded-sm',
        props.pin && 'bg-gray-50',
      )}
    >
      <div class="w-18 shrink-0">
        <MouseNumberInput
          step={0.01}
          minValue={0}
          maxValue={1}
          numberPrecision={2}
          slideMultiplier={0.01}
          rawValue={props.progress}
          onRawValueChange={props.onProgressChange}
          disabled={props.disabled || props.pin}
        />
      </div>
      <div class="flex-1">
        <div class="w-32 h-8">
          <ColorPickerBlock
            value={props.value}
            onChange={(c) => props.onValueChange(c.toString('hex'))}
            disabled={props.disabled}
          />
        </div>
      </div>
      <Show when={!props.pin}>
        <button
          type="button"
          class="p-2 bg-transparent cursor-pointer hover:bg-gray-100"
          onClick={props.onRemove}
        >
          <TrashIcon size={16} />
        </button>
      </Show>
      <Show when={props.hasAddNext}>
        <button
          type="button"
          class="p-2 bg-transparent cursor-pointer hover:bg-gray-100"
          onClick={props.onAddNext}
        >
          <PlusIcon size={16} />
        </button>
      </Show>
    </div>
  );
}
