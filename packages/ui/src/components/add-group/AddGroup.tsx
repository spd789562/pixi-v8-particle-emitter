import { splitProps, For, Show, createSignal } from 'solid-js';
import { DropdownMenu } from '@kobalte/core/dropdown-menu';

import { cn } from '../../utils';
import { DropdownMenuItemList } from '../dropdown-menu';
import PlusIcon from 'lucide-solid/icons/plus';
import XIcon from 'lucide-solid/icons/x';

import './style.css';

export interface AddGroupItem {
  value: string;
  image?: string;
  label?: string;
}

export interface AddGroupProps {
  value: string[];
  options: AddGroupItem[];
  onValueChange?: (value: string[]) => void;
  class?: string;
  itemClass?: string;
  showIndex?: boolean;
  removable?: boolean;
}

export function AddGroup(props: AddGroupProps) {
  const [_, rest] = splitProps(props, [
    'value',
    'options',
    'onValueChange',
    'class',
    'itemClass',
    'showIndex',
    'removable',
  ]);

  const [isOpen, setIsOpen] = createSignal(false);

  const currentItems = () => {
    return props.value.map((val) => {
      const option = props.options.find((opt) => opt.value === val);
      return option || { value: val, label: val };
    });
  };

  const handleAddItem = (optionValue: string) => {
    const newValue = [...props.value, optionValue];
    props.onValueChange?.(newValue);
    setIsOpen(false);
  };

  const handleRemoveItem = (indexToRemove: number) => {
    const newValue = props.value.filter((_, index) => index !== indexToRemove);
    props.onValueChange?.(newValue);
  };

  return (
    <div class={cn('add-group', props.class)} {...rest}>
      <For each={currentItems()}>
        {(item, index) => (
          <div class={cn('add-group__item', props.itemClass)}>
            <Show when={item.image}>
              <img
                src={item.image}
                alt={item.label || item.value}
                class="add-group__item-image"
              />
            </Show>
            <Show when={!item.image}>
              <span>{item.label || item.value}</span>
            </Show>

            <Show when={!props.showIndex}>
              <span class="add-group__item-index">{index() + 1}</span>
            </Show>

            <Show when={!props.removable}>
              <button
                type="button"
                class="add-group__item-index-close"
                onClick={() => handleRemoveItem(index())}
                aria-label={`Remove ${item.label || item.value}`}
              >
                <XIcon size={12} />
              </button>
            </Show>
          </div>
        )}
      </For>

      <DropdownMenu open={isOpen()} onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger class="add-group__plus" aria-label="Add item">
          <PlusIcon size={16} />
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content class="dropdown-menu__content">
            <DropdownMenuItemList
              items={props.options.map((opt) => opt.value)}
              onSelectItem={handleAddItem}
            />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu>
    </div>
  );
}
