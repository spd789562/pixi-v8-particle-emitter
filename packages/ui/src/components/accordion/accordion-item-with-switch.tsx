import { splitProps } from 'solid-js';

import { AccordionItem, type AccordionItemProps } from './accordion-item';
import { Switch } from '../switch';

export interface AccordionItemWithSwitchProps extends AccordionItemProps {
  id?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function AccordionItemWithSwitch(props: AccordionItemWithSwitchProps) {
  const [_, itemProps] = splitProps(props, ['checked', 'onChange', 'id']);

  function preventPropagation(e: Event) {
    e.stopPropagation();
  }

  return (
    <AccordionItem
      {...itemProps}
      title={
        <div class="accordion__item-trigger-title">
          <Switch
            id={props.id}
            checked={props.checked}
            onChange={props.onChange}
            onClickSwitch={preventPropagation}
          />
          <label for={`${props.id}-input`}>{props.title}</label>
        </div>
      }
    />
  );
}
