import { type JSX, Index } from 'solid-js';
import { DropdownMenu } from '@kobalte/core/dropdown-menu';
import { Button, type ButtonWrapperProps } from '../button';
import ChevronDownIcon from 'lucide-solid/icons/chevron-down';

import './style.css';

interface DropdownMenuTriggerProps extends ButtonWrapperProps {
  children: JSX.Element;
}
export const DropdownMenuTrigger = (props: DropdownMenuTriggerProps) => {
  return (
    <DropdownMenu.Trigger>
      <Button {...props}>
        {props.children}
        <DropdownMenu.Icon class="dropdown-menu__trigger-icon">
          <ChevronDownIcon />
        </DropdownMenu.Icon>
      </Button>
    </DropdownMenu.Trigger>
  );
};

export interface DropdownMenuItemListProps<T extends string> {
  items: T[];
  onSelectItem?: (item: T) => void;
}
export const DropdownMenuItemList = <T extends string>(
  props: DropdownMenuItemListProps<T>,
) => {
  function handleClick(item: T) {
    props.onSelectItem?.(item);
  }

  return (
    <Index each={props.items}>
      {(item) => (
        <DropdownMenu.Item
          class="dropdown-menu__item"
          onSelect={() => handleClick(item())}
        >
          {item()}
        </DropdownMenu.Item>
      )}
    </Index>
  );
};
