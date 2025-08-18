import { splitProps } from 'solid-js';

import { AccordionItem, type AccordionItemProps } from './accordion-item';
import { useAccordionContext } from '@kobalte/core/accordion';

import { Switch } from '../switch';

export interface AccordionItemWithSwitchProps extends AccordionItemProps {
  id?: string;
  checked?: boolean;
  onChange?: (checked: boolean, value: string) => void;
}

export function AccordionItemWithSwitch(props: AccordionItemWithSwitchProps) {
  const [_, itemProps] = splitProps(props, ['checked', 'onChange', 'id']);

  const ctx = useAccordionContext();

  function preventPropagation(e: Event) {
    e.stopPropagation();
  }

  function syncAccordionWithSwitch(checked: boolean) {
    const selectionManager = ctx.listState().selectionManager();

    const isCurrentSelected = selectionManager.isSelected(props.value);

    if (checked === !isCurrentSelected) {
      selectionManager.select(props.value);
    }

    props.onChange?.(checked, props.value);
  }

  return (
    <AccordionItem
      {...itemProps}
      title={
        <div class="accordion__item-trigger-title">
          <Switch
            id={props.id}
            checked={props.checked}
            onChange={syncAccordionWithSwitch}
            onClickSwitch={preventPropagation}
          />
          <label for={`${props.id}-input`}>{props.title}</label>
        </div>
      }
    />
  );
}
