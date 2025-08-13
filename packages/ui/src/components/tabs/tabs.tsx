import { For, splitProps, type JSX } from 'solid-js';

import { Tabs as KTabs, type TabsRootProps } from '@kobalte/core/tabs';

import './style.css';

export interface SimpleTabsProps extends TabsRootProps {
  tabs: {
    label: JSX.Element;
    value: string;
    content: JSX.Element;
  }[];
}

export function SimpleTabs(props: SimpleTabsProps) {
  const [_, tabProps] = splitProps(props, ['tabs']);

  return (
    <KTabs aria-label="Main navigation" class="tabs" {...tabProps}>
      <KTabs.List class="tabs__list">
        <For each={props.tabs}>
          {(tab) => (
            <KTabs.Trigger class="tabs__trigger flex-1" value={tab.value}>
              {tab.label}
            </KTabs.Trigger>
          )}
        </For>
      </KTabs.List>
      <For each={props.tabs}>
        {(tab) => (
          <KTabs.Content class="tabs__content" value={tab.value}>
            {tab.content}
          </KTabs.Content>
        )}
      </For>
    </KTabs>
  );
}
