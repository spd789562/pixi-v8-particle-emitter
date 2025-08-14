import { For, Show } from 'solid-js';
import { produce, type SetStoreFunction } from 'solid-js/store';
import type { PointData } from 'pixi.js';

import PlusIcon from 'lucide-solid/icons/plus';
import TrashIcon from 'lucide-solid/icons/trash';
import { MouseNumberInput, cn } from '@repo/ui';

export interface PosInputListProps {
  data: PointData[];
  onChange: SetStoreFunction<PointData[]>;
}

export function PosInputList(props: PosInputListProps) {
  function onAddNext(index: number) {
    const item = props.data[index];
    const newItem = {
      x: item.x + 0.01,
      y: item.y,
    };
    props.onChange(
      produce((draft) => {
        draft.splice(index + 1, 0, newItem);
      }),
    );
  }
  function onRemove(index: number) {
    props.onChange(
      produce((draft) => {
        draft.splice(index, 1);
      }),
    );
  }
  function onValueChange(index: number, field: 'x' | 'y', value: number) {
    props.onChange(
      produce((draft) => {
        draft[index][field] = value;
      }),
    );
  }

  return (
    <div class="flex flex-col gap-0.5">
      <For each={props.data}>
        {(item, index) => (
          <PosInputItem
            x={item.x}
            y={item.y}
            onXChange={(v) => onValueChange(index(), 'x', v)}
            onYChange={(v) => onValueChange(index(), 'y', v)}
            pin={index() === 0 || index() === props.data.length - 1}
            hasAddNext
            onAddNext={() => onAddNext(index())}
            onRemove={() => onRemove(index())}
          />
        )}
      </For>
    </div>
  );
}

export interface PosInputItemProps {
  x: number;
  y: number;
  onXChange: (x: number) => void;
  onYChange: (y: number) => void;
  onAddNext?: () => void;
  onRemove?: () => void;
  hasAddNext?: boolean;
  disabled?: boolean;
  pin?: boolean;
}
export function PosInputItem(props: PosInputItemProps) {
  return (
    <div
      class={cn(
        'flex gap-2 items-center p-1 rounded-sm',
        props.pin && 'bg-gray-50',
      )}
    >
      <div class="flex flex-1 items-center">
        <div class="px-2">x</div>
        <MouseNumberInput
          rawValue={props.x}
          onRawValueChange={props.onXChange}
          disabled={props.disabled}
        />
      </div>
      <div class="flex flex-1 items-center">
        <div class="px-2">y</div>
        <MouseNumberInput
          rawValue={props.y}
          onRawValueChange={props.onYChange}
          disabled={props.disabled}
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
