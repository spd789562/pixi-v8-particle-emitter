import { Show, type JSX } from 'solid-js';

export interface InputGroupProps {
  title?: JSX.Element;
  class?: string;
  children?: JSX.Element;
}

export function InputGroup(props: InputGroupProps) {
  return (
    <div
      class={`flex flex-col gap-2 py-2 rounded-md bg-gray-50 mx-[-8px] px-2 ${props.class}`}
    >
      <Show when={props.title}>
        <h5 class="text-sm font-medium">{props.title}</h5>
      </Show>
      {props.children}
    </div>
  );
}
