import { splitProps, Show, type JSX } from 'solid-js';
import { Select as KbSelect, type SelectRootProps } from '@kobalte/core/select';
import type { PolymorphicProps } from '@kobalte/core';

import CheckIcon from 'lucide-solid/icons/check';
import ChevronsUpDownIcon from 'lucide-solid/icons/chevrons-up-down';

import './style.css';

export interface SelectItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export type SelectProps = SelectRootProps<SelectItem> & {
  label?: JSX.Element;
  description?: JSX.Element;
  errorMessage?: JSX.Element;
};

export function Select(props: PolymorphicProps<'div', SelectProps>) {
  const [_, rest] = splitProps(props, ['label', 'description', 'errorMessage']);

  return (
    <KbSelect
      optionValue="value"
      optionTextValue="label"
      optionDisabled="disabled"
      {...rest}
      itemComponent={(props) => (
        <KbSelect.Item item={props.item} class="select__item">
          <KbSelect.ItemLabel>{props.item.rawValue.label}</KbSelect.ItemLabel>
          <KbSelect.ItemIndicator class="select__item-indicator">
            <CheckIcon />
          </KbSelect.ItemIndicator>
        </KbSelect.Item>
      )}
    >
      <Show when={props.label}>
        <KbSelect.Label class="select__label">{props.label}</KbSelect.Label>
      </Show>
      <KbSelect.Trigger class="select__trigger" aria-label="Fruit">
        <KbSelect.Value class="select__value">
          {(state) => state.selectedOption() as string}
        </KbSelect.Value>
        <KbSelect.Icon class="select__icon">
          <ChevronsUpDownIcon />
        </KbSelect.Icon>
      </KbSelect.Trigger>
      <Show when={props.description}>
        <KbSelect.Description class="select__description">
          {props.description}
        </KbSelect.Description>
      </Show>
      <Show when={props.errorMessage}>
        <KbSelect.ErrorMessage class="select__error-message">
          {props.errorMessage}
        </KbSelect.ErrorMessage>
      </Show>
      <KbSelect.Portal>
        <KbSelect.Content class="select__content">
          <KbSelect.Listbox class="select__listbox" />
        </KbSelect.Content>
      </KbSelect.Portal>
    </KbSelect>
  );
}

export type SimpleSelectProps = SelectRootProps<string> & {
  label?: JSX.Element;
  description?: JSX.Element;
  errorMessage?: JSX.Element;
};

export function SimpleSelect(
  props: PolymorphicProps<'div', SimpleSelectProps>,
) {
  const [_, rest] = splitProps(props, ['label', 'description', 'errorMessage']);

  return (
    <KbSelect
      {...rest}
      itemComponent={(props) => (
        <KbSelect.Item item={props.item} class="select__item">
          <KbSelect.ItemLabel>{props.item.rawValue}</KbSelect.ItemLabel>
          <KbSelect.ItemIndicator class="select__item-indicator">
            <CheckIcon />
          </KbSelect.ItemIndicator>
        </KbSelect.Item>
      )}
    >
      <Show when={props.label}>
        <KbSelect.Label class="select__label">{props.label}</KbSelect.Label>
      </Show>
      <KbSelect.Trigger class="select__trigger" aria-label="Fruit">
        <KbSelect.Value class="select__value">
          {(state) => state.selectedOption() as string}
        </KbSelect.Value>
        <KbSelect.Icon class="select__icon">
          <ChevronsUpDownIcon />
        </KbSelect.Icon>
      </KbSelect.Trigger>
      <Show when={props.description}>
        <KbSelect.Description class="select__description">
          {props.description}
        </KbSelect.Description>
      </Show>
      <Show when={props.errorMessage}>
        <KbSelect.ErrorMessage class="select__error-message">
          {props.errorMessage}
        </KbSelect.ErrorMessage>
      </Show>
      <KbSelect.Portal>
        <KbSelect.Content class="select__content">
          <KbSelect.Listbox class="select__listbox" />
        </KbSelect.Content>
      </KbSelect.Portal>
    </KbSelect>
  );
}
