import { splitProps, Show } from 'solid-js';

import { Switch as KSwitch, type SwitchRootProps } from '@kobalte/core/switch';

import './style.css';

export interface SwitchProps extends SwitchRootProps {
  label?: string;
  description?: string;
}

export function Switch(props: SwitchProps) {
  const [local, rest] = splitProps(props, ['description']);

  return (
    <KSwitch {...rest}>
      <KSwitch.Label>{props.label}</KSwitch.Label>
      <Show when={local.description}>
        <KSwitch.Description>{local.description}</KSwitch.Description>
      </Show>
      <KSwitch.Input />
      <KSwitch.Control>
        <KSwitch.Thumb />
      </KSwitch.Control>
    </KSwitch>
  );
}
