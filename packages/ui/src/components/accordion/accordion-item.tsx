import { type JSX, splitProps } from 'solid-js';
import { Accordion, type AccordionItemOptions } from '@kobalte/core/accordion';
import ChevronDownIcon from 'lucide-solid/icons/chevron-down';

import './style.css';

export interface AccordionItemProps extends AccordionItemOptions {
  title?: JSX.Element;
  children?: JSX.Element;
}

export function AccordionItem(props: AccordionItemProps) {
  const [local, itemProps] = splitProps(props, ['title', 'children']);

  return (
    <Accordion.Item {...itemProps}>
      <Accordion.Header class="accordion__item-header">
        <Accordion.Trigger class="accordion__item-trigger">
          <div>{local.title}</div>
          <ChevronDownIcon class="accordion__item-trigger-icon" aria-hidden />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content class="accordion__item-content">
        <div class="accordion__item-content-body">{local.children}</div>
      </Accordion.Content>
    </Accordion.Item>
  );
}
