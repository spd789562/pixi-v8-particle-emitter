import { splitProps, Show, type JSX } from 'solid-js';

import { Switch as KSwitch, type SwitchRootProps } from '@kobalte/core/switch';

import './style.css';

export interface SwitchProps extends SwitchRootProps {
  label?: JSX.Element;
  description?: JSX.Element;
  reverse?: boolean;
  onClickSwitch?: (e: PointerEvent) => void;
}

export function Switch(props: SwitchProps) {
  const [_, rest] = splitProps(props, [
    'description',
    'reverse',
    'label',
    'onClickSwitch',
  ]);

  return (
    <KSwitch
      class={`switch ${props.reverse ? 'switch--reverse' : ''}`}
      {...rest}
      onClick={props.onClickSwitch}
    >
      <Show when={props.label && !props.reverse}>
        <KSwitch.Label class="switch__label">{props.label}</KSwitch.Label>
      </Show>
      <Show when={props.description}>
        <KSwitch.Description>{props.description}</KSwitch.Description>
      </Show>
      <KSwitch.Input class="switch__input" />
      <KSwitch.Control class="switch__control">
        <KSwitch.Thumb class="switch__thumb" />
      </KSwitch.Control>
      <Show when={props.label && props.reverse}>
        <KSwitch.Label class="switch__label">{props.label}</KSwitch.Label>
      </Show>
    </KSwitch>
  );
}
